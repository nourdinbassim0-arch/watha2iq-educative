import * as htmlToImage from 'html-to-image';
import { DocumentData } from '../types';
import { generateCleanFileName } from '../utils/exportUtils';

/**
 * High-Resolution PNG Document Exporter
 */
export async function exportDocumentToHighResImage(
  containerId: string = 'dedicated-clean-print-root',
  documentData: DocumentData,
  onProgress?: (percentage: number, message: string) => void
): Promise<void> {
  onProgress?.(15, 'جاري تحضير الصفحة للالتقاط عالي الدقة...');

  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue
    }
  }

  const container =
    document.getElementById('dedicated-clean-print-root') ||
    document.getElementById(containerId) ||
    document.getElementById('clean-document-print-canvas') ||
    document.getElementById('document-render-canvas') ||
    document.querySelector('.printable-document-container');

  if (!container) {
    throw new Error('لم يتم العثور على مساحة عرض الوثيقة.');
  }

  const targetEl = container.querySelector<HTMLElement>('[data-document-page]') || (container as HTMLElement);

  // Ensure images are loaded
  const images = Array.from(targetEl.querySelectorAll('img'));
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    })
  );

  onProgress?.(50, 'جاري رسم صورة PNG فائقة الوضوح (2.6x DPI)...');

  const dataUrl = await htmlToImage.toPng(targetEl, {
    pixelRatio: 2.6,
    quality: 0.99,
    backgroundColor: '#ffffff',
    skipFonts: true,
    cacheBust: true,
    filter: (domNode: HTMLElement) => {
      if (!domNode || !domNode.classList) return true;
      if (
        domNode.classList.contains('editor-only') ||
        domNode.classList.contains('no-print')
      ) {
        return false;
      }
      if (domNode.getAttribute && domNode.getAttribute('data-editor-only') === 'true') {
        return false;
      }
      return true;
    },
  });

  onProgress?.(85, 'جاري تنزيل الصورة...');

  const filename = generateCleanFileName(documentData, 'png');
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  onProgress?.(100, 'تم تحميل صورة PNG بنجاح!');
}
