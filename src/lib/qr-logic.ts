import qrcode from "qrcode-generator";

export interface QRConfig {
  foregroundColor: string;
  backgroundColor: string;
  bodyStyle: "squares" | "dots" | "rounded";
  eyeStyle: "square" | "rounded" | "circle";
  gradientType: "none" | "linear" | "radial";
  gradientColor2: string;
  gradientAngle: number;
  logoUrl?: string;
  logoSize?: number; // percentage of QR width (e.g. 15 for 15%)
}

export const defaultConfig: QRConfig = {
  foregroundColor: "#171717",
  backgroundColor: "#ffffff",
  bodyStyle: "squares",
  eyeStyle: "square",
  gradientType: "none",
  gradientColor2: "#0070f3",
  gradientAngle: 45,
};

// Check if cell is in a finder pattern
function isFinderPattern(row: number, col: number, size: number): boolean {
  if (row < 7 && col < 7) return true; // Top-Left
  if (row < 7 && col >= size - 7) return true; // Top-Right
  if (row >= size - 7 && col < 7) return true; // Bottom-Left
  return false;
}

export function generateQRSVG(data: string, config: QRConfig): string {
  // Determine version based on data length (auto-detect)
  const qr = qrcode(0, "M");
  qr.addData(data);
  qr.make();

  const moduleCount = qr.getModuleCount();
  const cellSize = 10;
  const rawSize = moduleCount * cellSize;
  const padding = 20;
  const totalSize = rawSize + padding * 2;

  // Foreground fill representation (solid or gradient)
  let fillStr = config.foregroundColor;
  let defs = "";

  if (config.gradientType === "linear") {
    fillStr = "url(#qr-gradient)";
    const angleRad = (config.gradientAngle * Math.PI) / 180;
    const x1 = Math.round(50 - Math.cos(angleRad) * 50);
    const y1 = Math.round(50 + Math.sin(angleRad) * 50);
    const x2 = Math.round(50 + Math.cos(angleRad) * 50);
    const y2 = Math.round(50 - Math.sin(angleRad) * 50);

    defs = `
      <defs>
        <linearGradient id="qr-gradient" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
          <stop offset="0%" stop-color="${config.foregroundColor}" />
          <stop offset="100%" stop-color="${config.gradientColor2}" />
        </linearGradient>
      </defs>
    `;
  } else if (config.gradientType === "radial") {
    fillStr = "url(#qr-gradient)";
    defs = `
      <defs>
        <radialGradient id="qr-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${config.foregroundColor}" />
          <stop offset="100%" stop-color="${config.gradientColor2}" />
        </radialGradient>
      </defs>
    `;
  }

  // Draw background
  let svgPaths = `<rect width="${totalSize}" height="${totalSize}" fill="${config.backgroundColor}" />`;
  if (defs) {
    svgPaths += defs;
  }

  // Draw body modules (excluding finder patterns and center logo area if logo exists)
  const logoPct = config.logoUrl ? (config.logoSize || 18) / 100 : 0;
  const centerStart = Math.floor(moduleCount * (0.5 - logoPct / 2));
  const centerEnd = Math.ceil(moduleCount * (0.5 + logoPct / 2));

  let bodyPath = "";

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col)) {
        // Skip finder patterns
        if (isFinderPattern(row, col, moduleCount)) continue;

        // Skip logo center quiet zone
        if (config.logoUrl && row >= centerStart && row < centerEnd && col >= centerStart && col < centerEnd) {
          continue;
        }

        const x = padding + col * cellSize;
        const y = padding + row * cellSize;

        if (config.bodyStyle === "dots") {
          bodyPath += `M ${x + cellSize / 2} ${y + cellSize / 2} m -4, 0 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0 `;
        } else if (config.bodyStyle === "rounded") {
          bodyPath += `M ${x + 2} ${y} h ${cellSize - 4} a 2,2 0 0 1 2,2 v ${cellSize - 4} a 2,2 0 0 1 -2,2 h -${cellSize - 4} a 2,2 0 0 1 -2,-2 v -${cellSize - 4} a 2,2 0 0 1 2,-2 z `;
        } else {
          // squares
          bodyPath += `M ${x} ${y} h ${cellSize} v ${cellSize} h -${cellSize} z `;
        }
      }
    }
  }

  if (bodyPath) {
    svgPaths += `<path d="${bodyPath}" fill="${fillStr}" />`;
  }

  // Helper to draw a single customized eye
  const drawEye = (colStart: number, rowStart: number) => {
    const x = padding + colStart * cellSize;
    const y = padding + rowStart * cellSize;
    const eyeSize = 7 * cellSize;

    if (config.eyeStyle === "circle") {
      const cx = x + eyeSize / 2;
      const cy = y + eyeSize / 2;
      // Outer ring
      svgPaths += `<circle cx="${cx}" cy="${cy}" r="${eyeSize / 2 - cellSize / 2}" fill="none" stroke="${fillStr}" stroke-width="${cellSize}" />`;
      // Inner circle
      svgPaths += `<circle cx="${cx}" cy="${cy}" r="${1.5 * cellSize}" fill="${fillStr}" />`;
    } else if (config.eyeStyle === "rounded") {
      // Outer rounded frame
      svgPaths += `
        <rect x="${x + cellSize / 2}" y="${y + cellSize / 2}" width="${eyeSize - cellSize}" height="${eyeSize - cellSize}" 
          rx="${1.5 * cellSize}" ry="${1.5 * cellSize}" fill="none" stroke="${fillStr}" stroke-width="${cellSize}" />
      `;
      // Inner eyeball
      svgPaths += `
        <rect x="${x + 2 * cellSize}" y="${y + 2 * cellSize}" width="${3 * cellSize}" height="${3 * cellSize}" 
          rx="${cellSize}" ry="${cellSize}" fill="${fillStr}" />
      `;
    } else {
      // Classic square eyes
      svgPaths += `
        <path d="M ${x} ${y} h ${eyeSize} v ${eyeSize} h -${eyeSize} z M ${x + cellSize} ${y + cellSize} v ${eyeSize - 2 * cellSize} h ${eyeSize - 2 * cellSize} v -${eyeSize - 2 * cellSize} z" fill="${fillStr}" />
        <rect x="${x + 2 * cellSize}" y="${y + 2 * cellSize}" width="${3 * cellSize}" height="${3 * cellSize}" fill="${fillStr}" />
      `;
    }
  };

  // Draw three finder patterns
  drawEye(0, 0); // Top-Left
  drawEye(moduleCount - 7, 0); // Top-Right
  drawEye(0, moduleCount - 7); // Bottom-Left

  // Draw Central Logo Overlay if present
  if (config.logoUrl) {
    const logoPx = rawSize * logoPct;
    const logoX = padding + (rawSize - logoPx) / 2;
    const logoY = padding + (rawSize - logoPx) / 2;

    // Draw quiet zone background
    svgPaths += `<rect x="${logoX - 4}" y="${logoY - 4}" width="${logoPx + 8}" height="${logoPx + 8}" fill="${config.backgroundColor}" rx="4" />`;
    
    // Draw logo image
    svgPaths += `<image href="${config.logoUrl}" x="${logoX}" y="${logoY}" width="${logoPx}" height="${logoPx}" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" class="w-full h-full">${svgPaths}</svg>`;
}
