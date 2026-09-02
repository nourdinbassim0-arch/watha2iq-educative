/**
 * Font Registry and Typography Engine
 * Provides cross-platform font mapping for Browser Preview, Microsoft Word DOCX, and PDF Export
 */

export interface DocumentFontInfo {
  id: string;
  nameAr: string;
  nameEn: string;
  cssFamily: string;
  docxFontName: string;
  pdfFallback: string;
  supportsArabic: boolean;
  category: 'sans' | 'serif' | 'calligraphic';
}

export const DOCUMENT_FONTS: Record<string, DocumentFontInfo> = {
  cairo: {
    id: 'cairo',
    nameAr: 'Cairo - كايرو (عصري وواضح)',
    nameEn: 'Cairo',
    cssFamily: "'Cairo', 'Tajawal', system-ui, sans-serif",
    docxFontName: 'Cairo',
    pdfFallback: 'Helvetica',
    supportsArabic: true,
    category: 'sans',
  },
  amiri: {
    id: 'amiri',
    nameAr: 'Amiri - أميري (خط نَسخي مغربي أصيل)',
    nameEn: 'Amiri',
    cssFamily: "'Amiri', 'Traditional Arabic', serif",
    docxFontName: 'Amiri',
    pdfFallback: 'Times-Roman',
    supportsArabic: true,
    category: 'serif',
  },
  tajawal: {
    id: 'tajawal',
    nameAr: 'Tajawal - تجوّال (رسمي وأنيق)',
    nameEn: 'Tajawal',
    cssFamily: "'Tajawal', 'Cairo', system-ui, sans-serif",
    docxFontName: 'Tajawal',
    pdfFallback: 'Helvetica',
    supportsArabic: true,
    category: 'sans',
  },
  scheherazade: {
    id: 'scheherazade',
    nameAr: 'Scheherazade - شهرزاد (كلاسيكي للكتب والوثائق)',
    nameEn: 'Scheherazade New',
    cssFamily: "'Scheherazade New', 'Amiri', serif",
    docxFontName: 'Scheherazade New',
    pdfFallback: 'Times-Roman',
    supportsArabic: true,
    category: 'serif',
  },
  reem_kufi: {
    id: 'reem_kufi',
    nameAr: 'Reem Kufi - ريم كوفي (عناوين هندسية بارزة)',
    nameEn: 'Reem Kufi',
    cssFamily: "'Reem Kufi', 'Cairo', sans-serif",
    docxFontName: 'Reem Kufi',
    pdfFallback: 'Helvetica',
    supportsArabic: true,
    category: 'sans',
  },
  aref_ruqaa: {
    id: 'aref_ruqaa',
    nameAr: 'Aref Ruqaa - عارف رقعة (توقيع وعناوين كاليغرافية)',
    nameEn: 'Aref Ruqaa',
    cssFamily: "'Aref Ruqaa', 'Amiri', serif",
    docxFontName: 'Aref Ruqaa',
    pdfFallback: 'Times-Roman',
    supportsArabic: true,
    category: 'calligraphic',
  },
  noto_naskh: {
    id: 'noto_naskh',
    nameAr: 'Noto Naskh - نوتو نسخ عربي',
    nameEn: 'Noto Naskh Arabic',
    cssFamily: "'Noto Naskh Arabic', 'Amiri', serif",
    docxFontName: 'Noto Naskh Arabic',
    pdfFallback: 'Times-Roman',
    supportsArabic: true,
    category: 'serif',
  },
  ibm_plex: {
    id: 'ibm_plex',
    nameAr: 'IBM Plex - آي بي إم بليكس عربي',
    nameEn: 'IBM Plex Sans Arabic',
    cssFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif",
    docxFontName: 'IBM Plex Sans Arabic',
    pdfFallback: 'Helvetica',
    supportsArabic: true,
    category: 'sans',
  },
};

/**
 * Standard typographically balanced font sizes in points (pt)
 */
export const STANDARD_FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48] as const;

/**
 * Converts points (pt) to half-points for DOCX (1 pt = 2 half-points)
 */
export function ptToHalfPoints(pt: number): number {
  return Math.round(pt * 2);
}

/**
 * Converts points (pt) to pixels at standard 96 DPI
 */
export function ptToPx(pt: number): number {
  return (pt * 96) / 72;
}

/**
 * Converts millimeters to points (1 inch = 25.4 mm = 72 pt)
 */
export function mmToPt(mm: number): number {
  return (mm * 72) / 25.4;
}

/**
 * Converts millimeters to Word DXA (1/20th of a point; 1 mm ≈ 56.7 dxa)
 */
export function mmToDxa(mm: number): number {
  return Math.round((mm * 72 * 20) / 25.4);
}

/**
 * Converts points to Word DXA (1 pt = 20 dxa)
 */
export function ptToDxa(pt: number): number {
  return Math.round(pt * 20);
}

/**
 * Get CSS Font Family string safely
 */
export function getFontFamilyCSS(fontId?: string): string {
  if (!fontId) return DOCUMENT_FONTS.tajawal.cssFamily;
  const font = DOCUMENT_FONTS[fontId] || DOCUMENT_FONTS.tajawal;
  return font.cssFamily;
}

/**
 * Get Primary Word font name
 */
export function getDocxFontName(fontId?: string): string {
  if (!fontId) return 'Tajawal';
  const font = DOCUMENT_FONTS[fontId];
  return font ? font.docxFontName : 'Tajawal';
}

/**
 * Arabic Alphabet and Glyph Verification Check
 * Ensures critical characters (hamzas, ta marbouta, ligatures, numbers, punctuation) are valid
 */
export const ARABIC_TEST_CORPUS = [
  'المملكة المغربية',
  'وزارة التربية الوطنية والتعليم الأولي والرياضة',
  'الأكاديمية الجهوية للتربية والتكوين',
  'المديرية الإقليمية',
  'الجذاذة البيداغوجية والوثيقة التربوية الرسمية',
  'السنة الدراسية 2025/2026',
  'المعدل العام: 18.75 / 20',
  'الاسم الكامل: فاطمة الزهراء الإدريسي',
  'التاريخ: 15 أكتوبر 2025',
  'ميثاق القسم والانضباط الصفي',
  'أنشطة الأستاذ(ة) وأنشطة المتعلم(ة)',
];
