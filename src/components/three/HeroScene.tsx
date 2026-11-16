import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function createScreenTexture(maxAniso: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 640);
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(1, '#F3EFFF');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 640);

    ctx.fillStyle = '#F8F6FF';
    ctx.fillRect(0, 0, 1024, 54);
    ctx.fillStyle = '#E2DCFA';
    ctx.fillRect(0, 53, 1024, 2);

    ['#5B42F3', '#8B75FF', '#C4B7FC'].forEach((color, idx) => {
      ctx.beginPath();
      ctx.arc(34 + idx * 22, 27, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    ctx.fillStyle = '#FAF8FF';
    ctx.fillRect(28, 76, 190, 536);
    ctx.strokeStyle = '#E7E2FA';
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 76, 190, 536);

    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i === 0 ? '#5B42F3' : '#D9D1FB';
      ctx.beginPath();
      ctx.roundRect(48, 108 + i * 44, i === 0 ? 148 : 118 + (i % 3) * 14, 14, 7);
      ctx.fill();
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(244, 76, 750, 300, 18);
    ctx.fill();
    ctx.strokeStyle = '#E7E2FA';
    ctx.stroke();

    ctx.fillStyle = '#131129';
    ctx.beginPath();
    ctx.roundRect(274, 106, 220, 18, 9);
    ctx.fill();

    ctx.fillStyle = '#5B42F3';
    ctx.beginPath();
    ctx.roundRect(860, 104, 104, 24, 12);
    ctx.fill();

    ctx.strokeStyle = '#F2EEFC';
    ctx.lineWidth = 1.5;
    for (let g = 0; g < 4; g++) {
      const gy = 166 + g * 46;
      ctx.beginPath();
      ctx.moveTo(274, gy);
      ctx.lineTo(964, gy);
      ctx.stroke();
    }

    const pts = [
      [274, 320],
      [388, 286],
      [502, 250],
      [616, 266],
      [730, 194],
      [844, 162],
      [964, 128],
    ];
    const areaGrad = ctx.createLinearGradient(0, 128, 0, 340);
    areaGrad.addColorStop(0, 'rgba(91, 66, 243, 0.32)');
    areaGrad.addColorStop(1, 'rgba(91, 66, 243, 0.02)');

    ctx.beginPath();
    ctx.moveTo(pts[0][0], 342);
    pts.forEach(([px, py]) => ctx.lineTo(px, py));
    ctx.lineTo(964, 342);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    ctx.beginPath();
    pts.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.strokeStyle = '#5B42F3';
    ctx.lineWidth = 4.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    pts.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#5B42F3';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    [244, 628].forEach((bx, idx) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(bx, 398, 366, 214, 18);
      ctx.fill();
      ctx.strokeStyle = '#E7E2FA';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = idx === 0 ? '#5B42F3' : '#8B75FF';
      ctx.beginPath();
      ctx.roundRect(bx + 26, 428, 120, 14, 7);
      ctx.fill();

      for (let b = 0; b < 5; b++) {
        const h = 42 + ((b * 29 + idx * 17) % 85);
        ctx.fillStyle = b === 4 ? '#5B42F3' : '#C4B7FC';
        ctx.beginPath();
        ctx.roundRect(bx + 32 + b * 62, 578 - h, 38, h, 8);
        ctx.fill();
      }
    });
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  return tex;
}

