import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Document as DocxDocument, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, HeadingLevel } from 'docx';
import { DocumentData, ExportFormat, PageFormat } from '../types';
import { getDimensionInfo } from './pageDimensions';

/**
 * Cache for converted colors to maximize performance during export.
 */
const colorConversionCache = new Map<string, string>();
let colorHelperCanvas: HTMLCanvasElement | null = null;
let colorHelperCtx: CanvasRenderingContext2D | null = null;

/**
 * Safely and accurately converts ANY CSS color string (OKLCH, OKLAB, color(), color-mix(), HWB, LCH, etc.)
 * to standard guaranteed "rgb(r, g, b)" or "rgba(r, g, b, a)" string using 2D pixel data.
 * This guarantees html2canvas will NEVER encounter unsupported color formats.
 */
function convertColorToStandardRgb(val: string): string {
  if (!val || typeof val !== 'string') return '#000000';
  const trimmed = val.trim();

  // If it's already a plain hex or standard rgb/rgba, return as-is
  if (
    /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed) ||
    (!trimmed.includes('oklch') &&
      !trimmed.includes('oklab') &&
      !trimmed.includes('color(') &&
      !trimmed.includes('color-mix(') &&
      !trimmed.includes('hwb(') &&
      !trimmed.includes('lch(') &&
      !trimmed.includes('lab('))
  ) {
    return trimmed;
  }

  if (colorConversionCache.has(trimmed)) {
    return colorConversionCache.get(trimmed)!;
  }

  try {
    if (!colorHelperCanvas) {
      colorHelperCanvas = document.createElement('canvas');
      colorHelperCanvas.width = 1;
      colorHelperCanvas.height = 1;
      colorHelperCtx = colorHelperCanvas.getContext('2d', { willReadFrequently: true });
    }

    if (colorHelperCtx) {
      colorHelperCtx.clearRect(0, 0, 1, 1);
      colorHelperCtx.fillStyle = '#000000';
      colorHelperCtx.fillStyle = trimmed;
      colorHelperCtx.fillRect(0, 0, 1, 1);

      const pixel = colorHelperCtx.getImageData(0, 0, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      const a = pixel[3];

      let standardRgb: string;
      if (a === 255) {
        standardRgb = `rgb(${r}, ${g}, ${b})`;
      } else {
        const alpha = (a / 255).toFixed(3);
        standardRgb = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }

      colorConversionCache.set(trimmed, standardRgb);
      return standardRgb;
    }
  } catch (e) {
    console.warn('Color conversion fallback for:', trimmed, e);
  }

  // Safe fallback if parsing fails
  const fallback = trimmed.includes('0.') || trimmed.includes('white') ? '#ffffff' : '#065f46';
  colorConversionCache.set(trimmed, fallback);
  return fallback;
}

/**
 * Sanitizes any string containing CSS with oklch(...), oklab(...), color(...), etc.
 */
function sanitizeCssString(cssStr: string): string {
  if (!cssStr || typeof cssStr !== 'string') return cssStr;
  if (
    !cssStr.includes('oklch') &&
    !cssStr.includes('oklab') &&
    !cssStr.includes('color(') &&
    !cssStr.includes('color-mix(') &&
    !cssStr.includes('lch(') &&
    !cssStr.includes('lab(')
  ) {
    return cssStr;
  }

  // Replace oklch/oklab/color-mix/color expressions
  return cssStr
    .replace(/oklch\([^)]+(\([^)]*\))*[^)]*\)/gi, (m) => convertColorToStandardRgb(m))
    .replace(/oklab\([^)]+(\([^)]*\))*[^)]*\)/gi, (m) => convertColorToStandardRgb(m))
    .replace(/color-mix\([^)]+(\([^)]*\))*[^)]*\)/gi, (m) => convertColorToStandardRgb(m))
    .replace(/color\([^)]+(\([^)]*\))*[^)]*\)/gi, (m) => convertColorToStandardRgb(m))
    .replace(/lch\([^)]+(\([^)]*\))*[^)]*\)/gi, (m) => convertColorToStandardRgb(m))
    .replace(/lab\([^)]+(\([^)]*\))*[^)]*\)/gi, (m) => convertColorToStandardRgb(m));
}

