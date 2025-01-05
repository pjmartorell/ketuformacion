export interface Musician {
    id: number;
    name: string;
    instrument: string;
    x?: number;
    y?: number;
    avatar?: string;  // Add avatar field to store the data URL
}

export interface Instrument {
    id: number;
    name: string;
}

export interface Position {
    x: number;
    y: number;
}

export interface CanvasItem {
    id: number;
    x: number;
    y: number;
    musician: Musician;
}

export interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface MusicianFormData {
    name: string;
    instrument: string;
    imageFile?: File;
}