function createFloatingCardTexture(variant: 'code' | 'funnel' | 'mobile', maxAniso: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 512, 340);

    const grad = ctx.createLinearGradient(0, 0, 512, 340);
    grad.addColorStop(0, 'rgba(243, 239, 255, 0.85)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.96)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 340);

    ctx.fillStyle = '#5B42F3';
    ctx.beginPath();
    ctx.roundRect(32, 30, 140, 16, 8);
    ctx.fill();

    if (variant === 'code') {
      const widths = [280, 210, 340, 190, 310, 240];
      widths.forEach((w, i) => {
        ctx.fillStyle = i % 2 === 0 ? '#7C63FF' : '#D5CCFB';
        ctx.beginPath();
        ctx.roundRect(32 + (i % 2) * 28, 78 + i * 38, w, 14, 7);
        ctx.fill();
      });
    } else if (variant === 'funnel') {
      for (let i = 0; i < 6; i++) {
        const barH = 54 + i * 24;
        ctx.fillStyle = i >= 4 ? '#5B42F3' : '#9E8CFF';
        ctx.beginPath();
        ctx.roundRect(42 + i * 74, 290 - barH, 46, barH, 10);
        ctx.fill();
      }
    } else {
      ctx.strokeStyle = '#C4B7FC';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(38, 74, 180, 224, 18);
      ctx.stroke();
      ctx.fillStyle = '#5B42F3';
      ctx.beginPath();
      ctx.roundRect(62, 106, 132, 68, 12);
      ctx.fill();
      ctx.fillStyle = '#8B75FF';
      ctx.beginPath();
      ctx.roundRect(246, 86, 224, 96, 16);
      ctx.fill();
      ctx.fillStyle = '#DDD6FE';
      ctx.beginPath();
      ctx.roundRect(246, 204, 224, 88, 16);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 120);
    grad.addColorStop(0, 'rgba(34, 22, 98, 0.22)');
    grad.addColorStop(0.55, 'rgba(91, 66, 243, 0.09)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setContextLost(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 7.6);
    camera.lookAt(0, 0.1, 0);

    const hemiLight = new THREE.HemisphereLight(0xf3efff, 0xd9d1fb, 0.92);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffaf5, 1.55);
    keyLight.position.set(5.5, 7.5, 6);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.left = -4;
      keyLight.shadow.camera.right = 4;
      keyLight.shadow.camera.top = 4;
      keyLight.shadow.camera.bottom = -4;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7c63ff, 1.3);
    rimLight.position.set(-5, 3.5, -4);
    scene.add(rimLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    const disposables: Array<{ dispose: () => void }> = [envRT];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const aluminumMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xf1edff,
        metalness: 0.8,
        roughness: 0.22,
        clearcoat: 0.45,
        clearcoatRoughness: 0.2,
      }),
    );
    const darkIndigoKeyMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x1a1242,
        metalness: 0.25,
        roughness: 0.65,
      }),
    );
    const royalVioletAccentMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x5b42f3,
        metalness: 0.6,
        roughness: 0.18,
        clearcoat: 0.85,
      }),
    );
    const lavenderCrystalMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x8b75ff,
        metalness: 0.1,
        roughness: 0.08,
        transmission: isSoftwareGl ? 0 : 0.72,
        transparent: true,
        opacity: isSoftwareGl ? 0.55 : 0.92,
        ior: 1.52,
        thickness: 0.8,
        clearcoat: 1.0,
      }),
    );
    const glassSlabMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.05,
        roughness: 0.1,
        transmission: isSoftwareGl ? 0 : 0.82,
        transparent: true,
        opacity: isSoftwareGl ? 0.48 : 0.94,
        ior: 1.5,
        thickness: 0.4,
        clearcoat: 1.0,
      }),
    );

    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, -0.35, 0);
    laptopGroup.rotation.set(0.14, -0.34, 0.03);
    rootGroup.add(laptopGroup);

    const baseShape = createRoundedRectShape(3.2, 2.2, 0.14);
    const baseGeo = track(
      new THREE.ExtrudeGeometry(baseShape, {
        depth: 0.09,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.025,
        bevelThickness: 0.025,
      }),
    );
    baseGeo.rotateX(Math.PI / 2);
    const baseMesh = new THREE.Mesh(baseGeo, aluminumMat);
    baseMesh.castShadow = !isSoftwareGl;
    baseMesh.receiveShadow = !isSoftwareGl;
    laptopGroup.add(baseMesh);

    const kbDeckGeo = track(new THREE.BoxGeometry(2.68, 0.02, 1.02));
    const kbDeck = new THREE.Mesh(kbDeckGeo, darkIndigoKeyMat);
    kbDeck.position.set(0, 0.02, -0.26);
    laptopGroup.add(kbDeck);

    const trackpadGeo = track(new THREE.BoxGeometry(1.05, 0.015, 0.62));
    const trackpadMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xe3dcff,
        metalness: 0.4,
        roughness: 0.25,
      }),
    );
    const trackpad = new THREE.Mesh(trackpadGeo, trackpadMat);
    trackpad.position.set(0, 0.02, 0.64);
    laptopGroup.add(trackpad);

    const hingeGeo = track(new THREE.CylinderGeometry(0.055, 0.055, 2.5, 20));
    hingeGeo.rotateZ(Math.PI / 2);
    const hinge = new THREE.Mesh(hingeGeo, royalVioletAccentMat);
    hinge.position.set(0, 0.03, -1.06);
    laptopGroup.add(hinge);

    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, 0.04, -1.06);
    lidPivot.rotation.x = -0.28;
    laptopGroup.add(lidPivot);

    const lidShape = createRoundedRectShape(3.2, 2.05, 0.12);
    const lidGeo = track(
      new THREE.ExtrudeGeometry(lidShape, {
        depth: 0.055,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.02,
        bevelThickness: 0.02,
      }),
    );
    const lidChassis = new THREE.Mesh(lidGeo, aluminumMat);
    lidChassis.position.set(0, 1.04, -0.05);
    lidChassis.castShadow = !isSoftwareGl;
    lidPivot.add(lidChassis);

    const bezelGeo = track(new THREE.BoxGeometry(3.04, 1.9, 0.02));
    const bezel = new THREE.Mesh(bezelGeo, darkIndigoKeyMat);
    bezel.position.set(0, 1.04, 0.02);
    lidPivot.add(bezel);

    const screenTex = track(createScreenTexture(maxAniso));
    const screenGeo = track(new THREE.PlaneGeometry(2.9, 1.76));
    const screenMat = track(
      new THREE.MeshBasicMaterial({
        map: screenTex,
      }),
    );
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 1.04, 0.032);
    lidPivot.add(screenMesh);

    const shadowTex = track(createContactShadowTexture());
    const shadowPlaneGeo = track(new THREE.PlaneGeometry(5.6, 4.2));
    const shadowPlaneMat = track(
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.72,
      }),
    );
    const contactShadow = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, -1.02, 0);
    rootGroup.add(contactShadow);

    const floatingCards: Array<{ group: THREE.Group; basePos: THREE.Vector3; phase: number }> = [];
    const cardConfigs: Array<{
      variant: 'code' | 'funnel' | 'mobile';
      pos: [number, number, number];
      rot: [number, number, number];
      scale: number;
      phase: number;
    }> = [
      { variant: 'funnel', pos: [-2.15, 0.95, 0.65], rot: [0.06, 0.35, -0.04], scale: 0.95, phase: 0.2 },
      { variant: 'code', pos: [2.1, 1.05, 0.25], rot: [0.08, -0.42, 0.05], scale: 0.92, phase: 1.8 },
      { variant: 'mobile', pos: [1.95, -0.55, 1.05], rot: [-0.08, -0.3, 0.02], scale: 0.82, phase: 3.1 },
    ];

    cardConfigs.forEach((cfg) => {
      const cardGroup = new THREE.Group();
      cardGroup.position.set(...cfg.pos);
      cardGroup.rotation.set(...cfg.rot);
      cardGroup.scale.setScalar(cfg.scale);

      const slabShape = createRoundedRectShape(1.55, 1.02, 0.09);
      const slabGeo = track(
        new THREE.ExtrudeGeometry(slabShape, {
          depth: 0.04,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.015,
          bevelThickness: 0.015,
        }),
      );
      const slab = new THREE.Mesh(slabGeo, glassSlabMat);
      slab.renderOrder = 2;
      cardGroup.add(slab);

      const cardTex = track(createFloatingCardTexture(cfg.variant, maxAniso));
      const faceGeo = track(new THREE.PlaneGeometry(1.42, 0.92));
      const faceMat = track(
        new THREE.MeshBasicMaterial({
          map: cardTex,
          transparent: true,
          opacity: 0.96,
        }),
      );
      const face = new THREE.Mesh(faceGeo, faceMat);
      face.position.z = 0.06;
      cardGroup.add(face);

      rootGroup.add(cardGroup);
      floatingCards.push({
        group: cardGroup,
        basePos: new THREE.Vector3(...cfg.pos),
        phase: cfg.phase,
      });
    });

    const orbitalRingGeo = track(new THREE.TorusGeometry(2.35, 0.032, 16, 80));
    const orbitalRing = new THREE.Mesh(orbitalRingGeo, royalVioletAccentMat);
    orbitalRing.position.set(0.15, 0.35, -0.6);
    orbitalRing.rotation.set(Math.PI / 2.6, 0.25, 0);
    rootGroup.add(orbitalRing);

    const crystalGeo = track(new THREE.OctahedronGeometry(0.32, 0));
    const crystalA = new THREE.Mesh(crystalGeo, lavenderCrystalMat);
    crystalA.position.set(-2.35, -0.55, 0.9);
    rootGroup.add(crystalA);

    const crystalB = new THREE.Mesh(crystalGeo, royalVioletAccentMat);
    crystalB.scale.setScalar(0.65);
    crystalB.position.set(2.35, 0.15, -0.5);
    rootGroup.add(crystalB);

    const cubeGeo = track(new THREE.BoxGeometry(0.28, 0.28, 0.28));
    const glassCube = new THREE.Mesh(cubeGeo, lavenderCrystalMat);
    glassCube.position.set(-1.3, 1.85, -0.4);
    rootGroup.add(glassCube);

    const particleCount = 90;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4.5 - 0.5;
    }
    const particleGeo = track(new THREE.BufferGeometry());
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = track(
      new THREE.PointsMaterial({
        color: 0x7c63ff,
        size: 0.055,
        transparent: true,
        opacity: 0.55,
      }),
    );
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerRef.current.x = THREE.MathUtils.clamp(nx, -1, 1);
      pointerRef.current.y = THREE.MathUtils.clamp(ny, -1, 1);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        const targetRotY = pointerRef.current.x * 0.18;
        const targetRotX = pointerRef.current.y * 0.09;
        rootGroup.rotation.y = THREE.MathUtils.damp(rootGroup.rotation.y, targetRotY, 4.5, dt);
        rootGroup.rotation.x = THREE.MathUtils.damp(rootGroup.rotation.x, targetRotX, 4.5, dt);

        laptopGroup.position.y = -0.35 + Math.sin(t * 1.1) * 0.06;

        floatingCards.forEach((card) => {
          card.group.position.y = card.basePos.y + Math.sin(t * 1.3 + card.phase) * 0.09;
        });

        orbitalRing.rotation.z = t * 0.14;
        crystalA.rotation.x = t * 0.45;
        crystalA.rotation.y = t * 0.6;
        crystalB.rotation.y = -t * 0.5;
        glassCube.rotation.x = t * 0.35;
        glassCube.rotation.y = t * 0.4;
        particles.rotation.y = t * 0.035;
      }

      renderer.render(scene, camera);

      if (prefersReducedMotion) {
        return;
      }
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (contextLost) {
    return (
      <div className="relative flex h-full w-full items-center justify-center rounded-3xl border border-[#E2DCFA] bg-gradient-to-br from-[#FFFFFF] via-[#F3EFFF] to-[#E6DFFF] p-8">
        <div className="max-w-sm rounded-2xl border border-[#D8CEFC] bg-white/95 p-6 shadow-sm">
          <p className="font-display text-sm font-semibold text-[#5B42F3]">Build Technology Studio</p>
          <p className="mt-2 text-sm text-[#56536E]">
            Interactive software architecture, responsive web engineering, and performance marketing systems.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      aria-label="Interactive 3D workstation and floating digital interface composition"
      className="relative h-[380px] w-full sm:h-[460px] lg:h-[520px]"
    />
  );
}
