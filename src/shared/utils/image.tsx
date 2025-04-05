import Avatar from 'boring-avatars';
import ReactDOMServer from 'react-dom/server';

export const imageToBase64 = (file: File, maxSize = 200) => {
  const reader = new FileReader();

  return new Promise<string>((resolve) => {
    reader.onload = (e) => {
      const img = new Image();
      //@ts-expect-error skip
      img.src = e.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0, width, height);

        // Convert to Base64
        const base64String = canvas.toDataURL('image/png');

        resolve(base64String);
      };
    };

    reader.readAsDataURL(file);
  });
};

export function getRandomAvatarSVG(person = false) {
  // Generate a random string name
  const randomName = Math.random().toString(36).substring(2, 10);

  // Allowed avatar variants (excluding "sunset" and "beam")
  const variants = person ? ['beam'] : ['marble', 'pixel', 'ring', 'bauhaus'];
  const randomVariant = variants[Math.floor(Math.random() * variants.length)];

  // Generate a random color palette
  const randomColors = Array.from(
    { length: 5 },
    () =>
      `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`
  );

  // Create Avatar component
  const avatarComponent = (
    <Avatar size={40} name={randomName} variant={randomVariant as any} colors={randomColors} />
  );

  // Convert Avatar component to an SVG string
  const svgString = ReactDOMServer.renderToStaticMarkup(avatarComponent);

  // Encode SVG to Base64
  const base64SVG = btoa(unescape(encodeURIComponent(svgString)));

  return `data:image/svg+xml;base64,${base64SVG}`;
}
