const avatarImages = require.context('../avatars', false, /\.(png|jpg|jpeg|gif)$/);

const avatars = avatarImages.keys().map((key) => {
    const fileName = key.replace(/\.\//, ''); // Remove leading "./"
    const nameWithoutExtension = fileName.replace(/\.\w+$/, ''); // Remove file extension
    const image = avatarImages(key);

    return {
        name: nameWithoutExtension,
        image: image
    };
});

function findAvatarByName(name) {
    const avatar = avatars.find((avatar) => avatar.name === name);
    return avatar ? avatar.image : avatars.find((avatar) => avatar.name === 'default_avatar').image;
}

export { avatars, findAvatarByName };
