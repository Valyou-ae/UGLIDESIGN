type RefinerPreset = {
  name: string;
  description: string;
  sharpen: number;
  contrast: number;
  saturation: number;
  brightness: number;
  vignette: boolean;
  filmGrain: boolean;
  colorGrade: string;
  microContrast?: number;
  clarityBoost?: number;
  shadowLift?: number;
  highlightRecovery?: number;
  vibrance?: number;
  chromaticAberration?: number;
  lensDistortion?: number;
  shadowTint?: { r: number; g: number; b: number };
  highlightTint?: { r: number; g: number; b: number };
};

export const REFINER_PRESETS: Record<string, RefinerPreset> = {
  cinematic: {
    name: "Cinematic Polish",
    description: "Hollywood-grade color grading and enhancement",
    sharpen: 1.2,
    contrast: 1.1,
    saturation: 1.15,
    brightness: 1.02,
    vignette: true,
    filmGrain: false,
    colorGrade: 'teal-orange',
    shadowLift: 8,
    highlightRecovery: -5,
  },
  photorealistic: {
    name: "Photorealistic Polish",
    description: "Simulates a high-end camera & lens",
    sharpen: 1.1,
    contrast: 1.08,
    saturation: 1.0,
    brightness: 1.0,
    vignette: true,
    filmGrain: false,
    colorGrade: 'none',
    microContrast: 1.05,
    clarityBoost: 0.1,
    shadowLift: 5,
    highlightRecovery: -3,
    vibrance: 1.08,
    chromaticAberration: 0.2,
    lensDistortion: 0.01,
    shadowTint: { r: 250, g: 252, b: 255 },
    highlightTint: { r: 255, g: 253, b: 250 },
  },
  artistic: {
    name: "Artistic Boost",
    description: "Bold colors and dramatic enhancement",
    sharpen: 1.4,
    contrast: 1.2,
    saturation: 1.3,
    brightness: 1.05,
    vignette: true,
    filmGrain: false,
    colorGrade: 'vibrant'
  },
  clean: {
    name: "Clean & Sharp",
    description: "Professional clarity without stylization",
    sharpen: 1.2,
    contrast: 1.05,
    saturation: 1.0,
    brightness: 1.0,
    vignette: false,
    filmGrain: false,
    colorGrade: 'none'
  },
};

export interface RefinerOptions {
  preset: keyof typeof REFINER_PRESETS;
}

export async function refineImage(
  imageBase64: string,
  options: RefinerOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    let preset = REFINER_PRESETS[options.preset];
    if (!preset) {
      console.warn(`Refiner preset "${options.preset}" not found. Using 'clean' as fallback.`);
      preset = REFINER_PRESETS['clean'];
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Could not get canvas context');

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (preset.lensDistortion) imageData = applyLensDistortion(imageData, preset.lensDistortion);
      if (preset.shadowLift) imageData = liftShadows(imageData, preset.shadowLift);
      if (preset.highlightRecovery) imageData = recoverHighlights(imageData, preset.highlightRecovery);
      if (preset.clarityBoost) imageData = applyClarity(imageData, preset.clarityBoost);
      if (preset.microContrast) imageData = applyMicroContrast(imageData, preset.microContrast);
      imageData = applySCurveContrast(imageData, preset.contrast);
      imageData = applyBrightnessSaturationVibrance(imageData, preset.brightness, preset.saturation, preset.vibrance);
      imageData = applyConvolutionSharpen(imageData, preset.sharpen);
      if (preset.chromaticAberration) imageData = applyChromaticAberration(imageData, preset.chromaticAberration);

      ctx.putImageData(imageData, 0, 0);

      if (preset.shadowTint && preset.highlightTint) {
        applyColorTints(ctx, canvas.width, canvas.height, preset.shadowTint, preset.highlightTint);
      }
      if (preset.colorGrade !== 'none') {
        applyColorGrade(ctx, canvas.width, canvas.height, preset.colorGrade);
      }
      if (preset.filmGrain) {
        applyFilmGrain(ctx, canvas.width, canvas.height);
      }
      if (preset.vignette) {
        applyVignette(ctx, canvas.width, canvas.height);
      }

      resolve(canvas.toDataURL('image/png').split(',')[1]);
    };

    img.onerror = (err) => {
      console.error("Refiner error: could not load image", err);
      reject('Failed to load image for refinement.');
    };
    img.src = `data:image/png;base64,${imageBase64}`;
  });
}

