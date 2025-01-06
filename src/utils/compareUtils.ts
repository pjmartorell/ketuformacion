type GenericObject = { [key: string]: any };

export const stripAvatars = (obj: GenericObject): GenericObject => {
    if (Array.isArray(obj)) {
        return obj.map(item => stripAvatars(item));
    }

    if (obj !== null && typeof obj === 'object') {
        const stripped: GenericObject = {};
        for (const [key, value] of Object.entries(obj)) {
            if (key !== 'avatar') {
                stripped[key] = stripAvatars(value);
            }
        }
        return stripped;
    }

    return obj;
};

export const areCanvasStatesEqual = (state1: any, state2: any): boolean => {
    const stripped1 = stripAvatars(state1);
    const stripped2 = stripAvatars(state2);
    return JSON.stringify(stripped1) === JSON.stringify(stripped2);
};
