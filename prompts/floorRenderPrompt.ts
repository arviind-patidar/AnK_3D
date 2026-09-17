export const ARCHITECTURAL_DOLLHOUSE_RENDER_TEMPLATE = `
Create a premium conceptual axonometric architectural dollhouse visualization of the supplied residential floor plan.

The supplied floor plan is authoritative.

Preserve the exact:
- footprint
- room boundaries
- room adjacency
- doors
- openings
- windows
- balconies
- terraces
- stairs
- voids
- entrances
- circulation

Do not add or remove rooms.
Do not modify the architectural topology.

Translate the 2D plan into a clean furnished 3D architectural visualization.

Use restrained contemporary luxury interiors:
- warm oak flooring
- neutral warm walls
- light stone accents
- soft beige upholstery
- subtle minimal greenery
- premium residential furniture
- realistic soft architectural lighting.

Maintain the exact furniture anchors visible in the source plan where readable:
- bed headboard position
- sofa orientation
- dining table placement
- kitchen counter layout
- bathroom fixtures & shower glass
- stair flights

Use an isometric / axonometric cutaway camera showing the entire floor structure clearly from an elevated 45-degree angle.

Show the complete floor as a coherent dollhouse cutaway.

No people.
No text embedded into the render except compact room codes (e.g., LR, DIN, KIT, BR1, ST) placed cleanly inside each room.
No marketing claims.
No fantasy architecture.

This is a conceptual interpretation of the supplied plan.
`;

export function buildFloorRenderPrompt(floorName: string, roomListSummary: string) {
  return `${ARCHITECTURAL_DOLLHOUSE_RENDER_TEMPLATE}

FLOOR SPECIFIC DETAILS:
Target Floor: ${floorName}
Rooms & Codes to include in cutaway:
${roomListSummary}
`;
}