function applyLensDistortion(imageData: ImageData, amount: number): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const output = new Uint8ClampedArray(data.length);
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const r = Math.sqrt(dx * dx + dy * dy) / maxRadius;
      const distortion = 1.0 - amount * (r * r);
      const srcX = centerX + dx * distortion;
      const srcY = centerY + dy * distortion;
      const idx = (y * width + x) * 4;

      if (srcX >= 0 && srcX < width - 1 && srcY >= 0 && srcY < height - 1) {
        const x1 = Math.floor(srcX);
        const y1 = Math.floor(srcY);
        const x2 = x1 + 1;
        const y2 = y1 + 1;
        const fx = srcX - x1;
        const fy = srcY - y1;

        for (let i = 0; i < 4; i++) {
          const p1 = data[(y1 * width + x1) * 4 + i];
          const p2 = data[(y1 * width + x2) * 4 + i];
          const p3 = data[(y2 * width + x1) * 4 + i];
          const p4 = data[(y2 * width + x2) * 4 + i];
          const val1 = p1 * (1 - fx) + p2 * fx;
          const val2 = p3 * (1 - fx) + p4 * fx;
          output[idx + i] = val1 * (1 - fy) + val2 * fy;
        }
      }
    }
  }
  imageData.data.set(output);
  return imageData;
}

function applyChromaticAberration(imageData: ImageData, amount: number): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const output = new Uint8ClampedArray(data.length);
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDist = Math.max(centerX, centerY);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const shift = (dist / maxDist) * amount;

      const r_x = Math.floor(x - dx * shift * 0.01);
      const r_y = Math.floor(y - dy * shift * 0.01);
      const b_x = Math.floor(x + dx * shift * 0.01);
      const b_y = Math.floor(y + dy * shift * 0.01);

      const r_idx = (Math.max(0, Math.min(height - 1, r_y)) * width + Math.max(0, Math.min(width - 1, r_x))) * 4;
      const b_idx = (Math.max(0, Math.min(height - 1, b_y)) * width + Math.max(0, Math.min(width - 1, b_x))) * 4;

      output[idx] = data[r_idx];
      output[idx + 1] = data[idx + 1];
      output[idx + 2] = data[b_idx + 2];
      output[idx + 3] = data[idx + 3];
    }
  }
  imageData.data.set(output);
  return imageData;
}

function applyFastGaussian(data: Uint8ClampedArray, width: number, height: number, radius: number): Uint8ClampedArray {
  const output = new Uint8ClampedArray(data.length);
  const kernel = radius * 2 + 1;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const ny = Math.min(height - 1, Math.max(0, y + ky));
          const nx = Math.min(width - 1, Math.max(0, x + kx));
          const idx = (ny * width + nx) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          count++;
        }
      }
      const idx = (y * width + x) * 4;
      output[idx] = r / count;
      output[idx + 1] = g / count;
      output[idx + 2] = b / count;
      output[idx + 3] = data[idx + 3];
    }
  }
  return output;
}

function applyMicroContrast(imageData: ImageData, amount: number): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const output = new Uint8ClampedArray(data);
  const blurData = applyFastGaussian(new Uint8ClampedArray(data), width, height, 2);
  for (let i = 0; i < data.length; i += 4) {
    const detailR = data[i] - blurData[i];
    const detailG = data[i+1] - blurData[i+1];
    const detailB = data[i+2] - blurData[i+2];
    output[i] = data[i] + detailR * (amount - 1);
    output[i+1] = data[i+1] + detailG * (amount - 1);
    output[i+2] = data[i+2] + detailB * (amount - 1);
  }
  imageData.data.set(output);
  return imageData;
}

function applyClarity(imageData: ImageData, amount: number): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const output = new Uint8ClampedArray(data);
  const blurData = applyFastGaussian(new Uint8ClampedArray(data), width, height, 5);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const blurLum = 0.299 * blurData[i] + 0.587 * blurData[i+1] + 0.114 * blurData[i+2];
    if (lum > 50 && lum < 200) {
       const contrast = lum - blurLum;
       output[i] = r + contrast * amount;
       output[i+1] = g + contrast * amount;
       output[i+2] = b + contrast * amount;
    }
  }
  imageData.data.set(output);
  return imageData;
}

function liftShadows(imageData: ImageData, amount: number): ImageData {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < 80) {
      const lift = (1 - (lum / 80)) * amount;
      data[i] = Math.min(255, r + lift);
      data[i + 1] = Math.min(255, g + lift);
      data[i + 2] = Math.min(255, b + lift);
    }
  }
  return imageData;
}

