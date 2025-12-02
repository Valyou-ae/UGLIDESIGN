import { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } from 'canvas';
import path from 'path';

export interface TextElement {
  text: string;
  type: 'title' | 'subtitle' | 'author' | 'quote' | 'publisher' | 'custom';
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  position?: 'top' | 'center' | 'bottom';
  alignment?: 'left' | 'center' | 'right';
  y?: number;
  maxWidth?: number;
  lineHeight?: number;
}

export interface TextOverlayConfig {
  elements: TextElement[];
  width: number;
  height: number;
  padding?: number;
  backgroundColor?: string;
}

interface ParsedBookCover {
  title?: string;
  subtitle?: string;
  author?: string;
  quote?: string;
  publisher?: string;
  visualPrompt: string;
}

export function parseBookCoverPrompt(prompt: string): ParsedBookCover {
  const result: ParsedBookCover = {
    visualPrompt: prompt
  };

  const titleMatch = prompt.match(/(?:book cover|title)[:\s]+['"]([^'"]+)['"]/i) ||
                     prompt.match(/['"]([^'"]+)['"].*(?:book cover)/i) ||
                     prompt.match(/(?:for|called|titled)\s+['"]([^'"]+)['"]/i);
  
  const subtitleMatch = prompt.match(/subtitle[:\s]+['"]([^'"]+)['"]/i) ||
                        prompt.match(/['"](An? [^'"]+)['"]/i);
  
  const authorMatch = prompt.match(/(?:author|by)[:\s]+['"]?([^'",]+?)['"]?(?:\.|,|$)/i) ||
                      prompt.match(/(?:By|Author:)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z\-]+)+(?:\s+[IVX]+)?)/);
  
  const quoteMatch = prompt.match(/quote[:\s]+['"]([^'"]+)['"]/i) ||
                     prompt.match(/['"]([^'"]{30,}?(?:\.{3}|\.)['""])/i);
  
  const publisherMatch = prompt.match(/publisher[:\s]+['"]([^'"]+)['"]/i) ||
                         prompt.match(/([\w\s]+Press[^'"]*)/i);

  if (titleMatch) result.title = titleMatch[1];
  if (subtitleMatch) result.subtitle = subtitleMatch[1];
  if (authorMatch) result.author = authorMatch[1].trim();
  if (quoteMatch) result.quote = quoteMatch[1];
  if (publisherMatch) result.publisher = publisherMatch[1].trim();

  const textPatterns = [
    /['"][^'"]+['"]/g,
    /title[:\s]+[^,.]*/gi,
    /author[:\s]+[^,.]*/gi,
    /quote[:\s]+[^,.]*/gi,
    /publisher[:\s]+[^,.]*/gi,
  ];
  
  let visualPrompt = prompt;
  textPatterns.forEach(pattern => {
    visualPrompt = visualPrompt.replace(pattern, '');
  });
  
  result.visualPrompt = visualPrompt
    .replace(/\s+/g, ' ')
    .replace(/,\s*,/g, ',')
    .trim();
  
  if (!result.visualPrompt || result.visualPrompt.length < 20) {
    result.visualPrompt = "vintage book cover with elegant design, aged paper texture, classical illustration, ornate decorative border, library aesthetic";
  }

  return result;
}

export function extractTextFromPrompt(prompt: string): TextElement[] {
  const elements: TextElement[] = [];
  const parsed = parseBookCoverPrompt(prompt);

  if (parsed.title) {
    elements.push({
      text: parsed.title.toUpperCase(),
      type: 'title',
      fontSize: 72,
      fontFamily: 'serif',
      fontWeight: 'bold',
      color: '#1a1a1a',
      position: 'top',
      alignment: 'center'
    });
  }

  if (parsed.subtitle) {
    elements.push({
      text: parsed.subtitle.toUpperCase(),
      type: 'subtitle',
      fontSize: 32,
      fontFamily: 'serif',
      fontWeight: 'normal',
      color: '#333333',
      position: 'top',
      alignment: 'center'
    });
  }

  if (parsed.author) {
    elements.push({
      text: `By ${parsed.author}`,
      type: 'author',
      fontSize: 28,
      fontFamily: 'serif',
      fontWeight: 'normal',
      color: '#333333',
      position: 'top',
      alignment: 'center'
    });
  }

  if (parsed.quote) {
    elements.push({
      text: `"${parsed.quote}"`,
      type: 'quote',
      fontSize: 24,
      fontFamily: 'serif',
      fontWeight: 'italic',
      color: '#2a2a2a',
      position: 'bottom',
      alignment: 'center'
    });
  }

  if (parsed.publisher) {
    elements.push({
      text: parsed.publisher.toUpperCase(),
      type: 'publisher',
      fontSize: 18,
      fontFamily: 'serif',
      fontWeight: 'normal',
      color: '#444444',
      position: 'bottom',
      alignment: 'center'
    });
  }

  return elements;
}

export function getVisualOnlyPrompt(prompt: string): string {
  const parsed = parseBookCoverPrompt(prompt);
  return parsed.visualPrompt + ". Do NOT include any text, letters, words, or writing in the image. Visual elements only.";
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export async function overlayTextOnImage(
  imageBase64: string,
  elements: TextElement[],
  mimeType: string = 'image/png'
): Promise<string> {
  const imageBuffer = Buffer.from(imageBase64, 'base64');
  const image = await loadImage(imageBuffer);
  
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0);

  const padding = 40;
  const maxWidth = image.width - (padding * 2);

  const topElements = elements.filter(e => e.position === 'top');
  const bottomElements = elements.filter(e => e.position === 'bottom');
  const centerElements = elements.filter(e => e.position === 'center');

  let topY = padding + 60;
  for (const element of topElements) {
    const fontSize = element.fontSize || 48;
    const fontWeight = element.fontWeight === 'bold' ? 'bold' : 
                       element.fontWeight === 'italic' ? 'italic' : 'normal';
    
    ctx.font = `${fontWeight} ${fontSize}px serif`;
    ctx.fillStyle = element.color || '#000000';
    ctx.textAlign = (element.alignment || 'center') as CanvasTextAlign;
    
    const lines = wrapText(ctx, element.text, maxWidth);
    const lineHeight = fontSize * 1.2;
    
    for (const line of lines) {
      const x = element.alignment === 'left' ? padding :
                element.alignment === 'right' ? image.width - padding :
                image.width / 2;
      
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      ctx.fillText(line, x, topY);
      topY += lineHeight;
    }
    topY += 10;
  }

  let bottomY = image.height - padding - 40;
  for (const element of [...bottomElements].reverse()) {
    const fontSize = element.fontSize || 24;
    const fontWeight = element.fontWeight === 'bold' ? 'bold' : 
                       element.fontWeight === 'italic' ? 'italic' : 'normal';
    
    ctx.font = `${fontWeight} ${fontSize}px serif`;
    ctx.fillStyle = element.color || '#000000';
    ctx.textAlign = (element.alignment || 'center') as CanvasTextAlign;
    
    const lines = wrapText(ctx, element.text, maxWidth);
    const lineHeight = fontSize * 1.2;
    
    const totalHeight = lines.length * lineHeight;
    bottomY -= totalHeight;
    
    let currentY = bottomY;
    for (const line of lines) {
      const x = element.alignment === 'left' ? padding :
                element.alignment === 'right' ? image.width - padding :
                image.width / 2;
      
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 4;
      
      ctx.fillText(line, x, currentY);
      currentY += lineHeight;
    }
    bottomY -= 20;
  }

  const centerY = image.height / 2;
  let currentCenterY = centerY - (centerElements.length * 30);
  for (const element of centerElements) {
    const fontSize = element.fontSize || 36;
    const fontWeight = element.fontWeight === 'bold' ? 'bold' : 
                       element.fontWeight === 'italic' ? 'italic' : 'normal';
    
    ctx.font = `${fontWeight} ${fontSize}px serif`;
    ctx.fillStyle = element.color || '#000000';
    ctx.textAlign = (element.alignment || 'center') as CanvasTextAlign;
    
    const lines = wrapText(ctx, element.text, maxWidth);
    const lineHeight = fontSize * 1.2;
    
    for (const line of lines) {
      ctx.fillText(line, image.width / 2, currentCenterY);
      currentCenterY += lineHeight;
    }
    currentCenterY += 10;
  }

  const outputBuffer = canvas.toBuffer('image/png');
  return outputBuffer.toString('base64');
}

export function isTextHeavyPrompt(prompt: string): boolean {
  const quotedTextCount = (prompt.match(/['"][^'"]+['"]/g) || []).length;
  const hasTitle = /(?:title|book cover|called|titled)/i.test(prompt);
  const hasAuthor = /(?:author|by\s+[A-Z])/i.test(prompt);
  const hasQuote = /(?:quote|saying|text)/i.test(prompt);
  const hasPublisher = /(?:publisher|press|publishing)/i.test(prompt);
  
  const textIndicators = [hasTitle, hasAuthor, hasQuote, hasPublisher].filter(Boolean).length;
  
  return quotedTextCount >= 2 || textIndicators >= 2;
}

export async function generateWithTextOverlay(
  generateVisualFn: (prompt: string) => Promise<{ base64: string; mimeType: string }>,
  originalPrompt: string
): Promise<{ base64: string; mimeType: string; textOverlaid: boolean }> {
  if (!isTextHeavyPrompt(originalPrompt)) {
    const result = await generateVisualFn(originalPrompt);
    return { ...result, textOverlaid: false };
  }

  const visualPrompt = getVisualOnlyPrompt(originalPrompt);
  console.log("[TextOverlay] Generating visual-only image...");
  console.log("[TextOverlay] Visual prompt:", visualPrompt);
  
  const visualResult = await generateVisualFn(visualPrompt);

  const textElements = extractTextFromPrompt(originalPrompt);
  console.log("[TextOverlay] Extracted text elements:", textElements.map(e => ({ type: e.type, text: e.text })));

  if (textElements.length === 0) {
    return { ...visualResult, textOverlaid: false };
  }

  console.log("[TextOverlay] Overlaying text on image...");
  const overlaidBase64 = await overlayTextOnImage(
    visualResult.base64,
    textElements,
    visualResult.mimeType
  );

  return {
    base64: overlaidBase64,
    mimeType: 'image/png',
    textOverlaid: true
  };
}
