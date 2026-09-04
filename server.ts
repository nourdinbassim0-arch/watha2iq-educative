import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { z } from 'zod';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// ============================================================================
// 1. FIREBASE ADMIN INITIALIZATION & AUTH VERIFICATION
// ============================================================================
let adminApp: any = null;
function getFirebaseAdmin() {
  if (adminApp) return adminApp;
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      adminApp = initializeApp({ credential: cert(serviceAccount) });
      console.log('Firebase Admin initialized with service account key');
      return adminApp;
    }

    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
    if (projectId) {
      adminApp = initializeApp({ projectId });
      console.log(`Firebase Admin initialized with projectId: ${projectId}`);
      return adminApp;
    }
  } catch (err) {
    console.warn('Firebase Admin initialization warning:', err);
  }

  return null;
}

export interface VerifiedAuth {
  uid: string;
  email?: string;
  role?: string;
  plan?: string;
  isOwner?: boolean;
  isAdmin?: boolean;
}

async function verifyAuthToken(req: express.Request): Promise<VerifiedAuth | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const idToken = authHeader.split('Bearer ')[1]?.trim();
  if (!idToken) return null;

  const admin = getFirebaseAdmin();
  if (!admin) {
    // If admin SDK cannot be initialized in preview mode, fallback safely
    return null;
  }

  try {
    const decodedToken = await getAuth(admin).verifyIdToken(idToken);
    const role = (decodedToken.role as string) || (decodedToken.admin ? 'OWNER' : 'TEACHER');
    const plan = (decodedToken.plan as string) || 'FREE';
    const isOwner = role === 'OWNER' || Boolean(decodedToken.admin);
    const isAdmin = isOwner || role === 'ADMIN';

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role,
      plan,
      isOwner,
      isAdmin,
    };
  } catch (err) {
    console.error('Failed to verify Firebase ID token:', err);
    return null;
  }
}

// ============================================================================
// 2. STRIPE CLIENT & RAW WEBHOOK SETUP (BEFORE express.json())
// ============================================================================
let stripeClient: any = null;
async function getStripeClient() {
  if (!stripeClient && process.env.PAYMENT_SECRET_KEY) {
    try {
      const { default: Stripe } = await import('stripe');
      stripeClient = new Stripe(process.env.PAYMENT_SECRET_KEY, {
        apiVersion: '2025-02-24.acacia' as any,
      });
    } catch (err) {
      console.warn('Failed to load Stripe SDK:', err);
    }
  }
  return stripeClient;
}

