import { useState, useCallback } from 'react';
import { Position } from '../types/types';

export const useCanvas = () => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const handleZoom = useCallback((newScale: number) => {
        setScale(prev => Math.max(0.3, Math.min(2.6, prev * newScale)));
    }, []);

    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        const scaleBy = e.deltaY > 0 ? 0.9 : 1.1;
        handleZoom(scaleBy);
    }, [handleZoom]);

    const handleDragStart = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleDragMove = useCallback((newPos: Position) => {
        setPosition(newPos);
    }, []);

    return {
        scale,
        position,
        isDragging,
        handleZoom,
        handleWheel,
        handleDragStart,
        handleDragEnd,
        handleDragMove
    };
};
