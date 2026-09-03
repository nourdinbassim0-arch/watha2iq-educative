import {
  DocumentData,
  DocumentHeaderConfig,
  DocumentLogoConfig,
  DocumentBorderConfig,
  DocumentDecorationConfig,
  DocumentMarginConfig,
  DocumentSignaturesConfig,
  DocumentFooterConfig,
} from '../types';

export const USER_DESIGN_PRESET_STORAGE_KEY = 'wathaiqi_custom_design_preset';

export function getDefaultLogoConfig(doc?: Partial<DocumentData>): DocumentLogoConfig {
  return {
    show: doc?.showSchoolLogo ?? true,
    position: 'top_center',
    size: 'md',
    customWidthMm: 36,
    customHeightMm: 28,
    customPosX: 50,
    customPosY: 0,
    useCustomLogo: !!(doc?.customLogoUrl || doc?.customSchoolLogoUrl),
    customLogoUrl: doc?.customLogoUrl || doc?.customSchoolLogoUrl || '',
    topMarginMm: 0,
    bottomMarginMm: 3,
    sideSpacingMm: 6,
    titleSpacingMm: 6,
  };
}

export function getDefaultHeaderConfig(doc?: Partial<DocumentData>): DocumentHeaderConfig {
  return {
    template: 'official',
    showOfficialHeader: doc?.showOfficialHeader ?? true,
    visibleFields: {
      kingdom: true,
      ministry: true,
      academy: true,
      directorate: true,
      schoolName: true,
      academicYear: true,
      subject: true,
      grade: true,
      teacher: true,
      date: true,
    },
    spacingBelowHeaderMm: 4,
  };
}

export function getDefaultBorderConfig(doc?: Partial<DocumentData>): DocumentBorderConfig {
  return {
    preset: 'moroccan',
    scope: 'full',
    thickness: 1.5,
    color: '#065f46',
    insetMm: 6,
  };
}

export function getDefaultDecorationConfig(doc?: Partial<DocumentData>): DocumentDecorationConfig {
  return {
    style: 'moroccan_geometric',
    intensity: 'light',
    primaryColor: '#065f46',
  };
}

export function getDefaultMarginConfig(doc?: Partial<DocumentData>): DocumentMarginConfig {
  const marginSize = doc?.marginSize || 'normal';
  if (marginSize === 'tight') {
    return { preset: 'tight', topMm: 10, bottomMm: 10, rightMm: 10, leftMm: 10 };
  }
  if (marginSize === 'generous') {
    return { preset: 'generous', topMm: 20, bottomMm: 20, rightMm: 22, leftMm: 22 };
  }
  return { preset: 'normal', topMm: 14, bottomMm: 14, rightMm: 15, leftMm: 15 };
}

export function getDefaultSignaturesConfig(doc?: Partial<DocumentData>): DocumentSignaturesConfig {
  const teacherName = doc?.teacherName || '';
  return {
    showSignatures: true,
    layout: 'two_columns',
    items: [
      {
        id: 'sig-teacher',
        title: 'توقيع الأستاذ(ة)',
        name: teacherName,
        role: 'أستاذ المادة',
        show: doc?.showTeacherSignature ?? true,
        order: 1,
      },
      {
        id: 'sig-inspector',
        title: 'تأشيرة السيد(ة) المفتش(ة)',
        name: 'مفتش(ة) المقاطعة التربوية',
        role: 'التأطير والمراقبة التربوية',
        show: doc?.showInspectorSignature ?? true,
        order: 2,
      },
      {
        id: 'sig-admin',
        title: 'خاتم وتأشيرة الإدارة التربوية',
        name: doc?.schoolName || 'إدارة المؤسسة',
        role: 'رئيس المؤسسة',
        show: false,
        order: 3,
      },
    ],
  };
}

export function getDefaultFooterConfig(doc?: Partial<DocumentData>): DocumentFooterConfig {
  return {
    showFooter: doc?.showFooterInfo ?? true,
    showPageNumbers: doc?.showPageNumbers ?? true,
    customText: 'المملكة المغربية • وزارة التربية الوطنية والتعليم الأولي والرياضة',
    showDecoration: true,
    showAcademicYear: true,
  };
}

/**
 * Ensures all design configurations exist on a document.
 */
export function ensureDocumentDesign(doc: DocumentData): DocumentData {
  return {
    ...doc,
    logoConfig: doc.logoConfig ? { ...getDefaultLogoConfig(doc), ...doc.logoConfig } : getDefaultLogoConfig(doc),
    headerConfig: doc.headerConfig ? { ...getDefaultHeaderConfig(doc), ...doc.headerConfig } : getDefaultHeaderConfig(doc),
    borderConfig: doc.borderConfig ? { ...getDefaultBorderConfig(doc), ...doc.borderConfig } : getDefaultBorderConfig(doc),
    decorationConfig: doc.decorationConfig ? { ...getDefaultDecorationConfig(doc), ...doc.decorationConfig } : getDefaultDecorationConfig(doc),
    marginConfig: doc.marginConfig ? { ...getDefaultMarginConfig(doc), ...doc.marginConfig } : getDefaultMarginConfig(doc),
    signaturesConfig: doc.signaturesConfig ? { ...getDefaultSignaturesConfig(doc), ...doc.signaturesConfig } : getDefaultSignaturesConfig(doc),
    footerConfig: doc.footerConfig ? { ...getDefaultFooterConfig(doc), ...doc.footerConfig } : getDefaultFooterConfig(doc),
  };
}

/**
 * Saves current document layout design preset to localStorage
 */
export function saveUserDesignPreset(doc: DocumentData): void {
  try {
    const preset = {
      logoConfig: doc.logoConfig,
      headerConfig: doc.headerConfig,
      borderConfig: doc.borderConfig,
      decorationConfig: doc.decorationConfig,
      marginConfig: doc.marginConfig,
      signaturesConfig: doc.signaturesConfig,
      footerConfig: doc.footerConfig,
      fontFamily: doc.fontFamily,
      themeColor: doc.themeColor,
      savedAt: Date.now(),
    };
    localStorage.setItem(USER_DESIGN_PRESET_STORAGE_KEY, JSON.stringify(preset));
  } catch (e) {
    console.error('Failed to save user design preset', e);
  }
}

/**
 * Loads saved user design preset
 */
export function loadUserDesignPreset(): Partial<DocumentData> | null {
  try {
    const data = localStorage.getItem(USER_DESIGN_PRESET_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load user design preset', e);
    return null;
  }
}
