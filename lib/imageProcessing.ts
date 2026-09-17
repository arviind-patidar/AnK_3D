export interface ImageSize {
  width: number;
  height: number;
}

export const TARGET_SHEET_DIMENSIONS = {
  width: 1080,
  height: 1920,
  aspectRatio: 9 / 16,
};

export function calculateDimensionSqFt(dimStr: string): number | 'NR' {
  if (!dimStr || dimStr.toUpperCase() === 'NR') return 'NR';
  
  // Format: 13'7" × 17'4" or 13'7" x 17'4"
  const regex = /(\d+)\s*['’]\s*(\d+)?\s*["”]?\s*[xX×]\s*(\d+)\s*['’]\s*(\d+)?\s*["”]?/;
  const match = dimStr.match(regex);
  if (!match) return 'NR';

  const wFeet = parseInt(match[1] || '0', 10);
  const wInches = parseInt(match[2] || '0', 10);
  const hFeet = parseInt(match[3] || '0', 10);
  const hInches = parseInt(match[4] || '0', 10);

  const widthInFeet = wFeet + wInches / 12;
  const heightInFeet = hFeet + hInches / 12;

  const areaExact = widthInFeet * heightInFeet;
  return Math.round(areaExact);
}

export function formatSqFtDisplay(val: number | 'NR'): string {
  if (val === 'NR' || val === undefined || val === null) return 'NR';
  return val.toLocaleString('en-US');
}

export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
