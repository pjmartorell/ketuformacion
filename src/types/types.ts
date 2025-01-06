export interface Musician {
    id: number;
    name: string;
    instrument: string;
    x?: number;
    y?: number;
    avatar?: string;
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

export interface CanvasDesign {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    items: CanvasItem[];
    lines: CanvasLine[];
    scale: number;
    position: Position;
    windowSize: {
        width: number;
        height: number;
    };
}

export interface CanvasLine {
    id: string;
    startItemId: number;
    endItemId: number;
}
