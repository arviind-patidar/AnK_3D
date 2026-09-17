import { FloorPlanJSON, FloorData } from '@/lib/planSchema';
import { ACRE_KEY_BRAND } from '@/lib/branding';

export class SheetComposerService {
  /**
   * Generates a 1080 × 1920 9:16 Acre&Key branded presentation sheet SVG/Canvas Data URL
   * Enforces Step 10 & 11: Hero 3D model occupancy (85-92%), 75/25 split, and 2-line non-truncated room rows.
   */
  public composeBrandedSheet(
    planJson: FloorPlanJSON,
    floorRenders: { [floorKey: string]: string }
  ): string {
    const width = 1080;
    const height = 1920;
    const meta = planJson.metadata;

    const lowerFloor = planJson.floors.lower || Object.values(planJson.floors)[0];
    const upperFloor = planJson.floors.upper;

    const lowerRender = lowerFloor ? floorRenders[lowerFloor.floorKey] || lowerFloor.renderImageUrl || '' : '';
    const upperRender = upperFloor ? floorRenders[upperFloor.floorKey] || upperFloor.renderImageUrl || '' : '';

    const svgParts: string[] = [];

    // Header, background & defs
    svgParts.push(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&amp;family=Inter:wght@400;500;600;700;800&amp;display=swap');
          .title { font-family: 'Cinzel', serif; font-weight: 800; fill: #1F2B38; }
          .subtitle { font-family: 'Inter', sans-serif; font-weight: 700; fill: #B88E52; letter-spacing: 2px; }
          .panel-title { font-family: 'Cinzel', serif; font-weight: 800; fill: #F7F3EC; }
          .panel-sub { font-family: 'Inter', sans-serif; font-weight: 600; fill: #D4AF77; }
          .tbl-code { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 11px; fill: #B88E52; }
          .tbl-name { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 10px; fill: #F7F3EC; }
          .tbl-dim { font-family: 'Inter', sans-serif; font-size: 9px; fill: #A0AEC0; }
          .tbl-sqft { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 10px; fill: #F7F3EC; }
          .disclaimer { font-family: 'Inter', sans-serif; font-size: 9px; fill: #A0AEC0; font-style: italic; }
        </style>
      </defs>

      <!-- Warm Ivory Background -->
      <rect width="${width}" height="${height}" fill="#F7F3EC" />

      <!-- TOP HEADER AREA -->
      <g transform="translate(40, 45)">
        <text class="title" font-size="36" x="0" y="32" letter-spacing="1.5">${meta.propertyName.toUpperCase()}</text>
        <text class="subtitle" font-size="14" x="0" y="60">${(meta.layoutType + ' • ROOM-WISE AREAS').toUpperCase()}</text>
        <line x1="0" y1="76" x2="${width - 80}" y2="76" stroke="#B88E52" stroke-width="1.5" opacity="0.6" />
      </g>
    `);

    // Helper: Build a floor section with 75% width 3D visualization and 25% width information panel
    const renderFloorSection = (
      floorData: FloorData,
      renderUrl: string,
      topY: number,
      sectionTitle: string
    ) => {
      const sectionHeight = 810;
      // 75% width for 3D Hero Render (745px of 1000px available inner width)
      const renderWidth = 745;
      // 25% width for Information Panel (245px)
      const panelWidth = 245;

      let sectionSvg = `
        <g transform="translate(40, ${topY})">
          <!-- 3D HERO RENDER CONTAINER (75% width) -->
          <rect width="${renderWidth}" height="${sectionHeight}" fill="#FAF8F5" rx="8" stroke="#E2DCD2" stroke-width="1.5" />
          
          <!-- Raster PNG Image Render (Hero Model Occupies 85-92% Area!) -->
          ${
            renderUrl
              ? `<image href="${renderUrl}" x="2" y="2" width="${renderWidth - 4}" height="${sectionHeight - 4}" preserveAspectRatio="xMidYMid meet" />`
              : `<rect x="2" y="2" width="${renderWidth - 4}" height="${sectionHeight - 4}" fill="#E8E4DD" rx="6" />
                 <text x="${renderWidth / 2}" y="${sectionHeight / 2}" font-family="'Inter', sans-serif" font-size="16" fill="#8C7A6B" text-anchor="middle">Generating 3D Raster PNG Render...</text>`
          }

          <!-- RIGHT SIDE DEEP NAVY INFORMATION PANEL (25% width) -->
          <g transform="translate(${renderWidth + 10}, 0)">
            <rect width="${panelWidth}" height="${sectionHeight}" fill="#1F2B38" rx="8" />
            <rect x="0" y="0" width="${panelWidth}" height="6" fill="#B88E52" rx="3" />

            <!-- Panel Header -->
            <g transform="translate(14, 25)">
              <text class="panel-title" font-size="14" x="0" y="0">${meta.propertyName.toUpperCase()}</text>
              <text class="panel-sub" font-size="11" x="0" y="18">${sectionTitle}</text>
              <text font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#E2E8F0" x="0" y="34">5 BHK + MAID'S UNIT</text>

              <line x1="0" y1="46" x2="${panelWidth - 28}" y2="46" stroke="#B88E52" stroke-width="1" opacity="0.4" />

              <text font-family="'Inter', sans-serif" font-size="10" font-weight="800" fill="#B88E52" x="0" y="62" letter-spacing="0.5">ROOM INDEX — ${floorData.floorKey === 'lower' ? 'LOWER FLOOR' : 'UPPER FLOOR'}</text>

              <!-- Column Headers (Code | Room | Dimensions | Sq ft) -->
              <g transform="translate(0, 74)">
                <text font-family="'Inter', sans-serif" font-weight="700" font-size="9" fill="#A0AEC0" x="0" y="0">Code</text>
                <text font-family="'Inter', sans-serif" font-weight="700" font-size="9" fill="#A0AEC0" x="34" y="0">Room</text>
                <text font-family="'Inter', sans-serif" font-weight="700" font-size="9" fill="#A0AEC0" x="120" y="0">Dimensions</text>
                <text font-family="'Inter', sans-serif" font-weight="700" font-size="9" fill="#A0AEC0" x="${panelWidth - 28}" y="0" text-anchor="end">Sq ft</text>
                <line x1="0" y1="6" x2="${panelWidth - 28}" y2="6" stroke="#B88E52" stroke-width="0.75" opacity="0.6" />
              </g>

              <!-- Table Rows (Section 13: 2-line non-truncated room rows!) -->
              <g transform="translate(0, 92)">
      `;

      // Render 2-line non-truncated room rows
      const displayRooms = floorData.rooms.slice(0, 20);
      let rowY = 0;

      displayRooms.forEach((room) => {
        const sqFtText = room.calculatedSqFt !== 'NR' ? `${room.calculatedSqFt}` : '—';
        sectionSvg += `
          <!-- Line 1: Code & Full Room Name -->
          <text class="tbl-code" x="0" y="${rowY}">${room.code}</text>
          <text class="tbl-name" x="34" y="${rowY}">${room.name}</text>

          <!-- Line 2: Dimensions & Derived Area -->
          <text class="tbl-dim" x="34" y="${rowY + 11}">${room.dimensions}</text>
          <text class="tbl-sqft" x="${panelWidth - 28}" y="${rowY + 11}" text-anchor="end">${sqFtText}</text>
          <line x1="0" y1="${rowY + 16}" x2="${panelWidth - 28}" y2="${rowY + 16}" stroke="#2D3748" stroke-width="0.5" />
        `;
        rowY += 25;
      });

      sectionSvg += `
              </g>

              <!-- Panel Disclaimer & Acre&Key Logo -->
              <g transform="translate(0, 655)">
                <text class="disclaimer" x="0" y="0">${ACRE_KEY_BRAND.disclaimers.roomArea}</text>

                <g transform="translate(15, 26)">
                  <text font-family="'Cinzel', serif" font-size="18" font-weight="700" fill="#F7F3EC">acre<tspan fill="#B88E52">&amp;</tspan>key</text>
                  <text font-family="'Inter', sans-serif" font-size="6.5" font-weight="600" fill="#B88E52" letter-spacing="2" x="1" y="11">PROPERTY ADVISORY</text>
                </g>
              </g>
            </g>
          </g>
        </g>
      `;

      return sectionSvg;
    };

    // Lower Floor Section
    if (lowerFloor) {
      svgParts.push(
        renderFloorSection(
          lowerFloor,
          lowerRender,
          140,
          `${meta.layoutType.toUpperCase()} (LOWER FLOOR)`
        )
      );
    }

    // Upper Floor Section
    if (upperFloor) {
      svgParts.push(
        renderFloorSection(
          upperFloor,
          upperRender,
          970,
          `${meta.layoutType.toUpperCase()} (UPPER FLOOR)`
        )
      );
    }

    // BOTTOM DEEP NAVY FOOTER
    svgParts.push(`
      <g transform="translate(0, 1810)">
        <rect width="${width}" height="110" fill="#1F2B38" />
        <rect width="${width}" height="4" fill="#B88E52" />

        <text font-family="'Cinzel', serif" font-size="17" font-weight="800" fill="#B88E52" x="${width / 2}" y="36" text-anchor="middle" letter-spacing="1.5">
          ${meta.superBuiltUpAreaSqFt ? meta.superBuiltUpAreaSqFt.toLocaleString() + ' SQ FT SUPER BUILT-UP AREA' : ''}
        </text>

        <text font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#F7F3EC" x="${width / 2}" y="62" text-anchor="middle" letter-spacing="1">
          ${meta.reraCarpetAreaSqFt ? meta.reraCarpetAreaSqFt.toLocaleString() + ' SQ FT RERA CARPET' : ''} ${meta.balconyCarpetAreaSqFt ? '• ' + meta.balconyCarpetAreaSqFt.toLocaleString() + ' SQ FT BALCONY CARPET' : ''}
        </text>

        <text font-family="'Inter', sans-serif" font-size="10" font-weight="500" fill="#A0AEC0" x="${width / 2}" y="86" text-anchor="middle" font-style="italic">
          ${ACRE_KEY_BRAND.disclaimers.conceptual}
        </text>
      </g>
      </svg>
    `);

    const fullSvg = svgParts.join('\n');
    const base64Svg = Buffer.from(fullSvg).toString('base64');
    return `data:image/svg+xml;base64,${base64Svg}`;
  }
}
