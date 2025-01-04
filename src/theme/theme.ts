export const theme = {
    colors: {
        primary: '#007AFF',
        secondary: '#5856D6',
        background: '#FFFFFF',
        text: '#000000',
        gray: {
            light: '#F2F2F7',
            medium: '#C7C7CC',
            dark: '#8E8E93',
        }
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    },
    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        round: '50%',
    },
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    transitions: {
        default: '0.3s ease-in-out',
        fast: '0.15s ease-in-out',
        slow: '0.5s ease-in-out'
    }
};

export type Theme = typeof theme;
