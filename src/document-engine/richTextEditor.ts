import { TextRunNode } from './types';

/**
 * Converts structured runs to plain text string
 */
export function runsToPlainText(runs: TextRunNode[]): string {
  if (!Array.isArray(runs)) return '';
  return runs.map((r) => r.text || '').join('');
}

/**
 * Converts a plain string to an array of TextRunNode
 */
export function plainTextToRuns(text: string, defaultStyle: Partial<TextRunNode> = {}): TextRunNode[] {
  if (!text) return [];
  return [
    {
      type: 'text',
      text,
      ...defaultStyle,
    },
  ];
}

/**
 * Merges adjacent runs that have identical formatting
 */
export function normalizeRuns(runs: TextRunNode[]): TextRunNode[] {
  if (!Array.isArray(runs) || runs.length === 0) return [];

  const normalized: TextRunNode[] = [];

  for (const run of runs) {
    if (!run || !run.text) continue;

    const prev = normalized[normalized.length - 1];
    if (
      prev &&
      Boolean(prev.bold) === Boolean(run.bold) &&
      Boolean(prev.italic) === Boolean(run.italic) &&
      Boolean(prev.underline) === Boolean(run.underline) &&
      (prev.color || '') === (run.color || '') &&
      (prev.backgroundColor || '') === (run.backgroundColor || '') &&
      (prev.fontSize || 0) === (run.fontSize || 0) &&
      (prev.fontFamily || '') === (run.fontFamily || '')
    ) {
      prev.text += run.text;
    } else {
      normalized.push({ ...run });
    }
  }

  return normalized;
}

export interface FormatOptions {
  bold?: boolean | 'toggle';
  italic?: boolean | 'toggle';
  underline?: boolean | 'toggle';
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: string;
  removeFormat?: boolean;
}

/**
 * Applies character-level formatting to a range within structured runs.
 * Mutates the data model cleanly with zero reliance on document.execCommand.
 */
export function applyFormattingToRuns(
  runs: TextRunNode[],
  startChar: number,
  endChar: number,
  format: FormatOptions
): TextRunNode[] {
  if (startChar >= endChar || startChar < 0) return runs;

  const newRuns: TextRunNode[] = [];
  let currentChar = 0;

  // If toggle is requested, inspect if the selection is already all bold/italic/underline
  let currentSelectionIsBold = true;
  let currentSelectionIsItalic = true;
  let currentSelectionIsUnderline = true;
  let hasInspectedChar = false;

  let inspectChar = 0;
  for (const run of runs) {
    const runText = run.text || '';
    const runStart = inspectChar;
    const runEnd = runStart + runText.length;
    inspectChar = runEnd;

    // Check intersection with selection
    const overlapStart = Math.max(startChar, runStart);
    const overlapEnd = Math.min(endChar, runEnd);

    if (overlapStart < overlapEnd) {
      hasInspectedChar = true;
      if (!run.bold) currentSelectionIsBold = false;
      if (!run.italic) currentSelectionIsItalic = false;
      if (!run.underline) currentSelectionIsUnderline = false;
    }
  }

  const targetBold = format.bold === 'toggle' ? (!hasInspectedChar || !currentSelectionIsBold) : format.bold;
  const targetItalic = format.italic === 'toggle' ? (!hasInspectedChar || !currentSelectionIsItalic) : format.italic;
  const targetUnderline = format.underline === 'toggle' ? (!hasInspectedChar || !currentSelectionIsUnderline) : format.underline;

  for (const run of runs) {
    const runText = run.text || '';
    const runLength = runText.length;
    const runStart = currentChar;
    const runEnd = currentChar + runLength;
    currentChar = runEnd;

    // Case 1: Run is entirely before or entirely after the target selection range
    if (runEnd <= startChar || runStart >= endChar) {
      newRuns.push({ ...run });
      continue;
    }

    // Split run into up to 3 parts: [before, selected, after]
    const sliceBeforeEnd = Math.max(0, startChar - runStart);
    const sliceSelectedStart = sliceBeforeEnd;
    const sliceSelectedEnd = Math.min(runLength, endChar - runStart);

    // Part A: text before selection
    if (sliceBeforeEnd > 0) {
      newRuns.push({
        ...run,
        text: runText.substring(0, sliceBeforeEnd),
      });
    }

    // Part B: selected range - apply format modifications
    if (sliceSelectedStart < sliceSelectedEnd) {
      const selectedText = runText.substring(sliceSelectedStart, sliceSelectedEnd);

      if (format.removeFormat) {
        newRuns.push({
          type: 'text',
          text: selectedText,
        });
      } else {
        const updatedRun: TextRunNode = {
          ...run,
          text: selectedText,
        };

        if (targetBold !== undefined) updatedRun.bold = targetBold;
        if (targetItalic !== undefined) updatedRun.italic = targetItalic;
        if (targetUnderline !== undefined) updatedRun.underline = targetUnderline;
        if (format.color !== undefined) updatedRun.color = format.color;
        if (format.backgroundColor !== undefined) updatedRun.backgroundColor = format.backgroundColor;
        if (format.fontSize !== undefined) updatedRun.fontSize = format.fontSize;
        if (format.fontFamily !== undefined) updatedRun.fontFamily = format.fontFamily;

        newRuns.push(updatedRun);
      }
    }

    // Part C: text after selection
    if (sliceSelectedEnd < runLength) {
      newRuns.push({
        ...run,
        text: runText.substring(sliceSelectedEnd),
      });
    }
  }

  return normalizeRuns(newRuns);
}