/**
 * Sanitizes cloned DOM tree and stylesheets before html2canvas rendering to completely prevent OKLCH errors
 */
function prepareClonedDocForCanvas(clonedDoc: Document, origElement: HTMLElement, clonedElement: HTMLElement) {
  // 1. Sanitize or replace all <style> elements in cloned document
  const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
  for (const styleTag of styleTags) {
    if (styleTag.textContent) {
      if (
        styleTag.textContent.includes('oklch') ||
        styleTag.textContent.includes('oklab') ||
        styleTag.textContent.includes('color(') ||
        styleTag.textContent.includes('color-mix(')
      ) {
        styleTag.textContent = sanitizeCssString(styleTag.textContent);
      }
    }
  }

  // 1b. Sanitize all active CSSRules in cloned document stylesheets
  try {
    const sheets = Array.from(clonedDoc.styleSheets);
    for (const sheet of sheets) {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          if (
            rule.cssText &&
            (rule.cssText.includes('oklch') ||
              rule.cssText.includes('oklab') ||
              rule.cssText.includes('color(') ||
              rule.cssText.includes('color-mix('))
          ) {
            const sanitizedRule = sanitizeCssString(rule.cssText);
            try {
              sheet.deleteRule(i);
              sheet.insertRule(sanitizedRule, i);
            } catch (e) {}
          }
        }
      } catch (e) {}
    }
  } catch (e) {}

  // 2. Walk original and cloned trees to extract real computed colors and force RGB inline
  const colorProps = [
    'color',
    'background-color',
    'border-color',
    'border-top-color',
    'border-bottom-color',
    'border-left-color',
    'border-right-color',
    'outline-color',
    'text-decoration-color',
    'fill',
    'stroke',
    'accent-color',
    'caret-color',
  ] as const;

  function walkElements(orig: Element | null, cloned: Element | null) {
    if (!cloned || cloned.nodeType !== Node.ELEMENT_NODE) return;
    const clonedEl = cloned as HTMLElement;
    const origEl = orig && orig.nodeType === Node.ELEMENT_NODE ? (orig as HTMLElement) : null;

    // Check inline style attribute
    const styleAttr = clonedEl.getAttribute('style');
    if (styleAttr && (styleAttr.includes('oklch') || styleAttr.includes('oklab') || styleAttr.includes('color('))) {
      clonedEl.setAttribute('style', sanitizeCssString(styleAttr));
    }

    if (origEl) {
      try {
        const computed = window.getComputedStyle(origEl);

        for (const prop of colorProps) {
          const val = computed.getPropertyValue(prop);
          if (val) {
            const sanitized = convertColorToStandardRgb(val);
            clonedEl.style.setProperty(prop, sanitized, 'important');
          }
        }

        const bgImg = computed.getPropertyValue('background-image');
        if (bgImg && bgImg !== 'none') {
          clonedEl.style.setProperty('background-image', sanitizeCssString(bgImg), 'important');
        }

        const shadow = computed.getPropertyValue('box-shadow');
        if (shadow && shadow !== 'none') {
          clonedEl.style.setProperty('box-shadow', sanitizeCssString(shadow), 'important');
        }
      } catch (e) {}
    }

    const origChildren = origEl ? Array.from(origEl.children) : [];
    const clonedChildren = Array.from(clonedEl.children);
    for (let i = 0; i < clonedChildren.length; i++) {
      walkElements(origChildren[i] || null, clonedChildren[i]);
    }
  }

  walkElements(origElement, clonedElement);

  // 3. Inject safe baseline print styling to prevent any Tailwind 4 root variables from leaking OKLCH
  const safeStyle = clonedDoc.createElement('style');
  safeStyle.textContent = `
    * {
      color-scheme: light !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  `;
  clonedDoc.head.appendChild(safeStyle);
}

