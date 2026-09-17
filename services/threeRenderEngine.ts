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
    this.width = options.width || 2048;
    this.height = options.height || 1536;
  }

  /**
   * Generates a premium 3D Three.js architectural dollhouse scene, auto-fits camera, and exports high-res PNG
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
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 2. Create Scene & Warm Neutral Background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FAF8F5');

    // 3. Materials Registry (Premium Neutral Palette)
    const wallInnerMat = new THREE.MeshStandardMaterial({
      color: 0xf7f4ef, // Warm Ivory
      roughness: 0.85,
    });
    const wallCapMat = new THREE.MeshStandardMaterial({
      color: 0xd6cfbf, // Soft warm stone cap
      roughness: 0.6,
    });
    const woodFloorMat = new THREE.MeshStandardMaterial({
      color: 0xc8a882, // Warm Oak
      roughness: 0.35,
      metalness: 0.02,
    });
    const tileFloorMat = new THREE.MeshStandardMaterial({
      color: 0xf3efe8, // Light Porcelain Stone
      roughness: 0.2,
      metalness: 0.01,
    });
    const balconyFloorMat = new THREE.MeshStandardMaterial({
      color: 0xd5cdc0, // Light Exterior Stone
      roughness: 0.7,
    });
    const furnitureWoodMat = new THREE.MeshStandardMaterial({
      color: 0x9b8574, // Natural Warm Walnut/Oak
      roughness: 0.45,
    });
    const furnitureFabricMat = new THREE.MeshStandardMaterial({
      color: 0xe6e0d4, // Soft Beige/Taupe Upholstery
      roughness: 0.85,
    });
    const accentBrassMat = new THREE.MeshStandardMaterial({
      color: 0xb88e52, // Antique Brass
      metalness: 0.65,
      roughness: 0.3,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      transmission: 0.9,
    });

    // Group to hold all 3D floor objects
    const floorGroup = new THREE.Group();
    scene.add(floorGroup);

    // Coordinate Mapping: Normalized [0..1] -> 3D Space (X: [-12..12], Z: [-10..10])
    const mapTo3D = (px: number, py: number) => {
      const x = (px - 0.5) * 24;
      const z = (py - 0.5) * 20;
      return { x, z };
    };

    const roomCentroids: { code: string; screenX: number; screenY: number }[] = [];

    // 4. Build 3D Floor Slabs & Extruded Walls
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
          : room.type === 'toilet' || room.type === 'kitchen' || room.type === 'powder'
          ? tileFloorMat
          : woodFloorMat;

      const floorGeo = new THREE.ShapeGeometry(shape);
      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.y = 0;
      floorMesh.receiveShadow = true;
      floorGroup.add(floorMesh);

      // Cutaway Walls (Height = 1.4m for optimal interior visibility)
      if (room.type !== 'void') {
        const wallHeight = 1.4;
        const extrudeSettings = {
          steps: 1,
          depth: wallHeight,
          bevelEnabled: true,
          bevelThickness: 0.04,
          bevelSize: 0.04,
          bevelSegments: 2,
        };

        const wallGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const wallMesh = new THREE.Mesh(wallGeo, [wallInnerMat, wallCapMat]);
        wallMesh.rotation.x = -Math.PI / 2;
        wallMesh.position.y = 0;
        wallMesh.castShadow = true;
        wallMesh.receiveShadow = true;
        floorGroup.add(wallMesh);
      }

      // Calculate Centroid
      let cx = 0;
      let cz = 0;
      room.polygon.forEach(([px, py]) => {
        const p3d = mapTo3D(px, py);
        cx += p3d.x;
        cz += p3d.z;
      });
      cx /= room.polygon.length;
      cz /= room.polygon.length;

      // 5. Build Recognizable Low-Poly Furniture Compounds
      room.furniture.forEach((f) => {
        const fPos = mapTo3D(f.position[0], f.position[1]);

        if (f.type === 'bed') {
          const bedGroup = new THREE.Group();
          // Headboard
          const hbGeo = new THREE.BoxGeometry(2.0, 1.2, 0.15);
          const hbMesh = new THREE.Mesh(hbGeo, furnitureWoodMat);
          hbMesh.position.set(0, 0.6, -1.0);
          hbMesh.castShadow = true;
          bedGroup.add(hbMesh);

          // Mattress & Duvet
          const matGeo = new THREE.BoxGeometry(1.9, 0.35, 2.0);
          const matMesh = new THREE.Mesh(matGeo, furnitureFabricMat);
          matMesh.position.set(0, 0.25, 0.0);
          matMesh.castShadow = true;
          bedGroup.add(matMesh);

          // Pillows
          const pilGeo = new THREE.BoxGeometry(0.7, 0.12, 0.45);
          [-0.5, 0.5].forEach((px) => {
            const pillow = new THREE.Mesh(pilGeo, furnitureFabricMat);
            pillow.position.set(px, 0.48, -0.7);
            bedGroup.add(pillow);
          });

          // Nightstands with Brass Lamps
          const nsGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
          [-1.3, 1.3].forEach((nx) => {
            const ns = new THREE.Mesh(nsGeo, furnitureWoodMat);
            ns.position.set(nx, 0.25, -0.9);
            ns.castShadow = true;
            bedGroup.add(ns);

            const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.25), accentBrassMat);
            lampBase.position.set(nx, 0.62, -0.9);
            bedGroup.add(lampBase);
          });

          bedGroup.position.set(fPos.x, 0, fPos.z);
          floorGroup.add(bedGroup);
        } else if (f.type === 'sofa') {
          const sofaGroup = new THREE.Group();
          // Main Sectional Base
          const sbGeo = new THREE.BoxGeometry(2.5, 0.45, 0.9);
          const sbMesh = new THREE.Mesh(sbGeo, furnitureFabricMat);
          sbMesh.position.set(0, 0.22, 0);
          sbMesh.castShadow = true;
          sofaGroup.add(sbMesh);

          // Backrest
          const brGeo = new THREE.BoxGeometry(2.5, 0.45, 0.2);
          const brMesh = new THREE.Mesh(brGeo, furnitureFabricMat);
          brMesh.position.set(0, 0.62, -0.35);
          brMesh.castShadow = true;
          sofaGroup.add(brMesh);

          // Chaise Extension
          const chGeo = new THREE.BoxGeometry(0.9, 0.45, 1.3);
          const chMesh = new THREE.Mesh(chGeo, furnitureFabricMat);
          chMesh.position.set(0.8, 0.22, 0.8);
          chMesh.castShadow = true;
          sofaGroup.add(chMesh);

          // Coffee Table
          const ctGeo = new THREE.BoxGeometry(1.2, 0.35, 0.7);
          const ctMesh = new THREE.Mesh(ctGeo, accentBrassMat);
          ctMesh.position.set(0, 0.175, 1.1);
          ctMesh.castShadow = true;
          sofaGroup.add(ctMesh);

          sofaGroup.position.set(fPos.x, 0, fPos.z);
          floorGroup.add(sofaGroup);
        } else if (f.type === 'dining_table') {
          const dtGroup = new THREE.Group();
          // Table Top
          const ttGeo = new THREE.BoxGeometry(2.2, 0.1, 1.1);
          const ttMesh = new THREE.Mesh(ttGeo, furnitureWoodMat);
          ttMesh.position.set(0, 0.75, 0);
          ttMesh.castShadow = true;
          dtGroup.add(ttMesh);

          // Table Legs
          const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.7);
          [-0.9, 0.9].forEach((lx) => {
            [-0.4, 0.4].forEach((lz) => {
              const leg = new THREE.Mesh(legGeo, accentBrassMat);
              leg.position.set(lx, 0.35, lz);
              leg.castShadow = true;
              dtGroup.add(leg);
            });
          });

          // 6 Chairs
          const chairGeo = new THREE.BoxGeometry(0.4, 0.45, 0.4);
          [-0.7, 0, 0.7].forEach((cx) => {
            [-0.75, 0.75].forEach((cz) => {
              const chair = new THREE.Mesh(chairGeo, furnitureFabricMat);
              chair.position.set(cx, 0.225, cz);
              chair.castShadow = true;
              dtGroup.add(chair);
            });
          });

          dtGroup.position.set(fPos.x, 0, fPos.z);
          floorGroup.add(dtGroup);
        } else if (f.type === 'counter') {
          const counterGeo = new THREE.BoxGeometry(2.2, 0.85, 0.65);
          const counter = new THREE.Mesh(counterGeo, tileFloorMat);
          counter.position.set(fPos.x, 0.425, fPos.z);
          counter.castShadow = true;
          floorGroup.add(counter);
        } else if (f.type === 'sanitary') {
          const bathGroup = new THREE.Group();
          // Vanity Counter
          const vGeo = new THREE.BoxGeometry(1.4, 0.85, 0.6);
          const vMesh = new THREE.Mesh(vGeo, tileFloorMat);
          vMesh.position.set(0, 0.425, 0);
          vMesh.castShadow = true;
          bathGroup.add(vMesh);

          // Glass Shower Box
          const sGeo = new THREE.BoxGeometry(1.1, 1.8, 1.1);
          const sMesh = new THREE.Mesh(sGeo, glassMat);
          sMesh.position.set(1.4, 0.9, 0);
          bathGroup.add(sMesh);

          bathGroup.position.set(fPos.x, 0, fPos.z);
          floorGroup.add(bathGroup);
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

        const stepGeo = new THREE.BoxGeometry(1.2, 0.14, 0.35);
        const stepMesh = new THREE.Mesh(stepGeo, accentBrassMat);
        stepMesh.position.set(stepX, stepY + 0.07, stepZ);
        stepMesh.castShadow = true;
        floorGroup.add(stepMesh);
      }
    });

    // 7. Ground Shadow Plane
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0xfaf8f5, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // 8. Architectural Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe8e4dd, 0.7);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffdf8, 1.5);
    dirLight.position.set(20, 35, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 90;
    const shadowD = 22;
    dirLight.shadow.camera.left = -shadowD;
    dirLight.shadow.camera.right = shadowD;
    dirLight.shadow.camera.top = shadowD;
    dirLight.shadow.camera.bottom = -shadowD;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // 9. CRITICAL STEP 10: AUTO-FIT CAMERA TO 3D MODEL BOUNDING BOX (85-92% OCCUPANCY)
    const bbox = new THREE.Box3().setFromObject(floorGroup);
    const bboxSize = new THREE.Vector3();
    const bboxCenter = new THREE.Vector3();
    bbox.getSize(bboxSize);
    bbox.getCenter(bboxCenter);

    // Position camera target at model centroid
    const maxDim = Math.max(bboxSize.x, bboxSize.z);
    const aspect = this.width / this.height;

    // Add only 10% padding so model fills 85-90% of frame!
    const paddingMultiplier = 0.58;
    const orthoH = maxDim * paddingMultiplier;
    const orthoW = orthoH * aspect;

    const camera = new THREE.OrthographicCamera(
      -orthoW,
      orthoW,
      orthoH,
      -orthoH,
      1,
      1000
    );

    // Position camera at 45-degree angle offset from model center
    camera.position.set(bboxCenter.x + 20, bboxCenter.y + 24, bboxCenter.z + 20);
    camera.lookAt(bboxCenter);

    // 10. Render Scene to WebGL Canvas
    renderer.render(scene, camera);

    // 11. Extract High-Res PNG Data URL
    const pngDataUrl = renderer.domElement.toDataURL('image/png');
    renderer.dispose();

    return {
      pngDataUrl,
      roomCentroids,
    };
  }
}
