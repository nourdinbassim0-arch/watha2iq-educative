import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Document as DocxDocument, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, HeadingLevel } from 'docx';
import { DocumentData, ExportFormat, PageFormat } from '../types';
import { getDimensionInfo } from './pageDimensions';

/**
 * Safely converts an OKLCH/OKLAB/color() CSS string to RGB/HEX using Canvas 2D context.
 */
function sanitizeColorValue(val: string): string {
  if (!val || (!val.includes('oklch') && !val.includes('oklab') && !val.includes('color('))) {
    return val;
  }
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillStyle = val;
      return ctx.fillStyle;
    }
  } catch (e) {}
  return '#065f46';
}

/**
 * Sanitizes any string containing CSS with oklch(...) or oklab(...)
 */
function sanitizeCssString(cssStr: string): string {
  if (!cssStr || (!cssStr.includes('oklch') && !cssStr.includes('oklab') && !cssStr.includes('color('))) {
    return cssStr;
  }
  return cssStr
    .replace(/oklch\([^)]+\)/gi, (m) => sanitizeColorValue(m))
    .replace(/oklab\([^)]+\)/gi, (m) => sanitizeColorValue(m))
    .replace(/color\([^)]+\)/gi, (m) => sanitizeColorValue(m));
}

/**
 * Sanitizes cloned DOM tree and stylesheets before html2canvas rendering to prevent OKLCH errors
 */
function prepareClonedDocForCanvas(clonedDoc: Document, origElement: HTMLElement, clonedElement: HTMLElement) {
  // 1. Sanitize all <style> elements in cloned document
  const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
  for (const styleTag of styleTags) {
    if (styleTag.textContent && (styleTag.textContent.includes('oklch') || styleTag.textContent.includes('oklab') || styleTag.textContent.includes('color('))) {
      styleTag.textContent = sanitizeCssString(styleTag.textContent);
    }
  }

  // 2. Walk original and cloned trees to normalize computed and inline colors
  function walkElements(orig: Element | null, cloned: Element | null) {
    if (!cloned || cloned.nodeType !== Node.ELEMENT_NODE) return;
    const clonedEl = cloned as HTMLElement;
    const origEl = (orig && orig.nodeType === Node.ELEMENT_NODE) ? (orig as HTMLElement) : null;

    // Check inline style attribute
    const styleAttr = clonedEl.getAttribute('style');
    if (styleAttr && (styleAttr.includes('oklch') || styleAttr.includes('oklab') || styleAttr.includes('color('))) {
      clonedEl.setAttribute('style', sanitizeCssString(styleAttr));
    }

    if (origEl) {
      try {
        const computed = window.getComputedStyle(origEl);
        const props = [
          'color',
          'background-color',
          'border-color',
          'border-top-color',
          'border-bottom-color',
          'border-left-color',
          'border-right-color',
          'outline-color',
          'fill',
          'stroke',
        ] as const;

        for (const prop of props) {
          const val = computed.getPropertyValue(prop);
          if (val && (val.includes('oklch') || val.includes('oklab') || val.includes('color('))) {
            clonedEl.style.setProperty(prop, sanitizeColorValue(val));
          }
        }

        const bgImg = computed.getPropertyValue('background-image');
        if (bgImg && (bgImg.includes('oklch') || bgImg.includes('oklab') || bgImg.includes('color('))) {
          clonedEl.style.setProperty('background-image', sanitizeCssString(bgImg));
        }

        const shadow = computed.getPropertyValue('box-shadow');
        if (shadow && (shadow.includes('oklch') || shadow.includes('oklab') || shadow.includes('color('))) {
          clonedEl.style.setProperty('box-shadow', sanitizeCssString(shadow));
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
