import { FloorData, Room, Point2D } from '@/lib/planSchema';

export interface RoomCentroid2D {
  code: string;
  name: string;
  x: number;
  y: number;
}

export class SpatialGraphService {
  /**
   * Calculates normalized 2D centroids for all rooms in a floor layout
   */
  public calculateRoomCentroids(floorData: FloorData): RoomCentroid2D[] {
    const centroids: RoomCentroid2D[] = [];

    floorData.rooms.forEach((room) => {
      if (!room.polygon || room.polygon.length < 3) return;
      let sumX = 0;
      let sumY = 0;
      room.polygon.forEach(([px, py]) => {
        sumX += px;
        sumY += py;
      });
      centroids.push({
        code: room.code,
        name: room.name,
        x: sumX / room.polygon.length,
        y: sumY / room.polygon.length,
      });
    });

    return centroids;
  }

  /**
   * Maps 2D normalized coordinates [0..1] to 3D world space (X: [-14..14], Z: [-12..12])
   */
  public mapTo3DWorld(px: number, py: number): { x: number; z: number } {
    return {
      x: (px - 0.5) * 28,
      z: (py - 0.5) * 24,
    };
  }
}
