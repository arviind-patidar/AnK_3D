export type Point2D = [number, number]; // Normalized [x, y] coordinates (0.0 to 1.0)

export type RoomType =
  | 'foyer'
  | 'living'
  | 'dining'
  | 'kitchen'
  | 'utility'
  | 'maid'
  | 'toilet'
  | 'powder'
  | 'stair'
  | 'lobby'
  | 'bedroom'
  | 'dress'
  | 'balcony'
  | 'standing_balcony'
  | 'void'
  | 'other';

export interface Door {
  id: string;
  position: Point2D;
  wallIndex?: number;
  swingDirection?: 'inward' | 'outward' | 'sliding' | 'bi-fold' | 'unclear';
  width?: number;
  confidenceScore?: number;
}

export interface Window {
  id: string;
  position: Point2D;
  width?: number;
  type?: 'full_height' | 'standard' | 'bay';
  confidenceScore?: number;
}

export interface FurnitureAnchor {
  id: string;
  type: string; // 'bed', 'sofa', 'dining_table', 'counter', 'wardrobe', 'sanitary', 'tv_unit', 'lounger'
  position: Point2D;
  orientation?: string; // 'north', 'south', 'east', 'west' or degrees
  label?: string;
  confidenceScore?: number;
}

export interface Stair {
  id: string;
  polygon: Point2D[];
  direction: 'up' | 'down' | 'unclear';
  risesTowards?: string; // e.g. "upper-left", "upper-right"
  flightType?: 'straight' | 'u-shaped' | 'l-shaped' | 'spiral';
  confidenceScore?: number;
}

export interface VoidSpace {
  id: string;
  polygon: Point2D[];
  label: string; // e.g. "VB" (Void Below), "OTS" (Open To Sky)
  description?: string;
  confidenceScore?: number;
}

export interface Room {
  id: string;
  code: string; // Standardized codes e.g. F, LR, DIN, KIT, UT, MR, MT, PR, ST, BR1..BR5, D1..D5, T1..T5, B1..B5, SB, VB
  name: string; // e.g. "Formal Living", "Primary Bedroom", "Dining"
  type: RoomType;
  polygon: Point2D[];
  wallThicknessEstimate?: number; // relative fraction
  doors: Door[];
  windows: Window[];
  furniture: FurnitureAnchor[];
  dimensions: string; // Readable string e.g. "25'10\" × 14'0\"" or "NR" / "REVIEW_REQUIRED"
  calculatedSqFt: number | 'NR';
  isCarpetArea: false; // Always false according to spec: "Room areas are dimension-derived; not RERA carpet area."
  floorKey: 'lower' | 'upper' | 'single' | string;
  confidenceScore?: number; // 0.0 - 1.0
  status?: 'APPROVED' | 'REVIEW_REQUIRED' | 'NR';
}

export interface AmbiguityItem {
  id: string;
  floorKey: string;
  regionPolygon?: Point2D[];
  type:
    | 'entrance'
    | 'stair_direction'
    | 'floor_connection'
    | 'room_boundary'
    | 'unreadable_dimension'
    | 'furniture';
  question: string;
  options?: string[];
  resolved: boolean;
  userAnswer?: string;
}

export interface FloorData {
  floorKey: string; // 'lower' | 'upper' | 'single'
  floorName: string; // 'Lower Floor' | 'Upper Floor' | 'Main Floor'
  rooms: Room[];
  stairs: Stair[];
  voids: VoidSpace[];
  entrances: Point2D[];
  floorConnections: string[];
  sourceImageUrl?: string;
  renderImageUrl?: string;
}

export interface ProjectMetadata {
  propertyName: string; // e.g. "Brigade Insignia"
  layoutType: string; // e.g. "5 BHK Duplex – Type L1"
  superBuiltUpAreaSqFt?: number; // e.g. 5827
  reraCarpetAreaSqFt?: number; // e.g. 3582.26
  balconyCarpetAreaSqFt?: number; // e.g. 681.36
  numFloors: number; // 1 or 2
  builder?: string;
  towerBlock?: string;
  floorNumber?: string;
  orientation?: string;
  reference3DImageUrl?: string;
  logoOverrideUrl?: string;
}

export interface FloorPlanJSON {
  projectId: string;
  metadata: ProjectMetadata;
  floors: {
    [floorKey: string]: FloorData;
  };
  analysisTimestamp: string;
  confidenceScore: number;
  ambiguities: AmbiguityItem[];
  isApprovedByUsers?: boolean;
}

export interface ValidationItem {
  key: keyof ValidationResult;
  label: string;
  passed: boolean;
  details: string;
}

export interface ValidationResult {
  room_count_match: boolean;
  adjacency_match: boolean;
  door_match: boolean;
  window_match: boolean;
  balcony_match: boolean;
  stair_match: boolean;
  void_match: boolean;
  labels_match: boolean;
  dimensions_match: boolean;
  passed: boolean;
  score: number; // 0 - 100%
  breakdown: ValidationItem[];
}

export type ProcessingState =
  | 'idle'
  | 'uploading'
  | 'analysing'
  | 'extracting_geometry'
  | 'checking_plan'
  | 'needs_confirmation'
  | 'generating_lower_floor'
  | 'generating_upper_floor'
  | 'validating'
  | 'composing'
  | 'completed'
  | 'failed';

export interface PipelineStep {
  id: ProcessingState;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'warning' | 'failed';
  message?: string;
}