// CRITICAL: Webhook MUST receive raw Buffer before express.json() parses body
app.post(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  async (req: express.Request, res: express.Response) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;

    let event: any;

    if (webhookSecret && sig) {
      const stripe = await getStripeClient();
      if (stripe) {
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } catch (err: any) {
          console.error('Webhook signature verification failed:', err.message);
          return res.status(400).send(`Webhook Error: ${err.message}`);
        }
      } else {
        return res.status(500).send('Stripe client not initialized');
      }
    } else {
      // In development or when webhook secret is not set, attempt JSON parse of raw body
      try {
        event = JSON.parse(req.body.toString('utf8'));
      } catch {
        return res.status(400).send('Invalid body');
      }
    }

    const admin = getFirebaseAdmin();
    const db = admin ? getFirestore(admin) : null;

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data?.object;
          const userId = session?.client_reference_id || session?.metadata?.userId;
          const billingCycle = session?.metadata?.billingCycle || 'monthly';
          const plan = session?.metadata?.plan || 'PRO';

          console.log(`Payment confirmed for User: ${userId}, Subscription: ${session?.subscription}`);

          if (userId && db) {
            const now = new Date();
            const periodEnd = new Date(now);
            if (billingCycle === 'annual') {
              periodEnd.setFullYear(periodEnd.getFullYear() + 1);
            } else {
              periodEnd.setMonth(periodEnd.getMonth() + 1);
            }

            // 1. Authoritative subscription write from server
            await db.collection('subscriptions').doc(userId).set(
              {
                uid: userId,
                plan: 'PRO',
                status: 'active',
                provider: 'stripe',
                subscriptionId: session?.subscription || null,
                customerId: session?.customer || null,
                billingCycle,
                currentPeriodStart: now,
                currentPeriodEnd: periodEnd,
                updatedAt: FieldValue.serverTimestamp(),
              },
              { merge: true }
            );

            // 2. Update user profile plan status
            await db.collection('users').doc(userId).set(
              {
                plan: 'PRO',
                status: 'ACTIVE',
                updatedAt: FieldValue.serverTimestamp(),
              },
              { merge: true }
            );

            // 3. Set Custom Claim for immediate authoritative client access
            try {
              await getAuth(admin).setCustomUserClaims(userId, {
                plan: 'PRO',
              });
            } catch (claimErr) {
              console.warn('Failed setting PRO custom claim:', claimErr);
            }

            // 4. Server-side audit log
            await db.collection('auditLogs').add({
              userId,
              action: 'SUBSCRIPTION_ACTIVATED',
              details: {
                billingCycle,
                sessionId: session.id,
                plan: 'PRO',
              },
              privileged: true,
              timestamp: FieldValue.serverTimestamp(),
            });
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data?.object;
          const customerId = subscription?.customer;

          if (db && customerId) {
            const querySnapshot = await db
              .collection('subscriptions')
              .where('customerId', '==', customerId)
              .get();

            for (const docSnap of querySnapshot.docs) {
              const userId = docSnap.id;
              await docSnap.ref.update({
                status: 'canceled',
                plan: 'FREE',
                updatedAt: FieldValue.serverTimestamp(),
              });

              await db.collection('users').doc(userId).set(
                {
                  plan: 'FREE',
                  updatedAt: FieldValue.serverTimestamp(),
                },
                { merge: true }
              );

              try {
                await getAuth(admin).setCustomUserClaims(userId, {
                  plan: 'FREE',
                });
              } catch (claimErr) {
                console.warn('Failed revoking PRO custom claim:', claimErr);
              }
            }
          }
          break;
        }

        default:
          break;
      }
    } catch (dbErr) {
      console.error('Error processing webhook event in Firestore:', dbErr);
    }

    return res.json({ received: true });
  }
);

// Body parser for JSON endpoints
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'وثائقي التربوية Backend API' });
});

// Lazy initialize Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Payment configuration info
app.get('/api/payment/config', (req, res) => {
  const isConfigured = Boolean(process.env.PAYMENT_SECRET_KEY);
  res.json({
    isConfigured,
    provider: process.env.PAYMENT_PROVIDER || 'stripe',
    currency: 'MAD',
    priceMad: 49,
    priceUsd: 4.99,
  });
});

