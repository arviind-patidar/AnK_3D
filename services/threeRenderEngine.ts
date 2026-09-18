import * as THREE from 'three';
import { FloorData, Room } from '@/lib/planSchema';

export interface ThreeRenderOptions {
  width?: number; // Target PNG resolution e.g. 2048
  height?: number; // Target PNG resolution e.g. 1536
}

export class ThreeRenderEngine {
  private width: number;
  private height: number;

  constructor(options: ThreeRenderOptions = {}) {
    this.width = options.width || 1600;
    this.height = options.height || 1200;
  }

  /**
   * Generates a luxury 3D Three.js architectural dollhouse scene matching Image 2 target,
   * auto-fits top-down orthographic cutaway camera, overlays room code badges directly on top of 3D render,
   * and exports high-res PNG data URL.
   */
  public async renderFloorToPNG(floorData: FloorData): Promise<{
    pngDataUrl: string;
    roomCentroids: { code: string; screenX: number; screenY: number }[];
  }> {
    // 1. Create Canvas & WebGL Renderer
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true,
    });
    renderer.setSize(this.width, this.height);
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // 2. Create Scene & Warm Background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FAF8F5');

    // 3. Materials Registry (Luxury Real-Estate Architectural Palette matching Image 2 target)
    const wallInnerMat = new THREE.MeshStandardMaterial({
      color: 0xfaf9f6, // Crisp architectural alabaster
      roughness: 0.7,
    });
    const wallCapMat = new THREE.MeshStandardMaterial({
      color: 0x2c3539, // Dark slate charcoal top wall cap
      roughness: 0.35,
    });
    const woodFloorMat = new THREE.MeshStandardMaterial({
      color: 0xc89d66, // Warm Honey Oak Hardwood
      roughness: 0.28,
      metalness: 0.05,
    });
    const tileFloorMat = new THREE.MeshStandardMaterial({
      color: 0xf3efe6, // Light Polish Porcelain / Marble
      roughness: 0.15,
      metalness: 0.02,
    });
    const bathTileFloorMat = new THREE.MeshStandardMaterial({
      color: 0xe8e4dc, // Soft white ceramic tile
      roughness: 0.2,
    });
    const balconyFloorMat = new THREE.MeshStandardMaterial({
      color: 0x7a5230, // Teak Outdoor Decking Wood
      roughness: 0.45,
    });
    const plantFoliageMat = new THREE.MeshStandardMaterial({
      color: 0x1e5631, // Lush Emerald Green Foliage
      roughness: 0.75,
    });
    const plantPotMat = new THREE.MeshStandardMaterial({
      color: 0x3d4144, // Charcoal Planter Box
      roughness: 0.5,
    });
    const furnitureWoodMat = new THREE.MeshStandardMaterial({
      color: 0x4a3525, // Rich Warm Walnut
      roughness: 0.4,
    });
    const furnitureFabricMat = new THREE.MeshStandardMaterial({
      color: 0xeae6df, // Soft Linen Cream Upholstery
      roughness: 0.75,
    });
    const duvetMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Crisp Hotel White Duvet
      roughness: 0.85,
    });
    const pillowMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.8,
    });
    const accentBrassMat = new THREE.MeshStandardMaterial({
      color: 0xb88e52, // Antique Brass
      metalness: 0.8,
      roughness: 0.2,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x90caf9,
      transparent: true,
      opacity: 0.4,
      roughness: 0.08,
      transmission: 0.9,
    });

    // Group to hold all 3D floor objects
    const floorGroup = new THREE.Group();
    scene.add(floorGroup);

    // Coordinate Mapping: Normalized [0..1] -> 3D Space (X: [-14..14], Z: [-12..12])
    const mapTo3D = (px: number, py: number) => {
      const x = (px - 0.5) * 28;
      const z = (py - 0.5) * 24;
      return { x, z };
    };

    const centroid3DPositions: { code: string; x: number; z: number }[] = [];

    // 4. Build 3D Floor Slabs & Extruded Cutaway Walls
    floorData.rooms.forEach((room) => {
      if (!room.polygon || room.polygon.length < 3) return;

      const shape = new THREE.Shape();
      room.polygon.forEach(([px, py], idx) => {
        const pt = mapTo3D(px, py);
        if (idx === 0) shape.moveTo(pt.x, -pt.z);
        else shape.lineTo(pt.x, -pt.z);
      });

      // Floor Slab
      const floorMat =
        room.type === 'balcony' || room.type === 'standing_balcony'
          ? balconyFloorMat
          : room.type === 'toilet' || room.type === 'powder'
          ? bathTileFloorMat
          : room.type === 'kitchen' || room.type === 'utility'
          ? tileFloorMat
          : woodFloorMat;

      const floorGeo = new THREE.ShapeGeometry(shape);
      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.y = 0;
      floorMesh.receiveShadow = true;
      floorGroup.add(floorMesh);

      // Add Balcony Deck Plank Details & Green Planter Boxes along balcony edge
      if (room.type === 'balcony' || room.type === 'standing_balcony') {
        let bx = 0;
        let bz = 0;
        room.polygon.forEach(([px, py]) => {
          const p3d = mapTo3D(px, py);
          bx += p3d.x;
          bz += p3d.z;
        });
        bx /= room.polygon.length;
        bz /= room.polygon.length;

        // Add Green Balcony Planter Box & Foliage
        const potGeo = new THREE.BoxGeometry(1.6, 0.4, 0.4);
        const potMesh = new THREE.Mesh(potGeo, plantPotMat);
        potMesh.position.set(bx, 0.2, bz - 0.6);
        potMesh.castShadow = true;
        floorGroup.add(potMesh);

        // Lush Leaf Spheres
        [-0.5, 0, 0.5].forEach((lx) => {
          const leafGeo = new THREE.SphereGeometry(0.35, 8, 8);
          const leafMesh = new THREE.Mesh(leafGeo, plantFoliageMat);
          leafMesh.position.set(bx + lx, 0.5, bz - 0.6);
          leafMesh.castShadow = true;
          floorGroup.add(leafMesh);
        });
      }

      // Cutaway Architectural Walls (Height = 1.4m hollow perimeter walls with dark slate top caps)
      if (room.type !== 'void') {
        const wallHeight = 1.4;
        const wallThickness = 0.18;

        for (let i = 0; i < room.polygon.length; i++) {
          const p1 = mapTo3D(room.polygon[i][0], room.polygon[i][1]);
          const nextIdx = (i + 1) % room.polygon.length;
          const p2 = mapTo3D(room.polygon[nextIdx][0], room.polygon[nextIdx][1]);

          const dx = p2.x - p1.x;
          const dz = p2.z - p1.z;
          const len = Math.hypot(dx, dz);
          if (len < 0.05) continue;

          const angle = Math.atan2(dz, dx);
          const midX = (p1.x + p2.x) / 2;
          const midZ = (p1.z + p2.z) / 2;

          const wallSegmentGeo = new THREE.BoxGeometry(len, wallHeight, wallThickness);
          
          // Materials: [px, nx, py, ny, pz, nz] -> Top face (index 2 in Y-up geometry) uses dark slate wallCapMat
          const wallMaterials = [
            wallInnerMat, // +X
            wallInnerMat, // -X
            wallCapMat,   // +Y (Top Cap)
            wallInnerMat, // -Y
            wallInnerMat, // +Z
            wallInnerMat, // -Z
          ];

          const wallMesh = new THREE.Mesh(wallSegmentGeo, wallMaterials);
          wallMesh.position.set(midX, wallHeight / 2, midZ);
          wallMesh.rotation.y = -angle;
          wallMesh.castShadow = true;
          wallMesh.receiveShadow = true;
          floorGroup.add(wallMesh);
        }
      }

      // Calculate Centroid in 3D Space
      let cx = 0;
      let cz = 0;
      room.polygon.forEach(([px, py]) => {
        const p3d = mapTo3D(px, py);
        cx += p3d.x;
        cz += p3d.z;
      });
      cx /= room.polygon.length;
      cz /= room.polygon.length;

      if (room.code && room.type !== 'void') {
        centroid3DPositions.push({ code: room.code, x: cx, z: cz });
      }

      // 5. Build High-Fidelity 3D Furniture Models
      room.furniture.forEach((f) => {
        const fPos = mapTo3D(f.position[0], f.position[1]);

        if (f.type === 'bed') {
          const bedGroup = new THREE.Group();

          // Wooden Headboard
          const hbGeo = new THREE.BoxGeometry(2.2, 1.2, 0.15);
          const hbMesh = new THREE.Mesh(hbGeo, furnitureWoodMat);
          hbMesh.position.set(0, 0.6, -1.1);
          hbMesh.castShadow = true;
          bedGroup.add(hbMesh);

          // Base Frame
          const baseGeo = new THREE.BoxGeometry(2.0, 0.3, 2.1);
          const baseMesh = new THREE.Mesh(baseGeo, furnitureWoodMat);
          baseMesh.position.set(0, 0.15, 0.0);
          baseMesh.castShadow = true;
          bedGroup.add(baseMesh);

          // Crisp White Duvet / Mattress
          const matGeo = new THREE.BoxGeometry(1.95, 0.35, 2.0);
          const matMesh = new THREE.Mesh(matGeo, duvetMat);
          matMesh.position.set(0, 0.35, 0.0);
          matMesh.castShadow = true;
          bedGroup.add(matMesh);

          // Grey Bed Runner
          const runnerGeo = new THREE.BoxGeometry(1.97, 0.02, 0.6);
          const runnerMesh = new THREE.Mesh(runnerGeo, furnitureWoodMat);
          runnerMesh.position.set(0, 0.53, 0.6);
          bedGroup.add(runnerMesh);

          // Double Pillows
          const pilGeo = new THREE.BoxGeometry(0.75, 0.14, 0.45);
          [-0.5, 0.5].forEach((px) => {
            const pillow = new THREE.Mesh(pilGeo, pillowMat);
            pillow.position.set(px, 0.55, -0.7);
            pillow.castShadow = true;
            bedGroup.add(pillow);
          });

          // Nightstands with Brass Lamps
          const nsGeo = new THREE.BoxGeometry(0.55, 0.5, 0.5);
          [-1.35, 1.35].forEach((nx) => {
            const ns = new THREE.Mesh(nsGeo, furnitureWoodMat);
            ns.position.set(nx, 0.25, -0.9);
            ns.castShadow = true;
            bedGroup.add(ns);

            const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.3), accentBrassMat);
            lampBase.position.set(nx, 0.65, -0.9);
            bedGroup.add(lampBase);

            const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 0.25), furnitureFabricMat);
            shade.position.set(nx, 0.85, -0.9);
            bedGroup.add(shade);
          });

          bedGroup.position.set(fPos.x, 0, fPos.z);
          floorGroup.add(bedGroup);
        } else if (f.type === 'sofa') {
          const sofaGroup = new THREE.Group();

          // Plush Area Rug under sofa
          const rugGeo = new THREE.BoxGeometry(3.2, 0.02, 2.6);
          const rugMesh = new THREE.Mesh(rugGeo, furnitureFabricMat);
          rugMesh.position.set(0, 0.01, 0.5);
          sofaGroup.add(rugMesh);

          // Main Sectional Base
          const sbGeo = new THREE.BoxGeometry(2.6, 0.45, 0.9);
          const sbMesh = new THREE.Mesh(sbGeo, furnitureFabricMat);
          sbMesh.position.set(0, 0.225, 0);
          sbMesh.castShadow = true;
          sofaGroup.add(sbMesh);

          // Backrest
          const brGeo = new THREE.BoxGeometry(2.6, 0.45, 0.25);
          const brMesh = new THREE.Mesh(brGeo, furnitureFabricMat);
          brMesh.position.set(0, 0.65, -0.325);
          brMesh.castShadow = true;
          sofaGroup.add(brMesh);

          // Chaise Extension
          const chGeo = new THREE.BoxGeometry(0.95, 0.45, 1.4);
          const chMesh = new THREE.Mesh(chGeo, furnitureFabricMat);
          chMesh.position.set(0.825, 0.225, 0.85);
          chMesh.castShadow = true;
          sofaGroup.add(chMesh);

          // Wood Coffee Table
          const ctGeo = new THREE.BoxGeometry(1.3, 0.35, 0.75);
          const ctMesh = new THREE.Mesh(ctGeo, furnitureWoodMat);
          ctMesh.position.set(-0.2, 0.175, 1.0);
          ctMesh.castShadow = true;
          sofaGroup.add(ctMesh);

          sofaGroup.position.set(fPos.x, 0, fPos.z);
          floorGroup.add(sofaGroup);
        } else if (f.type === 'dining_table') {
          const dtGroup = new THREE.Group();

          // Polished Wood Table Top
          const ttGeo = new THREE.BoxGeometry(2.4, 0.1, 1.2);
          const ttMesh = new THREE.Mesh(ttGeo, furnitureWoodMat);
          ttMesh.position.set(0, 0.75, 0);
          ttMesh.castShadow = true;
          dtGroup.add(ttMesh);

          // Brass Table Legs
          const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.7);
          [-1.0, 1.0].forEach((lx) => {
            [-0.45, 0.45].forEach((lz) => {
              const leg = new THREE.Mesh(legGeo, accentBrassMat);
              leg.position.set(lx, 0.35, lz);
              leg.castShadow = true;
              dtGroup.add(leg);
            });
          });

          // 6 Upholstered Chairs
          const chairGeo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
          [-0.8, 0, 0.8].forEach((cx) => {
            [-0.8, 0.8].forEach((cz) => {
              const chair = new THREE.Mesh(chairGeo, furnitureFabricMat);
              chair.position.set(cx, 0.225, cz);
              chair.castShadow = true;
              dtGroup.add(chair);
            });
          });

          dtGroup.position.set(fPos.x, 0, fPos.z);
          floorGroup.add(dtGroup);
        } else if (f.type === 'counter') {
          const counterGeo = new THREE.BoxGeometry(2.4, 0.85, 0.7);
          const counter = new THREE.Mesh(counterGeo, tileFloorMat);
          counter.position.set(fPos.x, 0.425, fPos.z);
          counter.castShadow = true;
          floorGroup.add(counter);
        } else if (f.type === 'sanitary') {
          const bathGroup = new THREE.Group();

          // Vanity Counter
          const vGeo = new THREE.BoxGeometry(1.5, 0.85, 0.6);
          const vMesh = new THREE.Mesh(vGeo, bathTileFloorMat);
          vMesh.position.set(0, 0.425, 0);
          vMesh.castShadow = true;
          bathGroup.add(vMesh);

          // Glass Shower Cubicle with Chrome Trim
          const sGeo = new THREE.BoxGeometry(1.2, 1.8, 1.2);
          const sMesh = new THREE.Mesh(sGeo, glassMat);
          sMesh.position.set(1.4, 0.9, 0);
          bathGroup.add(sMesh);

          bathGroup.position.set(fPos.x, 0, fPos.z);
          floorGroup.add(bathGroup);
        } else if (f.type === 'lounger') {
          const deckGroup = new THREE.Group();
          const chair = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.7), furnitureWoodMat);
          chair.position.set(0, 0.2, 0);
          chair.castShadow = true;
          deckGroup.add(chair);
          deckGroup.position.set(fPos.x, 0, fPos.z);
          floorGroup.add(deckGroup);
        }
      });
    });

    // 6. Build Staircase Flights
    floorData.stairs.forEach((stair) => {
      if (!stair.polygon || stair.polygon.length < 3) return;

      const p1 = mapTo3D(stair.polygon[0][0], stair.polygon[0][1]);
      const p2 = mapTo3D(stair.polygon[2][0], stair.polygon[2][1]);

      const stepsCount = 10;
      for (let s = 0; s < stepsCount; s++) {
        const stepRatio = s / stepsCount;
        const stepX = p1.x + (p2.x - p1.x) * stepRatio;
        const stepZ = p1.z + (p2.z - p1.z) * stepRatio;
        const stepY = (s / stepsCount) * 1.4;

        const stepGeo = new THREE.BoxGeometry(1.3, 0.14, 0.38);
        const stepMesh = new THREE.Mesh(stepGeo, woodFloorMat);
        stepMesh.position.set(stepX, stepY + 0.07, stepZ);
        stepMesh.castShadow = true;
        floorGroup.add(stepMesh);
      }
    });

    // 7. Ground Shadow Plane
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0xfaf8f5, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // 8. Architectural Lighting (Warm Sunlight & Sky Light)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2ded4, 0.75);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffdf5, 1.6);
    dirLight.position.set(25, 45, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    const shadowD = 26;
    dirLight.shadow.camera.left = -shadowD;
    dirLight.shadow.camera.right = shadowD;
    dirLight.shadow.camera.top = shadowD;
    dirLight.shadow.camera.bottom = -shadowD;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // 9. TOP-DOWN CUTAWAY ORTHOGRAPHIC CAMERA (Matching Image 2 Angle & Framing)
    const bbox = new THREE.Box3().setFromObject(floorGroup);
    const bboxSize = new THREE.Vector3();
    const bboxCenter = new THREE.Vector3();
    bbox.getSize(bboxSize);
    bbox.getCenter(bboxCenter);

    const aspect = this.width / this.height;
    // Calculate tight orthographic bounds from model bounding size (88-92% occupancy)
    const orthoH = (bboxSize.z / 2) * 1.15;
    const orthoW = Math.max((bboxSize.x / 2) * 1.15, orthoH * aspect);

    const camera = new THREE.OrthographicCamera(
      -orthoW,
      orthoW,
      orthoH,
      -orthoH,
      1,
      1000
    );

    // Position camera at 60-degree top-down cutaway angle looking directly at model center
    camera.position.set(bboxCenter.x, bboxCenter.y + 38, bboxCenter.z + 22);
    camera.lookAt(bboxCenter.x, 0, bboxCenter.z);

    // 10. Render 3D Scene to WebGL Canvas
    renderer.render(scene, camera);

    // 11. OVERLAY ROOM CODE BADGES (F, LR, DIN, KIT, UT, MR, MT, PR, ST, ML, BR1, D1, T1, BR2, etc.) DIRECTLY ON TOP OF CANVAS
    const ctx = canvas.getContext('2d');
    const roomCentroids: { code: string; screenX: number; screenY: number }[] = [];

    if (ctx) {
      centroid3DPositions.forEach((cp) => {
        // Project 3D coordinate to screen coordinates
        const v = new THREE.Vector3(cp.x, 1.2, cp.z);
        v.project(camera);

        const screenX = ((v.x + 1) * this.width) / 2;
        const screenY = ((-v.y + 1) * this.height) / 2;

        roomCentroids.push({ code: cp.code, screenX, screenY });

        // Draw Deep Navy Pill Badge with Gold Border & White Bold Text matching Image 2!
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 3;

        const badgeWidth = Math.max(38, cp.code.length * 11 + 16);
        const badgeHeight = 24;
        const bx = screenX - badgeWidth / 2;
        const by = screenY - badgeHeight / 2;
        const radius = 5;

        // Pill background
        ctx.beginPath();
        ctx.roundRect(bx, by, badgeWidth, badgeHeight, radius);
        ctx.fillStyle = '#1F2B38'; // Deep Navy
        ctx.fill();

        // Gold border
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#B88E52'; // Antique Brass
        ctx.stroke();

        // Room Code Text
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cp.code, screenX, screenY + 1);
        ctx.restore();
      });
    }

    // 12. Extract High-Res PNG Data URL
    const pngDataUrl = canvas.toDataURL('image/png');
    renderer.dispose();

    return {
      pngDataUrl,
      roomCentroids,
    };
  }
}

