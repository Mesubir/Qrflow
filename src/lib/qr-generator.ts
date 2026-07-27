import QRCode from "qrcode";

export interface QRStylingOptions {
  primaryColor?: string;
  secondaryColor?: string;
  isGradient?: boolean;
  gradientType?: "linear" | "radial";
  gradientDirection?: "to-right" | "to-bottom" | "diagonal";
  backgroundColor?: string; // hex or "transparent"
  dotStyle?: "square" | "rounded" | "dots";
  eyeOuterStyle?: "square" | "rounded" | "circle";
  eyeInnerStyle?: "square" | "rounded" | "circle" | "diamond";
  logoUrl?: string;
  logoSize?: number; // percentage of QR size, e.g. 0.2 (20%)
  frameStyle?: "none" | "simple" | "phone" | "speech";
  frameText?: string;
  margin?: number; // Quiet zone/margin size around the QR code modules (default: 30)
}

// Check if a cell coordinate is within the Finder Patterns (Eyes)
// The three finder patterns are 7x7 squares located at:
// - Top-Left: [0..6, 0..6]
// - Top-Right: [0..6, size-7..size-1]
// - Bottom-Left: [size-7..size-1, 0..6]
function isFinderPattern(r: number, c: number, size: number): boolean {
  if (r >= 0 && r < 7 && c >= 0 && c < 7) return true; // Top-Left
  if (r >= 0 && r < 7 && c >= size - 7 && c < size) return true; // Top-Right
  if (r >= size - 7 && r < size && c >= 0 && c < 7) return true; // Bottom-Left
  return false;
}

// Check if a cell coordinate is in the center logo area
function isLogoArea(r: number, c: number, size: number, logoRatio: number): boolean {
  if (logoRatio <= 0) return false;
  const border = Math.ceil((size * logoRatio) / 2);
  const center = Math.floor(size / 2);
  return r >= center - border && r <= center + border && c >= center - border && c <= center + border;
}

