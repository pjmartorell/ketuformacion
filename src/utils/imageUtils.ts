type SupportedImageFormat = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/svg+xml' | 'image/webp';

interface ImageConfig {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  targetSizeKB: number;
  convertToWebP?: boolean; // Add WebP conversion option
  preserveVector?: boolean; // Add option to preserve vector formats
}

interface ProcessedImage {
  blob: Blob;
  width: number;
  height: number;
  size: number;
}

export class ImageUtils {
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly SUPPORTED_FORMATS: SupportedImageFormat[] = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp'
  ];
  private static readonly DEFAULT_CONFIG: ImageConfig = {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.8,
    targetSizeKB: 500,
    convertToWebP: true, // Add WebP conversion option
    preserveVector: true
  };

  private static isVectorFormat(type: string): boolean {
    return type === 'image/svg+xml';
  }

  static isValidImageFormat(file: File): boolean {
    return this.SUPPORTED_FORMATS.includes(file.type as SupportedImageFormat);
  }

  static isValidFileSize(file: File): boolean {
    return file.size <= this.MAX_FILE_SIZE;
  }

  static async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };
    });
  }

  static async validateImage(file: File): Promise<boolean> {
    if (!this.isValidImageFormat(file)) {
      throw new Error(
        `Unsupported format. Supported formats: ${this.SUPPORTED_FORMATS.map(f => f.split('/')[1]).join(', ')}`
      );
    }

    if (!this.isValidFileSize(file)) {
      throw new Error(`File size must be less than ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    try {
      // Skip dimension checks for vector formats
      if (this.isVectorFormat(file.type)) {
        return true;
      }

      const dimensions = await this.getImageDimensions(file);
      if (dimensions.width < 100 || dimensions.height < 100) {
        throw new Error('Image dimensions too small. Minimum 100x100 pixels required.');
      }
      if (dimensions.width > 4000 || dimensions.height > 4000) {
        throw new Error('Image dimensions too large. Maximum 4000x4000 pixels allowed.');
      }
      return true;
    } catch (error) {
      throw new Error(`Image validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async processImage(file: File, config: Partial<ImageConfig> = {}): Promise<ProcessedImage> {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    await this.validateImage(file);

    // Preserve vector formats if configured
    if (this.isVectorFormat(file.type) && finalConfig.preserveVector) {
      const blob = await this.processVectorImage(file);
      return {
        blob,
        width: finalConfig.maxWidth,
        height: finalConfig.maxHeight,
        size: blob.size
      };
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    const img = await this.loadImage(file);
    let { width, height } = this.calculateAspectRatio(
      img.width,
      img.height,
      finalConfig.maxWidth,
      finalConfig.maxHeight
    );

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    // Use WebP if supported and enabled
    let quality = finalConfig.quality;
    let blob = finalConfig.convertToWebP
      ? await this.convertToWebP(canvas, quality)
      : await this.canvasToBlob(canvas, file.type, quality);

    // Progressive quality reduction if needed
    while (blob.size > finalConfig.targetSizeKB * 1024 && quality > 0.1) {
      quality -= 0.1;
      blob = finalConfig.convertToWebP
        ? await this.convertToWebP(canvas, quality)
        : await this.canvasToBlob(canvas, file.type, quality);
    }

    return {
      blob,
      width,
      height,
      size: blob.size
    };
  }

  private static async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };
    });
  }

  private static calculateAspectRatio(
    srcWidth: number,
    srcHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {
      width: Math.round(srcWidth * ratio),
      height: Math.round(srcHeight * ratio)
    };
  }

  private static canvasToBlob(
    canvas: HTMLCanvasElement,
    type: string,
    quality: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        type,
        quality
      );
    });
  }

  private static supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  private static async convertToWebP(
    canvas: HTMLCanvasElement,
    quality: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (this.supportsWebP()) {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert to WebP'));
            }
          },
          'image/webp',
          quality
        );
      } else {
        // Fallback to PNG if WebP is not supported
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert to PNG'));
            }
          },
          'image/png',
          quality
        );
      }
    });
  }

  private static async processVectorImage(file: File): Promise<Blob> {
    // For SVG files, we can return them as-is since they're scalable
    if (file.type === 'image/svg+xml') {
      // Optional: Clean and optimize SVG content
      const text = await file.text();
      const cleanedSvg = this.cleanSvg(text);
      return new Blob([cleanedSvg], { type: 'image/svg+xml' });
    }
    throw new Error('Unsupported vector format');
  }

  private static cleanSvg(svgContent: string): string {
    // Basic SVG cleaning - you can expand this based on needs
    return svgContent
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/\s+/g, ' ') // Reduce whitespace
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .trim();
  }
}

export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<string> {
  await ImageUtils.validateImage(file);

  // Return SVG as-is
  if (file.type === 'image/svg+xml') {
    return URL.createObjectURL(file);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

  const { width, height } = ImageUtils['calculateAspectRatio'](
    img.width,
    img.height,
    maxWidth,
    maxHeight
  );

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  URL.revokeObjectURL(img.src);

  // Use WebP if supported, otherwise fallback to original format
  const mimeType = ImageUtils['supportsWebP']() ? 'image/webp' : file.type;
  return canvas.toDataURL(mimeType, quality);
}
