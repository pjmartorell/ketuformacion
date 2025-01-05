import { CanvasDesign } from '../types/types';

const STORAGE_KEY = 'ketu-canvas-designs';

export const canvasStorage = {
    getAll: (): CanvasDesign[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    save: (design: CanvasDesign): void => {
        const designs = canvasStorage.getAll();
        const existingIndex = designs.findIndex(d => d.id === design.id);

        if (existingIndex >= 0) {
            designs[existingIndex] = {
                ...design,
                updatedAt: Date.now()
            };
        } else {
            designs.push({
                ...design,
                id: crypto.randomUUID(),
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
    },

    delete: (id: string): void => {
        const designs = canvasStorage.getAll().filter(d => d.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
    },

    get: (id: string): CanvasDesign | undefined => {
        return canvasStorage.getAll().find(d => d.id === id);
    }
};
