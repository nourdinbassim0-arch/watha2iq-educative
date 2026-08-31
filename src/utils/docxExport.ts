import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
} from 'docx';
import { DocumentData } from '../types';

/**
 * Builds a clean, fully formatted Word (.docx) document strictly matching Microsoft Word standards and RTL layout.
 */
export async function exportToDocx(docData: DocumentData): Promise<void> {
  const paragraphs: (Paragraph | Table)[] = [];

  // Header / Title
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: docData.title || 'وثيقة تربوية رسمية',
          bold: true,
          size: 32, // 16pt
          font: 'Calibri',
          color: '065f46',
        }),
      ],
    })
  );

  // Administrative metadata block
  const headerRows = [
    [
      `المملكة المغربية - وزارة التربية الوطنية والتعليم الأولي والرياضة`,
      `السنة الدراسية: ${docData.academicYear || '2025/2026'}`,
    ],
    [
      `الأكاديمية: ${docData.academy || '-'}`,
      `المديرية الإقليمية: ${docData.directorate || '-'}`,
    ],
    [
      `المؤسسة التعليمية: ${docData.schoolName || '-'}`,
      `الأستاذ(ة): ${docData.teacherName || '-'}`,
    ],
    [
      `المستوى والقسم: ${docData.grade || '-'} ${docData.classGroup || ''}`,
      `المادة: ${docData.subjectNameAr || '-'}`,
    ],
  ];

  const tableRows = headerRows.map(
    (row) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                bidirectional: true,
                children: [
                  new TextRun({ text: row[0], size: 20, font: 'Calibri' }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                bidirectional: true,
                children: [
                  new TextRun({ text: row[1], size: 20, font: 'Calibri' }),
                ],
              }),
            ],
          }),
        ],
      })
  );

  paragraphs.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
    })
  );

  paragraphs.push(new Paragraph({ spacing: { after: 200 }, children: [] }));

  // Lesson stages if available
  if (docData.lessonStages && docData.lessonStages.length > 0) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'المراحل والوضعيات التعليمية التعلمية',
            bold: true,
            size: 24,
            font: 'Calibri',
            color: '1e293b',
          }),
        ],
      })
    );

    const stageRows = [
      new TableRow({
        children: [
          new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'المرحلة / المدة', bold: true })] })] }),
          new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'أنشطة الأستاذ(ة)', bold: true })] })] }),
          new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'أنشطة المتعلم(ة)', bold: true })] })] }),
        ],
      }),
      ...docData.lessonStages.map(
        (stg) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun(`${stg.stageName} (${stg.duration})`)] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun(stg.teacherActivities)] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun(stg.studentActivities)] })] }),
            ],
          })
      ),
    ];

    paragraphs.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: stageRows,
      })
    );
  }

  // Custom sections
  if (docData.customSections && docData.customSections.length > 0) {
    docData.customSections.forEach((sec, idx) => {
      if (sec.title) {
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: `${idx + 1}. ${sec.title}`,
                bold: true,
                size: 24,
                font: 'Calibri',
                color: '1e293b',
              }),
            ],
          })
        );
      }

      if (sec.content) {
        const textContent = typeof sec.content === 'string' ? sec.content : JSON.stringify(sec.content);
        const lines = textContent.split('\n');
        lines.forEach((line) => {
          if (line.trim()) {
            paragraphs.push(
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                bidirectional: true,
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: line,
                    size: 22,
                    font: 'Calibri',
                  }),
                ],
              })
            );
          }
        });
      }
    });
  }

  // Signatures
  if (docData.customSignatures && docData.customSignatures.length > 0) {
    paragraphs.push(new Paragraph({ spacing: { before: 400, after: 100 }, children: [] }));

    const sigCells = docData.customSignatures.map(
      (sig) =>
        new TableCell({
          width: { size: Math.floor(100 / docData.customSignatures!.length), type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              bidirectional: true,
              children: [
                new TextRun({ text: sig.title || 'توقيع', bold: true, size: 20, font: 'Calibri' }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              bidirectional: true,
              children: [
                new TextRun({ text: sig.name || '', size: 18, font: 'Calibri' }),
              ],
            }),
          ],
        })
    );

    paragraphs.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [new TableRow({ children: sigCells })],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanTitle = (docData.title || 'document').replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cleanTitle}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
