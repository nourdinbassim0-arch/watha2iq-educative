import { DocumentData, ExportFormat, PageFormat } from '../types';
import { getDimensionInfo } from './pageDimensions';
import {
  exportDocumentToHighResPdf,
  exportDocumentToHighResImage,
} from '../document-engine';

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
  const yearName = (doc.academicYear || '2026-2027').replace(/[/\\?%*:|"<> ]/g, '-');

  const clean = (str: string) => str.replace(/[/\\?%*:|"<> ]/g, '_');

  return `${clean(typeName)}_${clean(subjectName)}_${clean(gradeName)}_${clean(yearName)}.${extension}`;
}

export function triggerBrowserPrint(pageFormat: PageFormat = 'a4_portrait') {
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
        margin: 0;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        color: #000000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      /* Strictly hide all editor UI, navigation, sidebars, buttons, and editable canvas */
      .no-print,
      .editor-only,
      [data-editor-only="true"],
      header,
      nav,
      aside,
      footer.no-print,
      #canvas-scroll-wrapper,
      #document-render-canvas,
      .text-selection-toolbar,
      button {
        display: none !important;
      }
      /* Strictly display dedicated clean non-editable print document */
      #dedicated-clean-print-root,
      .print-only {
        display: block !important;
        position: static !important;
        left: auto !important;
        top: auto !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .print-document {
        box-shadow: none !important;
        border: none !important;
        margin: 0 auto !important;
      }
      .print-avoid-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }
  `;

  setTimeout(() => {
    window.print();
  }, 180);
}

export async function exportDocument(
  elementId: string = 'dedicated-clean-print-root',
  doc: DocumentData,
  format: ExportFormat,
  onProgress?: (progress: number, message: string) => void
): Promise<void> {
  if (format === 'pdf') {
    await exportDocumentToHighResPdf(elementId, doc, onProgress);
  } else if (format === 'png' || format === 'jpg') {
    await exportDocumentToHighResImage(elementId, doc, onProgress);
  } else {
    // Default fallback to PDF
    await exportDocumentToHighResPdf(elementId, doc, onProgress);
  }
}
