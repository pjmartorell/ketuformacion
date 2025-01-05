import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Props {
    children: React.ReactNode;
}

export const Portal: React.FC<Props> = ({ children }) => {
    const el = useRef(document.createElement('div'));
    const mountPoint = useRef<HTMLElement | null>(null);
    const isMounted = useRef(false);

    useEffect(() => {
        mountPoint.current = document.body;
        const currentEl = el.current;

        if (!isMounted.current) {
            mountPoint.current.appendChild(currentEl);
            isMounted.current = true;
        }

        return () => {
            if (mountPoint.current && mountPoint.current.contains(currentEl)) {
                mountPoint.current.removeChild(currentEl);
            }
            isMounted.current = false;
        };
    }, []);

    return createPortal(children, el.current);
};