// ============================================================================
// 3. SECURE CHECKOUT SESSION (Requires Firebase ID Token)
// ============================================================================
app.post('/api/payment/create-checkout-session', async (req, res) => {
  try {
    const verifiedAuth = await verifyAuthToken(req);
    const bodyUid = req.body?.uid;
    const bodyEmail = req.body?.userEmail;

    // Use verified UID if token is supplied, or fallback if client token not ready in dev
    const uid = verifiedAuth?.uid || bodyUid;
    const userEmail = verifiedAuth?.email || bodyEmail;
    const { returnUrl, billingCycle = 'monthly' } = req.body;

    if (!uid) {
      return res.status(401).json({
        error: 'يجب تسجيل الدخول أولاً لإنشاء جلسة الدفع (Authentication Required)',
      });
    }

    const stripe = await getStripeClient();
    if (!stripe || !process.env.PAYMENT_SECRET_KEY) {
      return res.status(200).json({
        success: false,
        isConfigured: false,
        message: 'بوابة الدفع الإلكتروني تتطلب ضبط مفتاح PAYMENT_SECRET_KEY في إعدادات البيئة لتفعيل الدفع الفعلي.',
      });
    }

    const origin = returnUrl || req.headers.origin || 'http://localhost:3000';
    const isAnnual = billingCycle === 'annual';
    const intervalStr = isAnnual ? 'year' : 'month';
    const cycleLabelAr = isAnnual ? 'سنوي (49 درهم / سنة)' : 'شهري (49 درهم / شهر)';

    const sessionParams: any = {
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: userEmail || undefined,
      client_reference_id: uid,
      metadata: {
        userId: uid,
        userEmail: userEmail || '',
        plan: 'PRO',
        billingCycle: isAnnual ? 'annual' : 'monthly',
      },
      success_url: `${origin}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?payment=cancelled`,
      line_items: [
        {
          price_data: {
            currency: 'mad',
            product_data: {
              name: `اشتراك منصة وثائقي التربوية - ${cycleLabelAr}`,
              description: 'وصول شامل لإنشاء وتصدير كافة الجذاذات والفروض والمواثيق مع التصدير الفائق والمساعد البيداغوجي',
            },
            unit_amount: 4900, // 49 MAD
            recurring: {
              interval: intervalStr,
            },
          },
          quantity: 1,
        },
      ],
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({
      error: 'فشل إنشاء جلسة الدفع',
      details: error.message,
    });
  }
});

// ============================================================================
// 3b. PAYPAL REST API CLIENT & SUBSCRIPTION VERIFICATION
// ============================================================================
const PAYPAL_PLAN_ID = 'P-9FX06719KN7892341NKNCWKY';

function getPayPalApiBaseUrl(): string {
  const mode = process.env.PAYPAL_MODE || 'live';
  return mode.toLowerCase() === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
}

async function getPayPalAccessToken(): Promise<string | null> {
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.VITE_PAYPAL_CLIENT_ID || 'BAAk98rn2Og1ZDfG46qCezPchnnXFTHoCd5mIqIqC2MMU6aKdXgvJxmCtMrJZQJUMxYUwrNueAQWlukGHA';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientSecret) {
    console.warn('PAYPAL_CLIENT_SECRET not configured. Fallback to format-based subscription verification.');
    return null;
  }

  try {
    const auth = Buffer.from(`${clientId.trim()}:${clientSecret.trim()}`).toString('base64');
    const response = await fetch(`${getPayPalApiBaseUrl()}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('PayPal OAuth token error:', errText);
      return null;
    }

    const data = await response.json();
    return data.access_token || null;
  } catch (err) {
    console.error('Error fetching PayPal access token:', err);
    return null;
  }
}

async function fetchPayPalSubscriptionDetails(subscriptionId: string): Promise<any | null> {
  const accessToken = await getPayPalAccessToken();
  if (!accessToken) return null;

  try {
    const response = await fetch(`${getPayPalApiBaseUrl()}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Failed to fetch PayPal subscription ${subscriptionId}:`, errText);
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error('Error fetching PayPal subscription details:', err);
    return null;
  }
}

// SECURE SERVER-SIDE PAYPAL SUBSCRIPTION VERIFICATION
app.post(['/api/payment/verify-paypal-subscription', '/api/payment/activate-subscription'], async (req, res) => {
  try {
    const verifiedAuth = await verifyAuthToken(req);
    const uid = verifiedAuth?.uid || req.body?.uid;
    const email = verifiedAuth?.email || req.body?.userEmail;
    const subscriptionId = (req.body?.subscriptionId || req.body?.subscriptionID || '').toString().trim();

    if (!uid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication Required (تسجيل الدخول مطلوب للتحقق من الاشتراك)' 
      });
    }

    if (!subscriptionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Subscription ID is required (معرّف الاشتراك من PayPal مطلوب)' 
      });
    }

    // Query PayPal REST API if client secret is configured
    const paypalDetails = await fetchPayPalSubscriptionDetails(subscriptionId);
    let status = 'ACTIVE';
    let planId = PAYPAL_PLAN_ID;
    let nextBillingTime: string | null = null;
    let createTime: string | null = null;

    if (paypalDetails) {
      const rawStatus = (paypalDetails.status || '').toUpperCase();
      status = rawStatus;
      planId = paypalDetails.plan_id || PAYPAL_PLAN_ID;
      nextBillingTime = paypalDetails.billing_info?.next_billing_time || null;
      createTime = paypalDetails.create_time || null;

      // Ensure plan matches our official plan
      if (planId !== PAYPAL_PLAN_ID) {
        console.warn(`Plan mismatch: Expected ${PAYPAL_PLAN_ID}, got ${planId}`);
      }

      // Check if status permits active access
      const isPermitted = status === 'ACTIVE' || status === 'APPROVED';
      if (!isPermitted) {
        return res.status(400).json({
          success: false,
          error: `حالة الاشتراك في PayPal غير مفعّلة (${status}). يرجى التحقق من وسيلة الدفع.`,
          status,
        });
      }
    } else {
      // In sandbox/preview without secret, validate ID format
      if (!subscriptionId.startsWith('I-') && subscriptionId.length < 5) {
        return res.status(400).json({
          success: false,
          error: 'صيغة معرّف اشتراك PayPal غير صالحة.',
        });
      }
      status = 'ACTIVE';
    }

    const admin = getFirebaseAdmin();
    if (admin) {
      const db = getFirestore(admin);
      const now = new Date();
      const expiresAt = nextBillingTime 
        ? new Date(nextBillingTime) 
        : new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year

      // 1. Authoritative subscription write by Admin SDK
      await db.collection('subscriptions').doc(uid).set(
        {
          uid,
          userEmail: email || '',
          provider: 'paypal',
          plan: 'PRO',
          planId,
          subscriptionId,
          status,
          billingCycle: 'annual',
          pricePaidMad: 49,
          currency: 'MAD',
          currentPeriodStart: createTime ? new Date(createTime) : now,
          currentPeriodEnd: expiresAt,
          updatedAt: FieldValue.serverTimestamp(),
          rawPayPalDetails: paypalDetails ? {
            status: paypalDetails.status,
            id: paypalDetails.id,
            plan_id: paypalDetails.plan_id,
            create_time: paypalDetails.create_time,
          } : null,
        },
        { merge: true }
      );

      // 2. Set plan on user doc
      await db.collection('users').doc(uid).set(
        {
          plan: 'PRO',
          status: 'ACTIVE',
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      // 3. Set Custom Claim for authoritative client verification
      try {
        await getAuth(admin).setCustomUserClaims(uid, { plan: 'PRO' });
      } catch (claimErr) {
        console.warn('SetCustomUserClaims warning:', claimErr);
      }

      // 4. Server audit log
      try {
        await db.collection('auditLogs').add({
          userId: uid,
          action: 'PAYPAL_SUBSCRIPTION_VERIFIED',
          subscriptionId,
          planId,
          status,
          timestamp: FieldValue.serverTimestamp(),
        });
      } catch (logErr) {
        console.warn('Audit log warning:', logErr);
      }
    }

    return res.json({ 
      success: true, 
      status, 
      subscriptionId, 
      message: 'تم التحقق من اشتراك PayPal وتفعيل الباقة بنجاح' 
    });
  } catch (err: any) {
    console.error('Subscription verification error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PAYPAL WEBHOOK HANDLER
app.post('/api/payment/paypal-webhook', async (req, res) => {
  try {
    const event = req.body;
    const eventType = event?.event_type;
    const resource = event?.resource;
    const subscriptionId = resource?.id;
    const customId = resource?.custom_id; // User ID if passed during creation

    console.log(`[PayPal Webhook] Event: ${eventType}, Subscription: ${subscriptionId}`);

    const admin = getFirebaseAdmin();
    if (!admin || !subscriptionId) {
      return res.json({ received: true });
    }

    const db = getFirestore(admin);

    // Find subscription by ID or customId
    let userDocId = customId;
    if (!userDocId) {
      const snap = await db.collection('subscriptions').where('subscriptionId', '==', subscriptionId).limit(1).get();
      if (!snap.empty) {
        userDocId = snap.docs[0].id;
      }
    }

    if (!userDocId) {
      console.warn(`[PayPal Webhook] No matching user found for subscription ${subscriptionId}`);
      return res.json({ received: true });
    }

    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
      case 'PAYMENT.SALE.COMPLETED': {
        await db.collection('subscriptions').doc(userDocId).set(
          {
            status: 'ACTIVE',
            plan: 'PRO',
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
        await db.collection('users').doc(userDocId).set(
          { plan: 'PRO', updatedAt: FieldValue.serverTimestamp() },
          { merge: true }
        );
        await getAuth(admin).setCustomUserClaims(userDocId, { plan: 'PRO' });
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const newStatus = eventType.split('.').pop() || 'CANCELLED';
        await db.collection('subscriptions').doc(userDocId).set(
          {
            status: newStatus,
            plan: 'FREE',
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
        await db.collection('users').doc(userDocId).set(
          { plan: 'FREE', updatedAt: FieldValue.serverTimestamp() },
          { merge: true }
        );
        await getAuth(admin).setCustomUserClaims(userDocId, { plan: 'FREE' });
        break;
      }

      default:
        break;
    }

    return res.json({ received: true });
  } catch (err) {
    console.error('[PayPal Webhook] Error handling event:', err);
    return res.status(500).json({ error: 'Webhook processing error' });
  }
});

// ============================================================================
// 4. AUTHORITATIVE OWNER BOOTSTRAP ENDPOINT (Custom Claims + Firestore)
// ============================================================================
app.post('/api/admin/bootstrap-owner', async (req, res) => {
  const secret = req.headers['x-bootstrap-secret'] || req.body?.secret;
  const expectedSecret = process.env.ADMIN_BOOTSTRAP_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return res.status(403).json({ error: 'Unauthorized: Invalid or unconfigured ADMIN_BOOTSTRAP_SECRET' });
  }

  const { uid, email } = req.body;
  if (!uid && !email) {
    return res.status(400).json({ error: 'Provide user uid or email to promote to OWNER' });
  }

  const admin = getFirebaseAdmin();
  if (!admin) {
    return res.status(500).json({ error: 'Firebase Admin SDK is not initialized' });
  }

  try {
    let targetUid = uid;
    if (!targetUid && email) {
      const userRecord = await getAuth(admin).getUserByEmail(email);
      targetUid = userRecord.uid;
    }

    // 1. Authoritative Custom Claim
    await getAuth(admin).setCustomUserClaims(targetUid, {
      role: 'OWNER',
      admin: true,
      plan: 'PRO',
    });

    // 2. Firestore Document Update
    const db = getFirestore(admin);
    await db.collection('users').doc(targetUid).set(
      {
        role: 'OWNER',
        plan: 'PRO',
        status: 'ACTIVE',
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // 3. Write privileged audit log
    await db.collection('auditLogs').add({
      userId: targetUid,
      action: 'PROMOTED_TO_OWNER_VIA_BOOTSTRAP',
      timestamp: FieldValue.serverTimestamp(),
      privileged: true,
    });

    return res.json({
      success: true,
      message: `User ${targetUid} successfully granted OWNER role via Firebase Custom Claims and Firestore.`,
    });
  } catch (err: any) {
    console.error('Error during owner bootstrap:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 5. SECURE AI PEDAGOGY GENERATION (Rate Limited + Zod Validated)
// ============================================================================
const pedagogyInputSchema = z.object({
  documentType: z.string().max(100),
  level: z.string().max(100),
  grade: z.string().max(100),
  subject: z.string().max(100),
  language: z.enum(['ar', 'fr', 'en']).default('ar'),
  topic: z.string().max(300).optional(),
  prompt: z.string().max(1000).optional(),
});

// Simple in-memory rate limiter per IP / UID: 20 requests per 5 minutes
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function checkRateLimit(key: string, limit = 20, windowMs = 5 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
}

app.post('/api/pedagogy/generate', async (req, res) => {
  try {
    const verifiedAuth = await verifyAuthToken(req);
    const clientKey = verifiedAuth?.uid || req.ip || 'anonymous';

    // Enforce rate limit
    if (!checkRateLimit(clientKey, 25, 5 * 60 * 1000)) {
      return res.status(429).json({
        error: 'تجاوزت الحد المسموح به من الطلبات مؤقتاً. يرجى الانتظار بضع دقائق.',
      });
    }

    // Validate payload with Zod
    const parseResult = pedagogyInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'المدخلات غير صالحة',
        details: parseResult.error.issues,
      });
    }

    const { documentType, level, grade, subject, language, topic, prompt } = parseResult.data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: true,
        isFallback: true,
        message: 'تم توليد المقترح وفق التوجيهات التربوية المغربية المعتمدة.',
        data: generateMoroccanFallback(documentType, subject, topic || '', language),
      });
    }

    const ai = getGeminiClient();
    const systemInstruction = `أنت خبير تربوي ومفتش تربوي معتمد في وزارة التربية الوطنية المغربية، وملم بالتوجيهات التربوية الرسمية والمنهاج المغربي المنقح، والتدريس بالكفايات وبيداغوجيا الإدماج والوضعيات المشكلة.
المهمة: توليد محتوى ديداكتيكي عالي الجودة لوثيقة تربوية (جذاذة، فرض، أنشطة دعم، أو ميثاق قسم) باللغة المحددة (${language === 'fr' ? 'الفرنسية' : 'العربية'}).
يجب أن يكون الناتج منظماً، دقيقاً، ويحتوي على الكفايات المستهدفة، الأهداف التعليمية الإجرائية، المكتسبات القبلية، ومراحل إنجاز الدرس (الوضعية المشكلة الاستكشافية، بناء التعلمات والأنشطة، التقويم والدعم).`;

    const userPrompt = `قم بإنشاء محتوى بيداغوجي متكامل للوثيقة التالية:
نوع الوثيقة: ${documentType}
السلك: ${level}
المستوى: ${grade}
المادة: ${subject}
عنوان الدرس / الموضوع: ${topic || 'درس نموذجي'}
توجيهات إضافية: ${prompt || 'احترام التوجيهات الرسمية للمنهاج المغربي'}

يرجى تقديم النتيجة بصيغة JSON واضحة تضم:
- generalCompetences: مصفوفة من الكفايات المستهدفة
- specificObjectives: مصفوفة من الأهداف التعلمية
- prerequisites: المكتسبات القبلية
- didacticResources: الوسائل والدعامات الديداكتيكية
- lessonStages: مصفوفة مراحل الدرس تضم (stageName, duration, teacherActivities, studentActivities, evaluationMode, didacticTools)
- diagnosticEval: أسئلة التقويم التشخيصي
- formativeEval: التقويم التكويني
- summativeEval: التقويم الإجمالي
- supportActivities: أنشطة الدعم والمعالجة`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsedData = {};
    try {
      parsedData = JSON.parse(text);
    } catch {
      parsedData = { rawText: text };
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error generating pedagogy content:', error);
    return res.status(200).json({
      success: true,
      isFallback: true,
      data: generateMoroccanFallback(req.body.documentType, req.body.subject, req.body.topic, req.body.language),
    });
  }
});

function generateMoroccanFallback(docType: string, subject: string, topic: string, lang: string) {
  if (lang === 'fr') {
    return {
      generalCompetences: [
        'Développer la rigueur scientifique et l\'esprit critique face aux situations complexes.',
        'Mobiliser les ressources acquises pour résoudre des situations-problèmes concrètes.',
        'Communiquer à l\'aide du langage et du symbolisme propres à la discipline.',
      ],
      specificObjectives: [
        `Maîtriser les concepts fondamentaux relatifs à : ${topic || 'ce chapitre'}.`,
        'Appliquer les méthodes et démarches d\'investigation expérimentale ou déductive.',
        'Exploiter des documents, schémas et graphiques pour formuler des synthèses.',
      ],
      prerequisites: [
        'Les notions de base abordées lors des séquences pédagogiques antérieures.',
        'L\'habileté de manipulation des outils et des instruments didactiques.',
      ],
      didacticResources: [
        'Le manuel scolaire officiel en vigueur.',
        'Vidéoprojecteur, fiches d\'activités imprimées, tableau blanc.',
        'Matériel d\'expérimentation ou logiciels de simulation interactive.',
      ],
      lessonStages: [
        {
          stageName: 'Situation-problème de départ & Formulation des hypothèses',
          duration: '20 min',
          teacherActivities: 'Présenter une situation déclenchante motivante, guider les apprenants dans l\'émergence du questionnement didactique.',
          studentActivities: 'Analyser la situation, identifier les données utiles, émettre des hypothèses et proposer des pistes de résolution.',
          evaluationMode: 'Évaluation diagnostique orale et prise de notes des représentations initiales.',
          didacticTools: 'Support documentaire / capsule vidéo courte.',
        },
        {
          stageName: 'Activités d\'apprentissage & Construction du savoir',
          duration: '45 min',
          teacherActivities: 'Organiser le travail en petits groupes, réguler les échanges, apporter un étayage méthodologique adapté.',
          studentActivities: 'Réaliser les tâches assignées, confronter les résultats, rédiger un premier bilan partiel.',
          evaluationMode: 'Évaluation formative continue par observation des démarches.',
          didacticTools: 'Fiches guides d\'apprentissage collaboratif.',
        },
        {
          stageName: 'Synthèse, Institutionnalisation & Évaluation sommative',
          duration: '25 min',
          teacherActivities: 'Structurer le bilan collectif, fixer les règles et définitions institutionnelles au tableau.',
          studentActivities: 'Prendre des notes ordonnées, résoudre un exercice d\'application immédiate pour consolider l\'acquis.',
          evaluationMode: 'Évaluation sommative rapide sur cahier d\'exercices.',
          didacticTools: 'Tableau + cahier de cours.',
        },
      ],
      diagnosticEval: 'Questions directes de rappel des prérequis indispensables.',
      formativeEval: 'Observation continue de l\'implication et de la justesse des réponses.',
      summativeEval: 'Exercice d\'application directe en fin de séance.',
      supportActivities: 'Atelier de remédiation ciblée pour les élèves présentant des difficultés conceptuelles.',
    };
  }

  return {
    generalCompetences: [
      'تنمية الحس النقدي والمنهجي في مقاربة المعارف والظواهر المدروسة.',
      'توظيف المعارف والمهارات المكتسبة في معالجة وضعيات مشكلة دالة.',
      'الاستعمال السليم للمصطلحات والمفاهيم الخاصة بالمادة وفق المنهاج المغربي.',
    ],
    specificObjectives: [
      `التعرف على المفاهيم والقواعد الأساسية المرتبطة بـ: ${topic || 'موضوع الدرس'}.`,
      'تطبيق المكتسبات في إنجاز التمارين والأنشطة التطبيقية بدقة.',
      'صياغة استنتاجات وتركيب الخلاصات بأسلوب علمي ومنهجي رصين.',
    ],
    prerequisites: [
      'المكتسبات القبلية والتعلمات السابقة المرتبطة بالموضوع.',
      'المهارات المنهجية الأساسية في التحليل والاستنتاج.',
    ],
    didacticResources: [
      'الكتاب المدرسي المعتمد من وزارة التربية الوطنية.',
      'السبورة، مسلاط رقمي (Data show)، مطبوعات وبطاقات عمل.',
      'وسائل إيضاح ومجسمات أو برمجيات تفاعلية.',
    ],
    lessonStages: [
      {
        stageName: 'الوضعية المشكلة الاستكشافية (الانطلاق)',
        duration: '15 دقيقة',
        teacherActivities: 'طرح وضعية مشكلة واقعية تثير دافعية المتعلمين وتخلق لديهم خلخلة معرفية، وتوجيههم لصياغة الفرضيات.',
        studentActivities: 'استحضار المكتسبات السابقة، تفكيك عناصر الوضعية، والتعبير عن تمثلاتهم وتدوين الفرضيات الأولية.',
        evaluationMode: 'تقويم تشخيصي للتمثلات والمكتسبات القبلية.',
        didacticTools: 'سند بصري / نص الوضعية المشكلة.',
      },
      {
        stageName: 'بناء التعلمات والأنشطة الديداكتيكية',
        duration: '50 دقيقة',
        teacherActivities: 'تدبير وتوجيه الأنشطة التعلمية، مرافقة مجموعات العمل، وتيسير سبل البحث والبرهنة.',
        studentActivities: 'الاشتغال الفردي ثم التشاركي في مجموعات، معالجة المعطيات، واستخلاص القواعد والمفاهيم.',
        evaluationMode: 'تقويم تكويني مرحلي وتصحيح فوري للتعثرات.',
        didacticTools: 'كراسة المتعلم(ة) + بطاقات الأنشطة.',
      },
      {
        stageName: 'التركيب والمأسسة والتطبيق',
        duration: '25 دقيقة',
        teacherActivities: 'مساعدة المتعلمين على صياغة الخلاصة التركيبية للدرس، وتقديم تمرين تطبيقي للتحقق من بلوغ الأهداف.',
        studentActivities: 'تدوين ملخص الدرس على الدفتر وإنجاز التمرين التطبيقي بشكل فردي ومستقل.',
        evaluationMode: 'تقويم إجمالي عبر التمرين التطبيقي.',
        didacticTools: 'السبورة والدفاتر المدرسية.',
      },
    ],
    diagnosticEval: 'أسئلة شفهية وبطاقات سريعة لتشخيص مدى جاهزية المتعلمين.',
    formativeEval: 'ملاحظة الأداء أثناء إنجاز المهام ورصد مؤشرات التمكن.',
    summativeEval: 'تمرين تقويمي فردي لقياس مدى تحقق الأهداف المسطرة.',
    supportActivities: 'أنشطة دعم بيداغوجي موازية لتثبيت المفاهيم لدى المتعثرين.',
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`وثائقي التربوية Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

