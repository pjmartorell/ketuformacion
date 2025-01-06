
import { CanvasDesign } from '../types/types';

export interface HistoryState {
    items: CanvasDesign['items'];
    lines: CanvasDesign['lines'];
    scale: number;
}

export class HistoryManager {
    private states: HistoryState[] = [];
    private currentIndex: number = -1;
    private maxStates: number = 30;

    push(state: HistoryState): void {
        // Remove all states after current index
        this.states = this.states.slice(0, this.currentIndex + 1);

        // Add new state
        this.states.push(JSON.parse(JSON.stringify(state)));

        // Remove oldest states if exceeding maxStates
        if (this.states.length > this.maxStates) {
            this.states.shift();
        }

        this.currentIndex = this.states.length - 1;
    }

    canUndo(): boolean {
        return this.currentIndex > 0;
    }

    canRedo(): boolean {
        return this.currentIndex < this.states.length - 1;
    }

    undo(): HistoryState | null {
        if (!this.canUndo()) return null;
        this.currentIndex--;
        return JSON.parse(JSON.stringify(this.states[this.currentIndex]));
    }

    redo(): HistoryState | null {
        if (!this.canRedo()) return null;
        this.currentIndex++;
        return JSON.parse(JSON.stringify(this.states[this.currentIndex]));
    }

    clear(): void {
        this.states = [];
        this.currentIndex = -1;
    }
}