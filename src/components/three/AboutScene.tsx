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

export function AboutScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const [fallback, setFallback] = useState(false);

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
      setFallback(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 420;
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setFallback(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 0.4, 6.2);
    camera.lookAt(0, 0, 0);

    const hemi = new THREE.HemisphereLight(0xf3efff, 0xd9d1fb, 1.0);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfffaf5, 1.45);
    key.position.set(4, 6, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x7c63ff, 1.25);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    const disposables: Array<{ dispose: () => void }> = [envRT];
    const track = <T extends { dispose: () => void }>(d: T): T => {
      disposables.push(d);
      return d;
    };

    const sculpture = new THREE.Group();
    scene.add(sculpture);

    const coreMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x5b42f3,
        metalness: 0.68,
        roughness: 0.18,
        clearcoat: 0.9,
      }),
    );
    const coreGeo = track(new THREE.IcosahedronGeometry(0.95, 1));
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    sculpture.add(coreMesh);

    const shellMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x9b86ff,
        metalness: 0.05,
        roughness: 0.08,
        transmission: isSoftwareGl ? 0 : 0.78,
        transparent: true,
        opacity: isSoftwareGl ? 0.35 : 0.85,
        ior: 1.5,
        thickness: 0.6,
        clearcoat: 1,
        depthWrite: false,
      }),
    );
    const shellGeo = track(new THREE.IcosahedronGeometry(1.38, 0));
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    shellMesh.renderOrder = 2;
    sculpture.add(shellMesh);

    const ringMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xede9fe,
        metalness: 0.85,
        roughness: 0.18,
      }),
    );
    const ringGeoA = track(new THREE.TorusGeometry(1.85, 0.036, 16, 72));
    const ringA = new THREE.Mesh(ringGeoA, ringMat);
    ringA.rotation.set(Math.PI / 3, 0.3, 0);
    sculpture.add(ringA);

    const ringGeoB = track(new THREE.TorusGeometry(2.1, 0.025, 16, 72));
    const ringB = new THREE.Mesh(ringGeoB, coreMat);
    ringB.rotation.set(-Math.PI / 4, -0.45, 0.2);
    sculpture.add(ringB);

    const satGeo = track(new THREE.SphereGeometry(0.14, 20, 20));
    const satellites: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const sat = new THREE.Mesh(satGeo, i % 2 === 0 ? coreMat : ringMat);
      satellites.push(sat);
      sculpture.add(sat);
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 480;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetTiltRef.current.x = THREE.MathUtils.clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
      targetTiltRef.current.y = THREE.MathUtils.clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    };
    container.addEventListener('pointermove', onPointerMove, { passive: true });

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
        sculpture.rotation.x = THREE.MathUtils.damp(sculpture.rotation.x, targetTiltRef.current.x * 0.28, 4, dt);
        sculpture.rotation.y = THREE.MathUtils.damp(
          sculpture.rotation.y,
          targetTiltRef.current.y * 0.35 + t * 0.16,
          4,
          dt,
        );
        coreMesh.rotation.y = -t * 0.25;
        shellMesh.rotation.z = t * 0.18;
        ringA.rotation.z = t * 0.22;
        ringB.rotation.z = -t * 0.18;

        satellites.forEach((sat, idx) => {
          const angle = t * 0.75 + (idx * Math.PI) / 2;
          const r = idx % 2 === 0 ? 1.85 : 2.1;
          sat.position.set(Math.cos(angle) * r, Math.sin(angle * 0.7) * 0.55, Math.sin(angle) * r);
        });
      }

      renderer.render(scene, camera);

      if (prefersReducedMotion) return;
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      ro.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (fallback) {
    return (
      <div className="flex h-full min-h-[340px] w-full items-center justify-center rounded-2xl border border-[#E2DCFA] bg-[#F4F0FF]/70 p-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 rounded-2xl border border-[#7C63FF]/40 bg-gradient-to-br from-[#5B42F3] to-[#9B86FF]" />
          <p className="mt-4 font-display text-sm font-semibold text-[#131129]">Unified Digital Architecture</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      aria-label="Interactive 3D architectural core representing technology, creativity, and strategy"
      className="h-[340px] w-full sm:h-[400px] lg:h-[440px]"
    />
  );
}
