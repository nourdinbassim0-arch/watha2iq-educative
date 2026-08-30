import { PageFormat } from '../types';

export interface PageDimensionInfo {
  id: PageFormat;
  labelAr: string;
  labelFr: string;
  labelEn: string;
  widthMm: number;
  heightMm: number;
  widthPx: number; // Reference standard 96dpi pixel width
  heightPx: number;
  isLandscape: boolean;
  aspectRatio: number; // width / height
  cssWidth: string;
  cssMinHeight: string;
  printSizeCSS: string;
}

export const PAGE_DIMENSIONS: Record<PageFormat, PageDimensionInfo> = {
  a4_portrait: {
    id: 'a4_portrait',
    labelAr: 'A4 عمودي (210 × 297 مم)',
    labelFr: 'A4 Portrait (210 × 297 mm)',
    labelEn: 'A4 Portrait (210 × 297 mm)',
    widthMm: 210,
    heightMm: 297,
    widthPx: 794,
    heightPx: 1123,
    isLandscape: false,
    aspectRatio: 210 / 297,
    cssWidth: '210mm',
    cssMinHeight: '297mm',
    printSizeCSS: '210mm 297mm',
  },
  a4_landscape: {
    id: 'a4_landscape',
    labelAr: 'A4 أفقي (297 × 210 مم)',
    labelFr: 'A4 Paysage (297 × 210 mm)',
    labelEn: 'A4 Landscape (297 × 210 mm)',
    widthMm: 297,
    heightMm: 210,
    widthPx: 1123,
    heightPx: 794,
    isLandscape: true,
    aspectRatio: 297 / 210,
    cssWidth: '297mm',
    cssMinHeight: '210mm',
    printSizeCSS: '297mm 210mm',
  },
  a3_portrait: {
    id: 'a3_portrait',
    labelAr: 'A3 عمودي (297 × 420 مم)',
    labelFr: 'A3 Portrait (297 × 420 mm)',
    labelEn: 'A3 Portrait (297 × 420 mm)',
    widthMm: 297,
    heightMm: 420,
    widthPx: 1123,
    heightPx: 1587,
    isLandscape: false,
    aspectRatio: 297 / 420,
    cssWidth: '297mm',
    cssMinHeight: '420mm',
    printSizeCSS: '297mm 420mm',
  },
  a3_landscape: {
    id: 'a3_landscape',
    labelAr: 'A3 أفقي (420 × 297 مم)',
    labelFr: 'A3 Paysage (420 × 297 mm)',
    labelEn: 'A3 Landscape (420 × 297 mm)',
    widthMm: 420,
    heightMm: 297,
    widthPx: 1587,
    heightPx: 1123,
    isLandscape: true,
    aspectRatio: 420 / 297,
    cssWidth: '420mm',
    cssMinHeight: '297mm',
    printSizeCSS: '420mm 297mm',
  },
  letter_portrait: {
    id: 'letter_portrait',
    labelAr: 'Letter عمودي (216 × 279 مم)',
    labelFr: 'Letter Portrait (216 × 279 mm)',
    labelEn: 'Letter Portrait (8.5 × 11 in)',
    widthMm: 215.9,
    heightMm: 279.4,
    widthPx: 816,
    heightPx: 1056,
    isLandscape: false,
    aspectRatio: 215.9 / 279.4,
    cssWidth: '215.9mm',
    cssMinHeight: '279.4mm',
    printSizeCSS: '8.5in 11in',
  },
  letter_landscape: {
    id: 'letter_landscape',
    labelAr: 'Letter أفقي (279 × 216 مم)',
    labelFr: 'Letter Paysage (279 × 216 mm)',
    labelEn: 'Letter Landscape (11 × 8.5 in)',
    widthMm: 279.4,
    heightMm: 215.9,
    widthPx: 1056,
    heightPx: 816,
    isLandscape: true,
    aspectRatio: 279.4 / 215.9,
    cssWidth: '279.4mm',
    cssMinHeight: '215.9mm',
    printSizeCSS: '11in 8.5in',
  },
  phone_story: {
    id: 'phone_story',
    labelAr: 'هاتف عمودي (1080 × 1920 بكسل)',
    labelFr: 'Format Téléphone (1080 × 1920 px)',
    labelEn: 'Mobile Story (1080 × 1920 px)',
    widthMm: 142.9,
    heightMm: 254.0,
    widthPx: 540,
    heightPx: 960,
    isLandscape: false,
    aspectRatio: 9 / 16,
    cssWidth: '540px',
    cssMinHeight: '960px',
    printSizeCSS: '142.9mm 254.0mm',
  },
  square: {
    id: 'square',
    labelAr: 'منشور مربع (1080 × 1080 بكسل)',
    labelFr: 'Format Carré (1080 × 1080 px)',
    labelEn: 'Square Post (1080 × 1080 px)',
    widthMm: 200,
    heightMm: 200,
    widthPx: 756,
    heightPx: 756,
    isLandscape: false,
    aspectRatio: 1,
    cssWidth: '756px',
    cssMinHeight: '756px',
    printSizeCSS: '200mm 200mm',
  },
};

export function getDimensionInfo(format: PageFormat): PageDimensionInfo {
  return PAGE_DIMENSIONS[format] || PAGE_DIMENSIONS.a4_portrait;
}

export function calculateFitWidthZoom(containerWidth: number, format: PageFormat, padding = 48): number {
  const info = getDimensionInfo(format);
  const availableWidth = Math.max(300, containerWidth - padding);
  const targetZoom = availableWidth / info.widthPx;
  return Math.min(1.4, Math.max(0.4, Number(targetZoom.toFixed(2))));
}

export function calculateFitPageZoom(containerWidth: number, containerHeight: number, format: PageFormat, padding = 64): number {
  const info = getDimensionInfo(format);
  const availableWidth = Math.max(300, containerWidth - padding);
  const availableHeight = Math.max(300, containerHeight - padding);
  
  const zoomX = availableWidth / info.widthPx;
  const zoomY = availableHeight / info.heightPx;
  const targetZoom = Math.min(zoomX, zoomY);
  
  return Math.min(1.4, Math.max(0.35, Number(targetZoom.toFixed(2))));
}
