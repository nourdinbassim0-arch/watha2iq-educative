import {
  StructuredDocument,
  PageSettings,
  PageSize,
  PageOrientation,
  DocumentNode,
  ParagraphNode,
  HeadingNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  TextRunNode,
  ImageNode,
  SpacerNode,
  PageBreakNode,
  HorizontalRuleNode,
  CalloutBoxNode,
} from './types';
import { DocumentData } from '../types';

export const PAGE_SIZE_DIMENSIONS_MM: Record<PageSize, { width: number; height: number }> = {
  A4: { width: 210, height: 297 },
  A3: { width: 297, height: 420 },
  A5: { width: 148, height: 210 },
  LETTER: { width: 215.9, height: 279.4 },
  LEGAL: { width: 215.9, height: 355.6 },
  CUSTOM: { width: 210, height: 297 },
};

/**
 * Returns exact mm dimensions taking orientation into account
 */
export function getPageDimensionsMm(page: PageSettings): { widthMm: number; heightMm: number } {
  let baseWidth = page.customWidthMm || PAGE_SIZE_DIMENSIONS_MM[page.size]?.width || 210;
  let baseHeight = page.customHeightMm || PAGE_SIZE_DIMENSIONS_MM[page.size]?.height || 297;

  if (page.orientation === 'landscape') {
    return {
      widthMm: Math.max(baseWidth, baseHeight),
      heightMm: Math.min(baseWidth, baseHeight),
    };
  }

  return {
    widthMm: Math.min(baseWidth, baseHeight),
    heightMm: Math.max(baseWidth, baseHeight),
  };
}

/**
 * Returns usable printable area dimensions in mm
 */
export function getUsablePageAreaMm(page: PageSettings): { widthMm: number; heightMm: number } {
  const { widthMm, heightMm } = getPageDimensionsMm(page);
  return {
    widthMm: Math.max(50, widthMm - page.margins.left - page.margins.right),
    heightMm: Math.max(50, heightMm - page.margins.top - page.margins.bottom),
  };
}

/**
 * Node construction helpers
 */
export const nodeBuilders = {
  textRun(text: string, options: Partial<TextRunNode> = {}): TextRunNode {
    return {
      type: 'text',
      text,
      ...options,
    };
  },

  paragraph(children: (TextRunNode | string)[], options: Partial<ParagraphNode> = {}): ParagraphNode {
    const textNodes: TextRunNode[] = children.map((c) => (typeof c === 'string' ? { type: 'text', text: c } : c));
    return {
      type: 'paragraph',
      children: textNodes,
      direction: options.direction || 'rtl',
      alignment: options.alignment || 'right',
      lineHeight: options.lineHeight || 1.25,
      spacingAfter: options.spacingAfter ?? 6,
      ...options,
    };
  },

  heading(text: string, level: 1 | 2 | 3 | 4 = 1, options: Partial<HeadingNode> = {}): HeadingNode {
    const fontSizes: Record<number, number> = { 1: 22, 2: 18, 3: 15, 4: 13 };
    return {
      type: 'heading',
      level,
      children: [
        {
          type: 'text',
          text,
          bold: true,
          fontSize: fontSizes[level] || 16,
          color: options.color || '#065f46',
        },
      ],
      direction: 'rtl',
      alignment: 'right',
      spacingBefore: level === 1 ? 12 : 8,
      spacingAfter: 6,
      keepWithNext: true,
      ...options,
    };
  },

  table(rows: TableRowNode[], options: Partial<TableNode> = {}): TableNode {
    return {
      type: 'table',
      rows,
      widthPercentage: options.widthPercentage || 100,
      direction: options.direction || 'rtl',
      repeatHeader: options.repeatHeader ?? true,
      ...options,
    };
  },

  tableCell(
    children: (ParagraphNode | HeadingNode | ImageNode | SpacerNode | HorizontalRuleNode)[],
    options: Partial<TableCellNode> = {}
  ): TableCellNode {
    return {
      children,
      paddingMm: options.paddingMm ?? 2.5,
      verticalAlignment: options.verticalAlignment || 'top',
      ...options,
    };
  },

  spacer(heightMm = 5): SpacerNode {
    return {
      type: 'spacer',
      heightMm,
    };
  },

  pageBreak(): PageBreakNode {
    return {
      type: 'pageBreak',
    };
  },

  horizontalRule(color = '#065f46', thicknessPt = 1): HorizontalRuleNode {
    return {
      type: 'horizontalRule',
      color,
      thicknessPt,
      spacingBeforePt: 4,
      spacingAfterPt: 6,
    };
  },

  callout(title: string, children: DocumentNode[], options: Partial<CalloutBoxNode> = {}): CalloutBoxNode {
    return {
      type: 'callout',
      title,
      children,
      backgroundColor: options.backgroundColor || '#f8fafc',
      borderColor: options.borderColor || '#cbd5e1',
      textColor: options.textColor || '#0f172a',
      direction: options.direction || 'rtl',
      ...options,
    };
  },
};