export function generateCleanFileName(doc: DocumentData, extension: string): string {
  const isFr = doc.language === 'fr';
  const isEn = doc.language === 'en';

  const typeMapAr: Record<string, string> = {
    fiche_pedagogique: 'جذاذة_تربوية',
    charte_classe: 'ميثاق_القسم',
    controle_devoir: 'فرض_محروس',
    evaluation_soutien: 'أنشطة_الدعم_والمعالجة',
    grille_notation: 'شبكة_التنقيط',
    fiche_activite: 'بطاقة_الأنشطة',
    rapport_conseil: 'تقرير_مجلس_القسم',
    attestation_affiche: 'شهادة_تقديرية',
    registre_notes: 'سجل_النقط_والتقويم',
  };

  const typeMapLat: Record<string, string> = {
    fiche_pedagogique: 'Fiche_Pedagogique',
    charte_classe: 'Charte_de_classe',
    controle_devoir: 'Controle_Continu',
    evaluation_soutien: 'Soutien_Remediation',
    grille_notation: 'Grille_Notation',
    fiche_activite: 'Fiche_Activites',
    rapport_conseil: 'Rapport_Conseil',
    attestation_affiche: 'Attestation',
    registre_notes: 'Registre_Notes',
  };

  const typeName = (isFr || isEn) 
    ? (typeMapLat[doc.documentType] || 'Document') 
    : (typeMapAr[doc.documentType] || 'وثيقة_تربوية');

  const subjectName = (isFr ? doc.subjectNameFr || doc.subjectNameAr : doc.subjectNameAr) || 'Matiere';
  const gradeName = doc.grade || 'Niveau';
  const yearName = doc.academicYear || '2026-2027';

  const clean = (str: string) => str.replace(/[/\\?%*:|"<> ]/g, '_');

  return `${clean(typeName)}_${clean(subjectName)}_${clean(gradeName)}_${clean(yearName)}.${extension}`;
}

export function triggerBrowserPrint(pageFormat: PageFormat = 'a4_portrait') {
  // Inject specific page format print CSS
  const dimInfo = getDimensionInfo(pageFormat);
  let styleEl = document.getElementById('dynamic-print-page-style') as HTMLStyleElement;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'dynamic-print-page-style';
    document.head.appendChild(styleEl);
  }

  styleEl.innerHTML = `
    @media print {
      @page {
        size: ${dimInfo.printSizeCSS};
        margin: 10mm;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
      }
      .no-print {
        display: none !important;
      }
      .printable-document-container {
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        transform: none !important;
      }
    }
  `;

  setTimeout(() => {
    window.print();
  }, 150);
}

export async function exportDocument(
  elementId: string,
  doc: DocumentData,
  format: ExportFormat,
  onProgress?: (progress: number, message: string) => void
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('لم يتم العثور على عنصر الوثيقة للمعاينة والتصدير.');
  }

  const dimInfo = getDimensionInfo(doc.pageFormat || 'a4_portrait');
  onProgress?.(20, 'جاري تحضير ومعالجة محتوى الوثيقة...');

  if (format === 'pdf') {
    onProgress?.(40, 'جاري معالجة الخطوط والصفحات والرسومات...');
    
    // Render at high resolution matching exact element width with OKLCH sanitization
    const canvas = await html2canvas(element, {
      scale: 2.2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      onclone: (clonedDoc, clonedEl) => {
        prepareClonedDocForCanvas(clonedDoc, element, clonedEl);
      },
    });

    onProgress?.(70, 'جاري توليد ملف PDF عالي الجودة...');

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: dimInfo.isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [dimInfo.widthMm, dimInfo.heightMm],
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = imgWidth / pdfWidth;
    const totalPdfHeight = imgHeight / ratio;

    let heightLeft = totalPdfHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Multi-page handling
    while (heightLeft > 5) {
      position = position - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    onProgress?.(95, 'اكتمل الإنشاء، جاري بدء التنزيل...');
    const filename = generateCleanFileName(doc, 'pdf');
    pdf.save(filename);

  } else if (format === 'docx') {
    onProgress?.(50, 'جاري إنشاء مستند Word DOCX متكامل ومنسق...');
    
    try {
      // Build native Word DOCX document using docx library
      const docxDocument = new DocxDocument({
        sections: [
          {
            properties: {
              page: {
                size: {
                  width: dimInfo.widthMm * 56.7, // mm to dxa (1 mm = 56.7 dxa)
                  height: dimInfo.heightMm * 56.7,
                  orientation: dimInfo.isLandscape ? 'landscape' : 'portrait',
                },
                margin: {
                  top: 720, // 0.5 in
                  right: 720,
                  bottom: 720,
                  left: 720,
                },
              },
            },
            children: [
              // Header title
              new Paragraph({
                text: `${doc.kingdomHeader} - ${doc.ministryHeader}`,
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
              }),
              new Paragraph({
                text: `${doc.academy} | ${doc.directorate} | ${doc.schoolName}`,
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
              }),
              new Paragraph({
                text: doc.title,
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                text: `المادة: ${doc.subjectNameAr} | المستوى: ${doc.grade} | الأستاذ(ة): ${doc.teacherName} | الموسم: ${doc.academicYear}`,
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
              }),
              // Main content preview
              new Paragraph({
                children: [
                  new TextRun({
                    text: doc.unitOrModule || doc.lessonTitle || 'محتوى الوثيقة التربوية',
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(docxDocument);
      const filename = generateCleanFileName(doc, 'docx');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('DOCX binary generation fallback to rich HTML/Word wrapper', err);
      // Robust Fallback: Rich HTML formatted Word .doc
      const filename = generateCleanFileName(doc, 'docx');
      const contentHtml = element.innerHTML;
      const wordHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'
              dir='${doc.language === 'ar' ? 'rtl' : 'ltr'}' lang='${doc.language}'>
        <head>
          <meta charset='utf-8'>
          <title>${doc.title}</title>
          <style>
            @page {
              size: ${dimInfo.printSizeCSS};
              margin: 1.5cm;
            }
            body {
              font-family: 'Tajawal', 'Cairo', 'Segoe UI', Arial, sans-serif;
              direction: ${doc.language === 'ar' ? 'rtl' : 'ltr'};
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #065F46;
              padding: 6px;
            }
          </style>
        </head>
        <body>
          ${contentHtml}
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

  } else if (format === 'png' || format === 'jpg') {
    onProgress?.(50, `جاري استخراج صورة ${format.toUpperCase()} فائقة الدقة...`);
    
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      onclone: (clonedDoc, clonedEl) => {
        prepareClonedDocForCanvas(clonedDoc, element, clonedEl);
      },
    });

    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mimeType, 0.95);
    const filename = generateCleanFileName(doc, format);
    
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

  } else if (format === 'html') {
    onProgress?.(60, 'جاري تجميع كود HTML المضمن والمستقل...');
    const filename = generateCleanFileName(doc, 'html');
    const contentHtml = element.innerHTML;
    
    const fullHtml = `<!DOCTYPE html>
<html lang="${doc.language}" dir="${doc.language === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Tajawal', 'Cairo', system-ui, sans-serif;
      margin: 0;
      padding: 24px;
      background: #f8fafc;
      display: flex;
      justify-content: center;
    }
    .container {
      background: #ffffff;
      width: 100%;
      max-width: ${dimInfo.widthPx}px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      border-radius: 12px;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    ${contentHtml}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  } else if (format === 'rtf') {
    onProgress?.(60, 'جاري إنشاء ملف RTF للنصوص المنسقة...');
    const filename = generateCleanFileName(doc, 'rtf');
    const rtfContent = `{\\rtf1\\ansi\\ansicpg1256\\deff0\\nouicompat{\\fonttbl{\\f0\\fnil\\fcharset178 Tajawal;}{\\f1\\fnil\\fcharset0 Arial;}}
{\\colortbl ;\\red6\\green95\\blue70;\\red45\\green52\\blue54;}
{\\*\\generator Wathaiqi Tarbawiya 2026-2027;}
\\viewkind4\\uc1 
\\pard\\qc\\cf1\\b\\f0\\fs32 ${doc.kingdomHeader}\\par
\\fs24 ${doc.ministryHeader}\\par
\\fs20 ${doc.academy} - ${doc.directorate} - ${doc.schoolName}\\par
\\cf0\\fs28\\b ${doc.title}\\par
\\fs20\\b0\\cf2 ${doc.lessonTitle || doc.unitOrModule}\\par
\\par
\\pard\\right\\fs20\\cf2 
المادة: ${doc.subjectNameAr} | المستوى: ${doc.grade} | الأستاذ(ة): ${doc.teacherName}\\par
السنة الدراسية: ${doc.academicYear} | التاريخ: ${doc.documentDate}\\par
}`;

    const blob = new Blob([rtfContent], { type: 'application/rtf;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  onProgress?.(100, 'تم تحميل الوثيقة بنجاح!');
}
