interface Avatar {
    name: string;
    image: string;
}

// Use dynamic imports for images
const avatarImports = import.meta.glob('../avatars/*.{png,jpg,jpeg,gif}', { eager: true });

const avatarContext = Object.fromEntries(
    Object.entries(avatarImports).map(([key, value]) => [
        key.split('/').pop()?.replace(/\.[^/.]+$/, ''),
        (value as { default: string }).default
    ])
);

const defaultAvatarImage = avatarContext['default_avatar'] || '';

export function findAvatarByName(name: string): string {
    return avatarContext[name] || defaultAvatarImage;
}

export const avatars = Object.entries(avatarContext).map(([name, image]) => ({
    name,
    image
}));
