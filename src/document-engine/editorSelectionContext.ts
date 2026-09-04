import { TextRunNode } from './types';
import { FormatOptions, applyFormattingToRuns, runsToPlainText } from './richTextEditor';

export interface ActiveSelectionState {
  fieldId: string | null;
  text: string;
  runs: TextRunNode[];
  startChar: number;
  endChar: number;
  rect: { top: number; left: number; width: number; height: number } | null;
  onUpdateRuns: ((newRuns: TextRunNode[]) => void) | null;
}

type Listener = () => void;

class SelectionStore {
  private state: ActiveSelectionState = {
    fieldId: null,
    text: '',
    runs: [],
    startChar: 0,
    endChar: 0,
    rect: null,
    onUpdateRuns: null,
  };

  private listeners: Set<Listener> = new Set();

  public getState(): ActiveSelectionState {
    return this.state;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const l of this.listeners) {
      try {
        l();
      } catch (err) {
        console.error('Selection listener error:', err);
      }
    }
  }

  public setSelection(
    fieldId: string,
    text: string,
    runs: TextRunNode[],
    startChar: number,
    endChar: number,
    rect: { top: number; left: number; width: number; height: number } | null,
    onUpdateRuns: (newRuns: TextRunNode[]) => void
  ): void {
    this.state = {
      fieldId,
      text,
      runs,
      startChar,
      endChar,
      rect,
      onUpdateRuns,
    };
    this.notify();
  }

  public clearSelection(): void {
    if (this.state.fieldId === null) return;
    this.state = {
      fieldId: null,
      text: '',
      runs: [],
      startChar: 0,
      endChar: 0,
      rect: null,
      onUpdateRuns: null,
    };
    this.notify();
  }

  public applyFormat(format: FormatOptions): boolean {
    if (!this.state.fieldId || !this.state.onUpdateRuns || this.state.startChar >= this.state.endChar) {
      return false;
    }

    const updatedRuns = applyFormattingToRuns(
      this.state.runs,
      this.state.startChar,
      this.state.endChar,
      format
    );

    this.state.onUpdateRuns(updatedRuns);
    this.state.runs = updatedRuns;
    this.notify();
    return true;
  }
}

export const editorSelectionStore = new SelectionStore();