function recoverHighlights(imageData: ImageData, amount: number): ImageData {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum > 180) {
      const recovery = ((lum - 180) / 75) * amount;
      data[i] = Math.max(0, r + recovery);
      data[i + 1] = Math.max(0, g + recovery);
      data[i + 2] = Math.max(0, b + recovery);
    }
  }
  return imageData;
}

function applyColorTints(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  shadowTint: { r: number; g: number; b: number },
  highlightTint: { r: number; g: number; b: number }
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (lum < 80) {
      const strength = (80 - lum) / 80 * 0.1;
      data[i] = data[i] * (1 - strength) + shadowTint.r * strength;
      data[i + 1] = data[i + 1] * (1 - strength) + shadowTint.g * strength;
      data[i + 2] = data[i + 2] * (1 - strength) + shadowTint.b * strength;
    }
    if (lum > 200) {
      const strength = (lum - 200) / 55 * 0.05;
      data[i] = data[i] * (1 - strength) + highlightTint.r * strength;
      data[i + 1] = data[i + 1] * (1 - strength) + highlightTint.g * strength;
      data[i + 2] = data[i + 2] * (1 - strength) + highlightTint.b * strength;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyBrightnessSaturationVibrance(imageData: ImageData, brightness: number, saturation: number, vibrance: number = 1.0) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i], g = data[i + 1], b = data[i + 2];

    r *= brightness;
    g *= brightness;
    b *= brightness;

    const max = Math.max(r, g, b);

    if (vibrance > 1.0) {
      const amount = (Math.abs(max - (r + g + b) / 3) * 2 / 255) * (vibrance - 1.0);
      if (r !== max) r += (max - r) * amount;
      if (g !== max) g += (max - g) * amount;
      if (b !== max) b += (max - b) * amount;
    }

    const satAvg = (r + g + b) / 3;
    r = Math.max(0, Math.min(255, satAvg + (r - satAvg) * saturation));
    g = Math.max(0, Math.min(255, satAvg + (g - satAvg) * saturation));
    b = Math.max(0, Math.min(255, satAvg + (b - satAvg) * saturation));

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
  return imageData;
}

function applySCurveContrast(imageData: ImageData, contrast: number) {
  const data = imageData.data;
  const steepness = (contrast - 1.0) * 10 + 4;
  const sCurve = (x: number) => 1 / (1 + Math.exp(-steepness * (x - 0.5)));

  for (let i = 0; i < data.length; i += 4) {
    data[i] = sCurve(data[i] / 255) * 255;
    data[i + 1] = sCurve(data[i + 1] / 255) * 255;
    data[i + 2] = sCurve(data[i + 2] / 255) * 255;
  }
  return imageData;
}

function applyConvolutionSharpen(imageData: ImageData, amount: number) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const outputData = new Uint8ClampedArray(data);
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  const side = Math.round(Math.sqrt(kernel.length));
  const halfSide = Math.floor(side / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dst = (y * width + x) * 4;
      let r = 0, g = 0, b = 0;
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = y + cy - halfSide;
          const scx = x + cx - halfSide;
          if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
            const src = (scy * width + scx) * 4;
            const weight = kernel[cy * side + cx];
            r += data[src] * weight;
            g += data[src + 1] * weight;
            b += data[src + 2] * weight;
          }
        }
      }
      const originalR = data[dst], originalG = data[dst + 1], originalB = data[dst + 2];
      outputData[dst] = originalR + (r - originalR) * (amount - 1);
      outputData[dst + 1] = originalG + (g - originalG) * (amount - 1);
      outputData[dst + 2] = originalB + (b - originalB) * (amount - 1);
    }
  }
  imageData.data.set(outputData);
  return imageData;
}

function applyColorGrade(ctx: CanvasRenderingContext2D, width: number, height: number, grade: string): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (grade === 'teal-orange') {
      if (lum < 128) {
        r = r * 0.9;
        g = g * 0.95 + 5;
        b = b * 1.1 + 10;
      } else {
        r = r * 1.1 + 10;
        g = g * 0.95;
        b = b * 0.85;
      }
    } else if (grade === 'vibrant') {
      r = r * 1.1;
      g = g * 1.05;
      b = b * 1.15;
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyFilmGrain(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const grainAmount = 10;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * grainAmount * 2;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyVignette(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.3,
    width / 2, height / 2, Math.max(width, height) * 0.7
  );
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.4)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
