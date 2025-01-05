import { useCallback, useRef, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';

interface LongPressOptions {
  onClick?: (e: KonvaEventObject<any>) => void;
  onLongPress?: (e: KonvaEventObject<any>) => void;
  ms?: number;
}

export const useLongPress = (options: LongPressOptions = {}) => {
  const { onClick, onLongPress, ms = 500 } = options;
  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const eventRef = useRef<KonvaEventObject<any>>();
  const isLongPress = useRef(false);

  const start = useCallback((e: KonvaEventObject<any>) => {
    eventRef.current = e;
    isLongPress.current = false;
    setIsPressed(true);
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      if (onLongPress && eventRef.current) {
        onLongPress(eventRef.current);
      }
    }, ms);
  }, [onLongPress, ms]);

  const stop = useCallback(() => {
    setIsPressed(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      if (!isLongPress.current && onClick && eventRef.current) {
        onClick(eventRef.current);
      }
    }
  }, [onClick]);

  return {
    isPressed,
    handlers: {
      onTouchStart: start,
      onTouchEnd: stop,
      onTouchMove: stop,
      onMouseDown: start,
      onMouseUp: stop,
      onMouseLeave: stop,
    },
  };
};
