import { CanvasDesign } from '../types/types';

const AUTOSAVE_KEY = 'ketu-canvas-autosave';
const AUTOSAVE_TIMESTAMP_KEY = 'ketu-canvas-autosave-timestamp';

export const autosaveStorage = {
    save: (design: Partial<CanvasDesign>): void => {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(design));
        localStorage.setItem(AUTOSAVE_TIMESTAMP_KEY, Date.now().toString());
    },

    load: (): { design: Partial<CanvasDesign>; timestamp: number } | null => {
        const data = localStorage.getItem(AUTOSAVE_KEY);
        const timestamp = localStorage.getItem(AUTOSAVE_TIMESTAMP_KEY);

        if (!data || !timestamp) return null;

        return {
            design: JSON.parse(data),
            timestamp: parseInt(timestamp, 10)
        };
    },

    clear: (): void => {
        localStorage.removeItem(AUTOSAVE_KEY);
        localStorage.removeItem(AUTOSAVE_TIMESTAMP_KEY);
    }
};
