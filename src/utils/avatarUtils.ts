import { storageService } from '../services/storage';

interface Avatar {
    name: string;
    image: string;
}

// Use dynamic imports for default avatars
const avatarImports = import.meta.glob('../avatars/*.{png,jpg,jpeg,gif}', { eager: true });

const defaultAvatars = Object.fromEntries(
    Object.entries(avatarImports).map(([key, value]) => [
        key.split('/').pop()?.replace(/\.[^/.]+$/, ''),
        (value as { default: string }).default
    ])
);

const defaultAvatarImage = defaultAvatars['default_avatar'] || '';

export function findAvatarByName(name: string): string {
    // First check in localStorage
    const storedAvatar = storageService.getAvatar(name);
    if (storedAvatar) {
        return storedAvatar;
    }

    // Fallback to default avatars
    return defaultAvatars[name] || defaultAvatarImage;
}

export const avatars = Object.entries(defaultAvatars).map(([name, image]) => ({
    name,
    image
}));

export const validateImageFile = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Add any validation rules here (size, dimensions, etc.)
                resolve(true);
            };
            img.onerror = () => {
                resolve(false);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
};