/**
 * Validates a StructuredDocument model for consistency and safety
 */
export function validateDocument(doc: StructuredDocument): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!doc) {
    errors.push('الوثيقة غير موجودة أو فارغة.');
    return { isValid: false, errors };
  }

  if (!doc.title || doc.title.trim().length === 0) {
    errors.push('عنوان الوثيقة مطلوب.');
  }

  if (!doc.page) {
    errors.push('إعدادات الصفحة (Page Settings) مفقودة.');
  } else {
    if (!doc.page.margins) {
      errors.push('هوامش الصفحة مفقودة.');
    } else {
      if (doc.page.margins.top < 0 || doc.page.margins.bottom < 0 || doc.page.margins.left < 0 || doc.page.margins.right < 0) {
        errors.push('قيم الهوامش يجب أن تكون أرقاماً موجبة.');
      }
    }
  }

  if (!doc.sections || !Array.isArray(doc.sections)) {
    errors.push('أقسام الوثيقة غير معرفة بالشكل الصحيح.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Migrates or converts legacy DocumentData into a high-fidelity StructuredDocument model
 */
export function toStructuredDocument(data: DocumentData): StructuredDocument {
  const isRtl = data.language !== 'fr' && data.language !== 'en';
  const direction = isRtl ? 'rtl' : 'ltr';

  // Map page format to PageSettings
  let size: PageSize = 'A4';
  let orientation: PageOrientation = 'portrait';

  if (data.pageFormat) {
    if (data.pageFormat.includes('a3')) size = 'A3';
    else if (data.pageFormat.includes('a5')) size = 'A5';
    else if (data.pageFormat.includes('letter')) size = 'LETTER';
    else if (data.pageFormat.includes('legal')) size = 'LEGAL';

    if (data.pageFormat.includes('landscape')) orientation = 'landscape';
  }

  // Margin calculation in mm
  const marginMm = data.marginSize === 'tight' ? 12 : data.marginSize === 'generous' ? 25 : 18;
  const page: PageSettings = {
    size,
    orientation,
    margins: {
      top: marginMm,
      right: marginMm,
      bottom: marginMm,
      left: marginMm,
    },
    headerDistanceMm: 8,
    footerDistanceMm: 8,
  };

  const nodes: DocumentNode[] = [];

  // 1. Official Ministry & Administration Header Table
  if (data.showOfficialHeader !== false) {
    const leftHeaderParagraphs: ParagraphNode[] = [
      nodeBuilders.paragraph([
        nodeBuilders.textRun(data.kingdomHeader || 'المملكة المغربية', { bold: true, fontSize: 11, color: '#065f46' }),
      ], { alignment: 'center', spacingAfter: 2 }),
      nodeBuilders.paragraph([
        nodeBuilders.textRun(data.ministryHeader || 'وزارة التربية الوطنية والتعليم الأولي والرياضة', { bold: true, fontSize: 9.5 }),
      ], { alignment: 'center', spacingAfter: 2 }),
      nodeBuilders.paragraph([
        nodeBuilders.textRun(`${data.academy || 'الأكاديمية الجهوية'} • ${data.directorate || 'المديرية الإقليمية'}`, { fontSize: 8.5, color: '#475569' }),
      ], { alignment: 'center', spacingAfter: 2 }),
      nodeBuilders.paragraph([
        nodeBuilders.textRun(`المؤسسة: ${data.schoolName || 'المؤسسة التعليمية'}`, { bold: true, fontSize: 9, color: '#1e293b' }),
      ], { alignment: 'center', spacingAfter: 0 }),
    ];

    const rightHeaderParagraphs: ParagraphNode[] = [
      nodeBuilders.paragraph([
        nodeBuilders.textRun(`السنة الدراسية: ${data.academicYear || '2025/2026'}`, { bold: true, fontSize: 10 }),
      ], { alignment: 'center', spacingAfter: 2 }),
      nodeBuilders.paragraph([
        nodeBuilders.textRun(`الأستاذ(ة): ${data.teacherName || 'ذ. المعني(ة)'}`, { bold: true, fontSize: 9.5, color: '#065f46' }),
      ], { alignment: 'center', spacingAfter: 2 }),
      nodeBuilders.paragraph([
        nodeBuilders.textRun(`المستوى: ${data.grade || '-'} ${data.classGroup ? `(${data.classGroup})` : ''}`, { fontSize: 9 }),
      ], { alignment: 'center', spacingAfter: 2 }),
      nodeBuilders.paragraph([
        nodeBuilders.textRun(`المادة: ${data.subjectNameAr || data.subjectNameFr || '-'}`, { bold: true, fontSize: 9.5, color: '#065f46' }),
      ], { alignment: 'center', spacingAfter: 0 }),
    ];

    const headerTable = nodeBuilders.table([
      {
        cells: [
          nodeBuilders.tableCell(leftHeaderParagraphs, {
            widthPercentage: 50,
            paddingMm: 2,
            backgroundColor: '#f8fafc',
            borders: {
              top: { style: 'solid', size: 1, color: '#065f46' },
              bottom: { style: 'solid', size: 1, color: '#cbd5e1' },
              left: { style: 'solid', size: 1, color: '#cbd5e1' },
              right: { style: 'solid', size: 1, color: '#cbd5e1' },
            },
          }),
          nodeBuilders.tableCell(rightHeaderParagraphs, {
            widthPercentage: 50,
            paddingMm: 2,
            backgroundColor: '#f8fafc',
            borders: {
              top: { style: 'solid', size: 1, color: '#065f46' },
              bottom: { style: 'solid', size: 1, color: '#cbd5e1' },
              left: { style: 'solid', size: 1, color: '#cbd5e1' },
              right: { style: 'solid', size: 1, color: '#cbd5e1' },
            },
          }),
        ],
      },
    ], {
      widthPercentage: 100,
      direction,
    });

    nodes.push(headerTable);
    nodes.push(nodeBuilders.spacer(4));
  }

  // 2. Main Document Title Banner
  const titleBanner = nodeBuilders.paragraph([
    nodeBuilders.textRun(data.title || 'وثيقة تربوية رسمية', {
      bold: true,
      fontSize: 16,
      color: '#ffffff',
    }),
  ], {
    alignment: 'center',
    backgroundColor: '#065f46',
    padding: 6,
    spacingBefore: 4,
    spacingAfter: 8,
    borderRadius: 4,
  });
  nodes.push(titleBanner);

  // 3. Document-Type Specific Content Nodes

  // --- TYPE 1: FICHE PEDAGOGIQUE (الجذاذة البيداغوجية) ---
  if (data.documentType === 'fiche_pedagogique') {
    // Pedagogical Overview Grid
    const overviewRows: TableRowNode[] = [
      {
        cells: [
          nodeBuilders.tableCell([
            nodeBuilders.paragraph([
              nodeBuilders.textRun('المجزوءة / الوحدة: ', { bold: true, fontSize: 9.5 }),
              nodeBuilders.textRun(data.unitOrModule || '-', { fontSize: 9.5 }),
            ]),
            nodeBuilders.paragraph([
              nodeBuilders.textRun('عنوان الدرس: ', { bold: true, fontSize: 10, color: '#065f46' }),
              nodeBuilders.textRun(data.lessonTitle || '-', { bold: true, fontSize: 10, color: '#065f46' }),
            ]),
          ], { widthPercentage: 50, paddingMm: 2.5 }),
          nodeBuilders.tableCell([
            nodeBuilders.paragraph([
              nodeBuilders.textRun('الغلاف الزمني: ', { bold: true, fontSize: 9.5 }),
              nodeBuilders.textRun(data.duration || 'ساعتان (2h)', { fontSize: 9.5 }),
            ]),
            nodeBuilders.paragraph([
              nodeBuilders.textRun('المكتسبات القبلية: ', { bold: true, fontSize: 9.5 }),
              nodeBuilders.textRun((data.prerequisites || []).join('، ') || 'المكتسبات السابقة', { fontSize: 9 }),
            ]),
          ], { widthPercentage: 50, paddingMm: 2.5 }),
        ],
      },
    ];

    nodes.push(nodeBuilders.table(overviewRows, { widthPercentage: 100 }));
    nodes.push(nodeBuilders.spacer(4));

    // Competences & Objectives
    if ((data.generalCompetences && data.generalCompetences.length > 0) || (data.specificObjectives && data.specificObjectives.length > 0)) {
      const compCells: TableCellNode[] = [];
      if (data.generalCompetences && data.generalCompetences.length > 0) {
        compCells.push(
          nodeBuilders.tableCell([
            nodeBuilders.heading('الكفايات المستهدفة', 3, { color: '#065f46', fontSize: 10.5 }),
            ...data.generalCompetences.map((c) =>
              nodeBuilders.paragraph([nodeBuilders.textRun(`• ${c}`, { fontSize: 9 })], { spacingAfter: 2 })
            ),
          ], { widthPercentage: 50, paddingMm: 2.5, backgroundColor: '#f0fdf4' })
        );
      }
      if (data.specificObjectives && data.specificObjectives.length > 0) {
        compCells.push(
          nodeBuilders.tableCell([
            nodeBuilders.heading('الأهداف التعلمية الإجرائية', 3, { color: '#065f46', fontSize: 10.5 }),
            ...data.specificObjectives.map((o) =>
              nodeBuilders.paragraph([nodeBuilders.textRun(`• ${o}`, { fontSize: 9 })], { spacingAfter: 2 })
            ),
          ], { widthPercentage: 50, paddingMm: 2.5, backgroundColor: '#f0fdf4' })
        );
      }
      nodes.push(nodeBuilders.table([{ cells: compCells }], { widthPercentage: 100 }));
      nodes.push(nodeBuilders.spacer(4));
    }

    // Didactic Stages Table
    if (data.lessonStages && data.lessonStages.length > 0) {
      nodes.push(nodeBuilders.heading('مراحل الدرس والوضعيات التعليمية التعلمية', 2, { color: '#065f46' }));

      const stageHeaderRow: TableRowNode = {
        isHeader: true,
        cells: [
          nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun('المرحلة / المدة', { bold: true, fontSize: 9.5, color: '#ffffff' })], { alignment: 'center' })], { widthPercentage: 20, backgroundColor: '#065f46', paddingMm: 2 }),
          nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun('أنشطة الأستاذ(ة) والتدبير', { bold: true, fontSize: 9.5, color: '#ffffff' })], { alignment: 'right' })], { widthPercentage: 35, backgroundColor: '#065f46', paddingMm: 2 }),
          nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun('أنشطة المتعلم(ة) ومهام الإنجاز', { bold: true, fontSize: 9.5, color: '#ffffff' })], { alignment: 'right' })], { widthPercentage: 30, backgroundColor: '#065f46', paddingMm: 2 }),
          nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun('التقويم والدعامات', { bold: true, fontSize: 9.5, color: '#ffffff' })], { alignment: 'center' })], { widthPercentage: 15, backgroundColor: '#065f46', paddingMm: 2 }),
        ],
      };

      const stageRows: TableRowNode[] = [
        stageHeaderRow,
        ...data.lessonStages.map((stg, idx) => ({
          cells: [
            nodeBuilders.tableCell([
              nodeBuilders.paragraph([nodeBuilders.textRun(stg.stageName || '-', { bold: true, fontSize: 9.5, color: '#0f172a' })]),
              nodeBuilders.paragraph([nodeBuilders.textRun(`(${stg.duration || '20 min'})`, { fontSize: 8.5, color: '#475569' })], { alignment: 'center' }),
            ], { paddingMm: 2, backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }),
            nodeBuilders.tableCell([
              nodeBuilders.paragraph([nodeBuilders.textRun(stg.teacherActivities || '-', { fontSize: 9 })]),
            ], { paddingMm: 2, backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }),
            nodeBuilders.tableCell([
              nodeBuilders.paragraph([nodeBuilders.textRun(stg.studentActivities || '-', { fontSize: 9 })]),
            ], { paddingMm: 2, backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }),
            nodeBuilders.tableCell([
              nodeBuilders.paragraph([nodeBuilders.textRun(stg.evaluationMode || '-', { fontSize: 8.5, bold: true, color: '#065f46' })]),
              nodeBuilders.paragraph([nodeBuilders.textRun(stg.didacticTools || '', { fontSize: 8, color: '#64748b' })]),
            ], { paddingMm: 2, backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }),
          ],
        })),
      ];

      nodes.push(nodeBuilders.table(stageRows, { widthPercentage: 100, repeatHeader: true }));
      nodes.push(nodeBuilders.spacer(4));
    }

    // Evaluation and Support Section
    if (data.diagnosticEval || data.summativeEval || data.supportActivities) {
      const evalCells: TableCellNode[] = [
        nodeBuilders.tableCell([
          nodeBuilders.heading('أنشطة التقويم والمعالجة', 3, { fontSize: 10, color: '#065f46' }),
          nodeBuilders.paragraph([
            nodeBuilders.textRun('تشخيصي: ', { bold: true, fontSize: 8.5 }),
            nodeBuilders.textRun(data.diagnosticEval || '-', { fontSize: 8.5 }),
          ], { spacingAfter: 2 }),
          nodeBuilders.paragraph([
            nodeBuilders.textRun('إجمالي: ', { bold: true, fontSize: 8.5 }),
            nodeBuilders.textRun(data.summativeEval || '-', { fontSize: 8.5 }),
          ]),
        ], { widthPercentage: 50, paddingMm: 2, backgroundColor: '#f8fafc' }),
        nodeBuilders.tableCell([
          nodeBuilders.heading('الدعم البيداغوجي والفارقي', 3, { fontSize: 10, color: '#065f46' }),
          nodeBuilders.paragraph([
            nodeBuilders.textRun(data.supportActivities || 'معالجة الثغرات المفاهيمية ورصد التعثرات في حينها.', { fontSize: 8.5 }),
          ]),
        ], { widthPercentage: 50, paddingMm: 2, backgroundColor: '#f8fafc' }),
      ];

      nodes.push(nodeBuilders.table([{ cells: evalCells }], { widthPercentage: 100 }));
    }
  }

  // --- TYPE 2: CHARTE DE CLASSE (ميثاق القسم) ---
  else if (data.documentType === 'charte_classe') {
    if (data.charteIntroduction) {
      nodes.push(
        nodeBuilders.callout('ديباجة ميثاق الحياة المشتركة داخل الفصل', [
          nodeBuilders.paragraph([nodeBuilders.textRun(data.charteIntroduction, { fontSize: 9.5, italic: true })]),
        ], { backgroundColor: '#fffbeb', borderColor: '#fde68a' })
      );
      nodes.push(nodeBuilders.spacer(4));
    }

    if (data.charteRules && data.charteRules.length > 0) {
      nodes.push(nodeBuilders.heading('بنود وقواعد ميثاق القسم', 2, { color: '#065f46' }));

      const ruleRows: TableRowNode[] = [
        {
          isHeader: true,
          cells: [
            nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun('الرقم', { bold: true, fontSize: 9.5, color: '#ffffff' })], { alignment: 'center' })], { widthPercentage: 10, backgroundColor: '#065f46', paddingMm: 2 }),
            nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun('المجال / الفئة', { bold: true, fontSize: 9.5, color: '#ffffff' })], { alignment: 'center' })], { widthPercentage: 25, backgroundColor: '#065f46', paddingMm: 2 }),
            nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun('نص البند والالتزام الصفي', { bold: true, fontSize: 9.5, color: '#ffffff' })], { alignment: 'right' })], { widthPercentage: 65, backgroundColor: '#065f46', paddingMm: 2 }),
          ],
        },
        ...data.charteRules.map((rule, idx) => ({
          cells: [
            nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun(`${idx + 1}`, { bold: true, fontSize: 9 })], { alignment: 'center' })], { paddingMm: 2 }),
            nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun(rule.category || 'انضباط والتزام', { bold: true, fontSize: 9, color: '#065f46' })])], { paddingMm: 2 }),
            nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun(rule.ruleText || '', { fontSize: 9 })])], { paddingMm: 2 }),
          ],
        })),
      ];

      nodes.push(nodeBuilders.table(ruleRows, { widthPercentage: 100 }));
      nodes.push(nodeBuilders.spacer(4));
    }
  }

  // --- TYPE 3: CONTROLE / DEVOIR (فروض واختبارات) ---
  else if (data.documentType === 'controle_devoir') {
    // Student ID & Grade Table
    const examHeaderRow: TableRowNode = {
      cells: [
        nodeBuilders.tableCell([
          nodeBuilders.paragraph([
            nodeBuilders.textRun('الاسم والنسب: .....................................................', { fontSize: 9.5 }),
          ]),
          nodeBuilders.paragraph([
            nodeBuilders.textRun(`القسم: ${data.grade} (${data.classGroup || '1'})   |   الرقم الترتيبي: .........`, { fontSize: 9 }),
          ]),
        ], { widthPercentage: 70, paddingMm: 2.5 }),
        nodeBuilders.tableCell([
          nodeBuilders.paragraph([nodeBuilders.textRun('النقطة المحصل عليها', { bold: true, fontSize: 9.5 })], { alignment: 'center' }),
          nodeBuilders.paragraph([nodeBuilders.textRun('.... / 20', { bold: true, fontSize: 14, color: '#991b1b' })], { alignment: 'center' }),
        ], { widthPercentage: 30, paddingMm: 2.5, backgroundColor: '#fef2f2' }),
      ],
    };
    nodes.push(nodeBuilders.table([examHeaderRow], { widthPercentage: 100 }));
    nodes.push(nodeBuilders.spacer(4));

    if (data.examInstructions && data.examInstructions.length > 0) {
      nodes.push(
        nodeBuilders.callout('تعليمات وإرشادات الإنجاز', [
          nodeBuilders.paragraph([nodeBuilders.textRun(data.examInstructions.join(' • '), { fontSize: 8.5 })]),
        ], { backgroundColor: '#fffbeb', borderColor: '#fde68a' })
      );
      nodes.push(nodeBuilders.spacer(4));
    }

    if (data.exercises && data.exercises.length > 0) {
      data.exercises.forEach((ex, idx) => {
        nodes.push(
          nodeBuilders.heading(`${ex.title || `التمرين ${idx + 1}`} (${ex.points || '4'} ن)`, 3, { color: '#065f46', fontSize: 11 })
        );
        if (ex.description) {
          nodes.push(nodeBuilders.paragraph([nodeBuilders.textRun(ex.description, { fontSize: 9.5 })], { spacingAfter: 4 }));
        }
        if (ex.subQuestions && ex.subQuestions.length > 0) {
          ex.subQuestions.forEach((q) => {
            nodes.push(nodeBuilders.paragraph([nodeBuilders.textRun(q, { fontSize: 9 })], { spacingAfter: 2 }));
          });
        }
        nodes.push(nodeBuilders.spacer(3));
      });
    }
  }

  // --- TYPE 4: GRILLE DE NOTATION / REGISTRE DE NOTES (شبكات وسجلات النقط) ---
  else if (data.documentType === 'grille_notation' || data.documentType === 'registre_notes') {
    if (data.scoreRows && data.scoreRows.length > 0) {
      const scoreHeaders: TableRowNode = {
        isHeader: true,
        cells: [
          nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun('ر.ت', { bold: true, fontSize: 9, color: '#ffffff' })], { alignment: 'center' })], { widthPercentage: 8, backgroundColor: '#065f46', paddingMm: 1.5 }),
          nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun('اسم التلميذ(ة)', { bold: true, fontSize: 9, color: '#ffffff' })], { alignment: 'right' })], { widthPercentage: 32, backgroundColor: '#065f46', paddingMm: 1.5 }),
          nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun('م 1', { bold: true, fontSize: 9, color: '#ffffff' })], { alignment: 'center' })], { widthPercentage: 12, backgroundColor: '#065f46', paddingMm: 1.5 }),
          nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun('م 2', { bold: true, fontSize: 9, color: '#ffffff' })], { alignment: 'center' })], { widthPercentage: 12, backgroundColor: '#065f46', paddingMm: 1.5 }),
          nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun('م 3', { bold: true, fontSize: 9, color: '#ffffff' })], { alignment: 'center' })], { widthPercentage: 12, backgroundColor: '#065f46', paddingMm: 1.5 }),
          nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun('المجموع', { bold: true, fontSize: 9, color: '#ffffff' })], { alignment: 'center' })], { widthPercentage: 12, backgroundColor: '#065f46', paddingMm: 1.5 }),
          nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun('الملاحظة', { bold: true, fontSize: 9, color: '#ffffff' })], { alignment: 'center' })], { widthPercentage: 12, backgroundColor: '#065f46', paddingMm: 1.5 }),
        ],
      };

      const scoreRows: TableRowNode[] = [
        scoreHeaders,
        ...data.scoreRows.map((sr, idx) => ({
          cells: [
            nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun(`${sr.studentNumber || idx + 1}`, { fontSize: 8.5 })], { alignment: 'center' })], { paddingMm: 1.5 }),
            nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun(sr.studentName || '-', { bold: true, fontSize: 9 })])], { paddingMm: 1.5 }),
            nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun(`${sr.c1 || '-'}`, { fontSize: 8.5 })], { alignment: 'center' })], { paddingMm: 1.5 }),
            nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun(`${sr.c2 || '-'}`, { fontSize: 8.5 })], { alignment: 'center' })], { paddingMm: 1.5 }),
            nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun(`${sr.c3 || '-'}`, { fontSize: 8.5 })], { alignment: 'center' })], { paddingMm: 1.5 }),
            nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun(`${sr.total || '-'}`, { bold: true, fontSize: 9, color: '#065f46' })], { alignment: 'center' })], { paddingMm: 1.5, backgroundColor: '#f0fdf4' }),
            nodeBuilders.tableCell([nodeBuilders.paragraph([nodeBuilders.textRun(sr.appreciation || '-', { fontSize: 8.5 })], { alignment: 'center' })], { paddingMm: 1.5 }),
          ],
        })),
      ];

      nodes.push(nodeBuilders.table(scoreRows, { widthPercentage: 100, repeatHeader: true }));
      nodes.push(nodeBuilders.spacer(4));
    }
  }

  // --- CUSTOM DYNAMIC SECTIONS & RESUME SECTIONS ---
  if (data.resumeSections && data.resumeSections.length > 0) {
    data.resumeSections.forEach((sec, idx) => {
      nodes.push(nodeBuilders.heading(`${idx + 1}. ${sec.title}`, 2, { color: '#065f46' }));
      nodes.push(nodeBuilders.paragraph([nodeBuilders.textRun(sec.content, { fontSize: 9.5 })], { spacingAfter: 4 }));
      if (sec.keyPoints && sec.keyPoints.length > 0) {
        sec.keyPoints.forEach((kp) => {
          nodes.push(nodeBuilders.paragraph([nodeBuilders.textRun(`• ${kp}`, { fontSize: 9 })], { spacingAfter: 2 }));
        });
      }
      nodes.push(nodeBuilders.spacer(3));
    });
  }

  if (data.customSections && data.customSections.length > 0) {
    data.customSections.forEach((sec, idx) => {
      if (sec.title) {
        nodes.push(nodeBuilders.heading(`${idx + 1}. ${sec.title}`, 2, { color: '#065f46' }));
      }
      if (sec.content) {
        const textContent = typeof sec.content === 'string' ? sec.content : JSON.stringify(sec.content);
        const lines = textContent.split('\n');
        lines.forEach((line) => {
          if (line.trim()) {
            nodes.push(nodeBuilders.paragraph([nodeBuilders.textRun(line, { fontSize: 9.5 })], { spacingAfter: 3 }));
          }
        });
      }
      nodes.push(nodeBuilders.spacer(3));
    });
  }

  // 4. Custom Signatures Block
  if (data.customSignatures && data.customSignatures.length > 0) {
    const activeSignatures = data.customSignatures.filter((s) => s.show !== false);
    if (activeSignatures.length > 0) {
      nodes.push(nodeBuilders.spacer(6));
      const sigCells = activeSignatures.map((sig) =>
        nodeBuilders.tableCell([
          nodeBuilders.paragraph([nodeBuilders.textRun(sig.title || 'توقيع', { bold: true, fontSize: 9.5 })], { alignment: 'center' }),
          nodeBuilders.paragraph([nodeBuilders.textRun(sig.name || '', { fontSize: 9, color: '#475569' })], { alignment: 'center' }),
          nodeBuilders.spacer(10),
          nodeBuilders.paragraph([nodeBuilders.textRun('......................................', { fontSize: 8, color: '#94a3b8' })], { alignment: 'center' }),
        ], {
          widthPercentage: Math.floor(100 / activeSignatures.length),
          paddingMm: 3,
          backgroundColor: '#fafafa',
          borders: {
            top: { style: 'dotted', size: 1, color: '#cbd5e1' },
            bottom: { style: 'solid', size: 1, color: '#e2e8f0' },
            left: { style: 'solid', size: 1, color: '#e2e8f0' },
            right: { style: 'solid', size: 1, color: '#e2e8f0' },
          },
        })
      );
      nodes.push(nodeBuilders.table([{ cells: sigCells }], { widthPercentage: 100 }));
    }
  }

  return {
    schemaVersion: 1,
    id: data.id || `doc-${Date.now()}`,
    title: data.title || 'وثيقة تربوية',
    language: data.language || 'ar',
    page,
    metadata: {
      author: data.teacherName,
      subject: data.subjectNameAr || data.subjectNameFr,
      school: data.schoolName,
      academicYear: data.academicYear,
      grade: data.grade,
      directorate: data.directorate,
      academy: data.academy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      documentType: data.documentType,
    },
    sections: [
      {
        id: 'main-section',
        title: data.title,
        nodes,
      },
    ],
    watermarkText: data.watermarkText,
  };
}

/**
 * Ensures backwards compatibility for stored documents
 */
export function migrateDocument(storedData: any): StructuredDocument {
  if (storedData && storedData.schemaVersion === 1 && storedData.sections && storedData.page) {
    return storedData as StructuredDocument;
  }
  return toStructuredDocument(storedData as DocumentData);
}
