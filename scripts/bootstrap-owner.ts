/**
 * Moroccan Educational Platform - Owner Bootstrap Script
 * Usage: npx tsx scripts/bootstrap-owner.ts <user-email-or-uid>
 * 
 * This script initializes the platform Owner role securely.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

async function bootstrapOwner() {
  const targetIdentifier = process.argv[2] || process.env.OWNER_EMAIL;

  if (!targetIdentifier) {
    console.error('❌ Error: Please provide an email or UID as an argument or set OWNER_EMAIL in .env');
    console.log('Usage: npx tsx scripts/bootstrap-owner.ts <user@example.com>');
    process.exit(1);
  }

  console.log(`🚀 Starting Owner Bootstrap for: ${targetIdentifier}...`);

  try {
    let app;
    if (getApps().length === 0) {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        app = initializeApp({
          credential: cert(serviceAccount),
        });
      } else {
        // Fallback default app initialization
        app = initializeApp({
          projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
        });
      }
    }

    const auth = getAuth();
    const db = getFirestore();

    let userRecord;
    if (targetIdentifier.includes('@')) {
      userRecord = await auth.getUserByEmail(targetIdentifier);
    } else {
      userRecord = await auth.getUser(targetIdentifier);
    }

    console.log(`✅ Found Firebase Auth user: ${userRecord.email} (${userRecord.uid})`);

    // 1. Set Custom Claims
    await auth.setCustomUserClaims(userRecord.uid, {
      role: 'OWNER',
      plan: 'PRO',
      admin: true,
    });
    console.log('✅ Custom Claims set to role: OWNER');

    // 2. Update Firestore User Profile
    const userRef = db.collection('users').doc(userRecord.uid);
    await userRef.set(
      {
        uid: userRecord.uid,
        email: userRecord.email,
        role: 'OWNER',
        plan: 'PRO',
        status: 'ACTIVE',
        isVerified: true,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log('✅ Firestore user document updated with role: OWNER, plan: PRO');

    // 3. Initialize default platform settings if not present
    const settingsRef = db.collection('settings').doc('platform');
    const settingsSnap = await settingsRef.get();
    if (!settingsSnap.exists) {
      await settingsRef.set({
        freeDailyLimit: 3,
        platformNameAr: 'وثائقي التربوية',
        platformNameFr: 'Wathaiqi Tarbawiya',
        maintenanceMode: false,
        proPriceMad: 49,
        supportEmail: 'contact@wathaiqi.ma',
        createdAt: new Date().toISOString(),
      });
      console.log('✅ Default platform settings initialized in Firestore');
    }

    console.log('\n🎉 Owner Bootstrap complete! You can now log in with full administrative privileges.');
  } catch (error: any) {
    console.error('❌ Failed to bootstrap Owner:', error.message);
    process.exit(1);
  }
}

bootstrapOwner();