// Generate stylized SVG path or shapes for QR code
export function generateCustomQrSvg(text: string, options: QRStylingOptions = {}): string {
  // 1. Resolve defaults
  const {
    primaryColor = "#6d28d9", // Purple
    secondaryColor = "#3b82f6", // Blue
    isGradient = false,
    gradientType = "linear",
    gradientDirection = "diagonal",
    backgroundColor = "transparent",
    dotStyle = "square",
    eyeOuterStyle = "square",
    eyeInnerStyle = "square",
    logoUrl = "",
    logoSize = 0.22,
    frameStyle = "none",
    frameText = "SCAN ME",
    margin = 30,
  } = options;

  // 2. Create raw QR modules using 'H' (High) recovery to support center logos
  const qr = QRCode.create(text, { errorCorrectionLevel: "H" });
  const modules = qr.modules;
  const size = modules.size;
  
  // Padding & cell configurations
  const cellSize = 10;
  const qrPadding = typeof margin === "number" ? margin : 30;
  const qrRawSize = size * cellSize;
  
  // Outer frame dimensions
  let width = qrRawSize + qrPadding * 2;
  let height = qrRawSize + qrPadding * 2;
  let qrOffsetY = qrPadding;
  
  // Adjust height if there is a frame with text
  const hasFrame = frameStyle !== "none";
  if (hasFrame) {
    height += 50; // extra bottom padding for frame text
  }

  // 3. Setup gradients and colors
  let defs = "";
  let fillProperty = `fill="${primaryColor}"`;
  
  if (isGradient) {
    const gradId = "qr-gradient";
    fillProperty = `fill="url(#${gradId})"`;
    if (gradientType === "linear") {
      let x1 = "0%", y1 = "0%", x2 = "100%", y2 = "0%";
      if (gradientDirection === "to-bottom") {
        x1 = "0%"; y1 = "0%"; x2 = "0%"; y2 = "100%";
      } else if (gradientDirection === "diagonal") {
        x1 = "0%"; y1 = "0%"; x2 = "100%"; y2 = "100%";
      }
      defs += `
        <linearGradient id="${gradId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
          <stop offset="0%" stop-color="${primaryColor}" />
          <stop offset="100%" stop-color="${secondaryColor}" />
        </linearGradient>`;
    } else {
      defs += `
        <radialGradient id="${gradId}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${primaryColor}" />
          <stop offset="100%" stop-color="${secondaryColor}" />
        </radialGradient>`;
    }
  }

  // Define shadow filter for premium styling
  defs += `
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.08"/>
    </filter>`;

  // 4. Generate dot paths
  let dotsPath = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (modules.get(r, c)) {
        // Skip finder patterns and center logo area
        if (isFinderPattern(r, c, size)) continue;
        if (logoUrl && isLogoArea(r, c, size, logoSize)) continue;

        const x = qrPadding + c * cellSize;
        const y = qrOffsetY + r * cellSize;

        if (dotStyle === "rounded") {
          const radius = cellSize / 2;
          dotsPath += `M ${x + radius} ${y} A ${radius} ${radius} 0 1 1 ${x + radius - 0.01} ${y} Z `;
        } else if (dotStyle === "dots") {
          const radius = cellSize / 3;
          const cx = x + cellSize / 2;
          const cy = y + cellSize / 2;
          dotsPath += `M ${cx + radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx + radius - 0.01} ${cy} Z `;
        } else {
          // Default: Square
          dotsPath += `M ${x} ${y} h ${cellSize} v ${cellSize} h -${cellSize} Z `;
        }
      }
    }
  }

  // 5. Generate Eye Custom Styles
  const drawEye = (x: number, y: number) => {
    let eyePath = "";
    
    // Outer Eye (7x7 module grid = 70x70 size)
    const outSize = 70;
    const thickness = 10;
    
    if (eyeOuterStyle === "circle") {
      const r = outSize / 2;
      const cx = x + r;
      const cy = y + r;
      const rInner = r - thickness;
      eyePath += `M ${cx} ${y} A ${r} ${r} 0 1 1 ${cx - 0.01} ${y} M ${cx} ${y + thickness} A ${rInner} ${rInner} 0 1 0 ${cx + 0.01} ${y + thickness} Z `;
    } else if (eyeOuterStyle === "rounded") {
      const r = 16; // Corner radius
      eyePath += `
        M ${x + r} ${y} 
        h ${outSize - 2 * r} 
        a ${r} ${r} 0 0 1 ${r} ${r} 
        v ${outSize - 2 * r} 
        a ${r} ${r} 0 0 1 -${r} ${r} 
        h -${outSize - 2 * r} 
        a ${r} ${r} 0 0 1 -${r} -${r} 
        v -${outSize - 2 * r} 
        a ${r} ${r} 0 0 1 ${r} -${r} Z 
        M ${x + r} ${y + thickness} 
        a ${r - thickness} ${r - thickness} 0 0 0 -${r - thickness} ${r - thickness} 
        v ${outSize - 2 * r} 
        a ${r - thickness} ${r - thickness} 0 0 0 ${r - thickness} ${r - thickness} 
        h ${outSize - 2 * r} 
        a ${r - thickness} ${r - thickness} 0 0 0 ${r - thickness} -${r - thickness} 
        v -${outSize - 2 * r} 
        a ${r - thickness} ${r - thickness} 0 0 0 -${r - thickness} -${r - thickness} Z`;
    } else {
      // Default: Square
      eyePath += `
        M ${x} ${y} h ${outSize} v ${outSize} h -${outSize} Z 
        M ${x + thickness} ${y + thickness} v ${outSize - 2 * thickness} h ${outSize - 2 * thickness} v -${outSize - 2 * thickness} Z`;
    }

    // Inner Eye (3x3 module grid = 30x30 size, centered at offset 20, 20)
    const inSize = 30;
    const ix = x + 20;
    const iy = y + 20;
    
    if (eyeInnerStyle === "circle") {
      const r = inSize / 2;
      eyePath += ` M ${ix + r} ${iy} A ${r} ${r} 0 1 1 ${ix + r - 0.01} ${iy} Z`;
    } else if (eyeInnerStyle === "rounded") {
      const r = 8;
      eyePath += `
        M ${ix + r} ${iy} 
        h ${inSize - 2 * r} 
        a ${r} ${r} 0 0 1 ${r} ${r} 
        v ${inSize - 2 * r} 
        a ${r} ${r} 0 0 1 -${r} ${r} 
        h -${inSize - 2 * r} 
        a ${r} ${r} 0 0 1 -${r} -${r} 
        v -${inSize - 2 * r} 
        a ${r} ${r} 0 0 1 ${r} -${r} Z`;
    } else if (eyeInnerStyle === "diamond") {
      const r = inSize / 2;
      eyePath += ` M ${ix + r} ${iy} L ${ix + inSize} ${iy + r} L ${ix + r} ${iy + inSize} L ${ix} ${iy + r} Z`;
    } else {
      // Square
      eyePath += ` M ${ix} ${iy} h ${inSize} v ${inSize} h -${inSize} Z`;
    }
    
    return eyePath;
  };

  const eye1 = drawEye(qrPadding, qrOffsetY); // Top-Left
  const eye2 = drawEye(qrPadding + (size - 7) * cellSize, qrOffsetY); // Top-Right
  const eye3 = drawEye(qrPadding, qrOffsetY + (size - 7) * cellSize); // Bottom-Left

  // 6. Draw outer frames if enabled
  let frameMarkup = "";
  if (frameStyle === "simple") {
    frameMarkup = `<rect x="5" y="5" width="${width - 10}" height="${height - 10}" fill="none" stroke="${primaryColor}" stroke-width="4" rx="16"/>`;
  } else if (frameStyle === "phone") {
    frameMarkup = `
      <rect x="5" y="5" width="${width - 10}" height="${height - 10}" fill="none" stroke="${primaryColor}" stroke-width="6" rx="28"/>
      <rect x="${width / 2 - 25}" y="12" width="50" height="6" fill="${primaryColor}" rx="3"/>
      <circle cx="${width / 2}" cy="${height - 25}" r="12" fill="none" stroke="${primaryColor}" stroke-width="3"/>`;
  } else if (frameStyle === "speech") {
    frameMarkup = `
      <path d="M 15 5 h ${width - 30} a 10 10 0 0 1 10 10 v ${height - 70} a 10 10 0 0 1 -10 10 H ${width / 2 + 15} l -15 15 l -15 -15 H 15 a 10 10 0 0 1 -10 -10 v -${height - 70} a 10 10 0 0 1 10 -10 Z" fill="none" stroke="${primaryColor}" stroke-width="4"/>`;
  }

  // Render text for frame if text is provided
  let frameTextMarkup = "";
  if (hasFrame && frameText) {
    const textY = height - 20;
    frameTextMarkup = `<text x="50%" y="${textY}" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="${primaryColor}">${frameText}</text>`;
  }

  // 7. Compose Center Logo
  let logoMarkup = "";
  if (logoUrl) {
    const lSize = qrRawSize * logoSize;
    const lx = qrPadding + (qrRawSize - lSize) / 2;
    const ly = qrOffsetY + (qrRawSize - lSize) / 2;
    const r = lSize * 0.15; // corner radius
    logoMarkup = `
      <!-- Logo Container -->
      <g filter="url(#shadow)">
        <rect x="${lx}" y="${ly}" width="${lSize}" height="${lSize}" rx="${r}" fill="#ffffff" />
        <image href="${logoUrl}" x="${lx + lSize * 0.08}" y="${ly + lSize * 0.08}" width="${lSize * 0.84}" height="${lSize * 0.84}" rx="${r * 0.8}" preserveAspectRatio="xMidYMid slice" />
      </g>
    `;
  }

  // 8. Put everything together into full SVG string
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="background-color: ${backgroundColor};">
    <defs>${defs}</defs>
    
    <!-- Optional Frame -->
    ${frameMarkup}
    
    <!-- Dots Grid -->
    <path d="${dotsPath}" ${fillProperty} />
    
    <!-- Stylized Eyes -->
    <path d="${eye1}" ${fillProperty} />
    <path d="${eye2}" ${fillProperty} />
    <path d="${eye3}" ${fillProperty} />
    
    <!-- Optional Logo -->
    ${logoMarkup}
    
    <!-- Optional Frame Text -->
    ${frameTextMarkup}
  </svg>`;

  return svg;
}
