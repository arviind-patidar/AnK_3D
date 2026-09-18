import { FloorData, Room, Door, Window, Stair, VoidSpace, Point2D } from '@/lib/planSchema';

export interface WallSegment {
  id: string;
  start: Point2D;
  end: Point2D;
  thickness: number;
  isExterior: boolean;
  roomId?: string;
}

export interface ExtractedArchitecturalFeatures {
  walls: WallSegment[];
  doors: Door[];
  windows: Window[];
  stairs: Stair[];
  voids: VoidSpace[];
  balconies: Room[];
}

export class FeatureExtractorService {
  /**
   * Extracts spatial architectural features (walls, openings, stairs, voids) from floor plan data
   */
  public extractFeatures(floorData: FloorData): ExtractedArchitecturalFeatures {
    const walls: WallSegment[] = [];
    const doors: Door[] = [];
    const windows: Window[] = [];
    const balconies: Room[] = [];

    floorData.rooms.forEach((room) => {
      if (room.type === 'balcony' || room.type === 'standing_balcony') {
        balconies.push(room);
      }

      if (room.doors) doors.push(...room.doors);
      if (room.windows) windows.push(...room.windows);

      // Extract wall segment edges from room polygon
      if (room.polygon && room.polygon.length >= 3) {
        for (let i = 0; i < room.polygon.length; i++) {
          const start = room.polygon[i];
          const end = room.polygon[(i + 1) % room.polygon.length];
          walls.push({
            id: `wall_${room.id}_${i}`,
            start,
            end,
            thickness: 0.18,
            isExterior: room.type === 'balcony' || room.type === 'living',
            roomId: room.id,
          });
        }
      }
    });

    return {
      walls,
      doors,
      windows,
      stairs: floorData.stairs || [],
      voids: floorData.voids || [],
      balconies,
    };
  }
}
