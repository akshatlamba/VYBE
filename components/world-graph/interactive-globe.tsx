"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GlobeMarker, WORLD_GRAPH_MARKERS } from "@/lib/data/world-graph-data";
import { Plus, Minus, Crosshair, Pause, Play, Sparkles, ArrowRight, X } from "lucide-react";

interface InteractiveGlobeProps {
  markers?: GlobeMarker[];
  selectedMarkerId?: string | null;
  onSelectMarker?: (marker: GlobeMarker) => void;
  onOpenDetails?: (marker: GlobeMarker) => void;
  filteredCategory?: string;
  className?: string;
}

// Convert geographic coordinates (lat, lng) to 3D Cartesian coordinates (x, y, z)
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Procedural high-tech Earth texture generator with glowing continents, grid lines, and city lights
function generateEarthTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep cosmic ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, "#080B1A");
  oceanGrad.addColorStop(0.5, "#0D122B");
  oceanGrad.addColorStop(1, "#070A18");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle coordinate grid lines (latitude & longitude)
  ctx.strokeStyle = "rgba(79, 110, 247, 0.12)";
  ctx.lineWidth = 1;

  for (let x = 0; x <= width; x += width / 24) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += height / 12) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Equator highlight
  ctx.strokeStyle = "rgba(120, 160, 255, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  // Draw stylized continent landmasses (Mercator / Equirectangular approximation)
  ctx.fillStyle = "rgba(40, 60, 120, 0.35)";
  ctx.shadowColor = "#4F75FF";
  ctx.shadowBlur = 12;

  const drawPolygon = (points: [number, number][]) => {
    ctx.beginPath();
    points.forEach(([px, py], i) => {
      const cx = (px / 360) * width;
      const cy = (py / 180) * height;
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  ctx.strokeStyle = "rgba(125, 175, 255, 0.65)";
  ctx.lineWidth = 1.8;

  // North America
  drawPolygon([
    [30, 20], [60, 20], [90, 28], [110, 40], [125, 45], [140, 52], [130, 75],
    [105, 78], [80, 85], [55, 65], [40, 45], [30, 25],
  ]);

  // South America
  drawPolygon([
    [85, 95], [115, 90], [135, 105], [145, 125], [135, 150], [115, 170],
    [105, 155], [95, 125], [85, 105],
  ]);

  // Europe & Scandinavia
  drawPolygon([
    [170, 25], [200, 22], [220, 28], [215, 48], [195, 55], [180, 50],
    [170, 40], [165, 30],
  ]);

  // Africa
  drawPolygon([
    [175, 60], [215, 58], [235, 75], [230, 105], [215, 135], [200, 145],
    [185, 130], [170, 95], [165, 75],
  ]);

  // Asia & India
  drawPolygon([
    [220, 30], [280, 25], [320, 35], [325, 70], [300, 85], [280, 80],
    [255, 100], [240, 85], [235, 55],
  ]);

  // Australia & Oceania
  drawPolygon([
    [295, 115], [330, 115], [335, 140], [315, 150], [290, 140],
  ]);

  ctx.shadowBlur = 0;

  // Neon City Lights / High-tech Node Cluster dots
  ctx.fillStyle = "#A5B4FC";
  const cityDots: [number, number][] = [
    [70, 48], [85, 55], [55, 50], [105, 115], [180, 38], [195, 42],
    [210, 40], [250, 72], [260, 76], [295, 58], [305, 132], [200, 85]
  ];

  cityDots.forEach(([dx, dy]) => {
    const cx = (dx / 360) * width;
    const cy = (dy / 180) * height;
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Pulse aura
    ctx.strokeStyle = "rgba(168, 85, 247, 0.45)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Generate canvas texture for circular marker badges matching reference
function createMarkerTexture(marker: GlobeMarker): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;

  // Glow shadow
  ctx.shadowColor = marker.color;
  ctx.shadowBlur = 18;

  // Background filled circle
  ctx.fillStyle = "#0F1123";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Solid colored border
  ctx.strokeStyle = marker.color;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Inner subtle border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
  ctx.stroke();

  // Icon symbol
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 44px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let symbol = "✦";
  if (marker.iconType === "chip") symbol = "⚡";
  else if (marker.iconType === "leaf") symbol = "🌱";
  else if (marker.iconType === "rocket") symbol = "🚀";
  else if (marker.iconType === "flask" || marker.iconType === "atom") symbol = "⚛";
  else if (marker.iconType === "globe") symbol = "🌐";
  else if (marker.iconType === "briefcase") symbol = "💼";

  ctx.fillText(symbol, cx, cy + 2);

  return new THREE.CanvasTexture(canvas);
}

export function InteractiveGlobe({
  markers = WORLD_GRAPH_MARKERS,
  selectedMarkerId = null,
  onSelectMarker,
  onOpenDetails,
  filteredCategory = "All",
  className = "",
}: InteractiveGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredMarker, setHoveredMarker] = useState<GlobeMarker | null>(null);
  const [activeMarker, setActiveMarker] = useState<GlobeMarker | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  // References for scene & camera controls
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const markerMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const isDraggingRef = useRef(false);
  const previousPointerPositionRef = useRef({ x: 0, y: 0 });
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.25, y: 0 });
  const currentRotationRef = useRef({ x: 0.25, y: 0 });
  const targetZoomRef = useRef(2.8);
  const currentZoomRef = useRef(2.8);
  const animationFrameIdRef = useRef<number | null>(null);

  // Filter markers based on selected category
  const activeMarkers = markers.filter(
    (m) => filteredCategory === "All" || m.category === filteredCategory
  );

  // Initialize selected marker only if explicitly passed
  useEffect(() => {
    if (selectedMarkerId) {
      const match = markers.find((m) => m.id === selectedMarkerId);
      if (match) setActiveMarker(match);
    }
  }, [selectedMarkerId, markers]);

  // Press Escape to dismiss active callout
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMarker(null);
        if (onSelectMarker) onSelectMarker(null as any);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSelectMarker]);

  // Set up Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = currentZoomRef.current;
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Main Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Earth Sphere
    const globeRadius = 1.0;
    const earthGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const proceduralTexture = generateEarthTexture();

    const earthMat = new THREE.MeshPhongMaterial({
      map: proceduralTexture,
      bumpScale: 0.05,
      specular: new THREE.Color("#2C3A7A"),
      shininess: 24,
      emissive: new THREE.Color("#080D24"),
      emissiveIntensity: 0.8,
    });

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Load photorealistic NASA Earth texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/earth_atmos.jpg", (loadedTex) => {
      loadedTex.colorSpace = THREE.SRGBColorSpace;
      earthMat.map = loadedTex;
      earthMat.needsUpdate = true;
    });

    // Atmospheric Cloud Layer
    const cloudsGeo = new THREE.SphereGeometry(globeRadius * 1.018, 64, 64);
    const cloudsMat = new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    globeGroup.add(cloudsMesh);

    textureLoader.load("/earth_clouds.png", (cloudTex) => {
      cloudsMat.map = cloudTex;
      cloudsMat.needsUpdate = true;
    });

    // 4. Atmospheric Outer Glow
    const atmosphereGeo = new THREE.SphereGeometry(globeRadius * 1.06, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.35, 0.55, 1.0, 1.0) * intensity * 1.6;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });

    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // 5. Orbital Latitude / Longitude Data Rings
    const ringGroup = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(globeRadius * 1.28, 0.003, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.35,
    });

    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat.clone());
    ring2.rotation.x = -Math.PI / 3.5;
    ring2.rotation.y = Math.PI / 5;
    ringGroup.add(ring2);

    globeGroup.add(ringGroup);

    // 6. Connected Innovation Arcs (Trajectories)
    const arcGroup = new THREE.Group();
    const createArc = (startVec: THREE.Vector3, endVec: THREE.Vector3, colorHex: number) => {
      const mid = startVec.clone().add(endVec).multiplyScalar(0.5);
      const dist = startVec.distanceTo(endVec);
      mid.normalize().multiplyScalar(globeRadius + dist * 0.35);

      const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.7,
        linewidth: 2,
      });
      return new THREE.Line(arcGeo, arcMat);
    };

    // Major global hub arcs
    const sf = latLngToVector3(37.7749, -122.4194, globeRadius);
    const blr = latLngToVector3(12.9716, 77.5946, globeRadius);
    const zurich = latLngToVector3(46.2044, 6.1432, globeRadius);
    const tokyo = latLngToVector3(35.6762, 139.6503, globeRadius);
    const sp = latLngToVector3(-23.5505, -46.6333, globeRadius);

    arcGroup.add(createArc(sf, zurich, 0xa855f7));
    arcGroup.add(createArc(zurich, blr, 0x38bdf8));
    arcGroup.add(createArc(blr, tokyo, 0x22c55e));
    arcGroup.add(createArc(sp, sf, 0xf97316));
    globeGroup.add(arcGroup);

    // 7. Markers Group
    const markersGroup = new THREE.Group();
    globeGroup.add(markersGroup);
    markersGroupRef.current = markersGroup;

    // 8. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x818cf8, 2.4);
    dirLight1.position.set(5, 3, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight2.position.set(-5, -2, -3);
    scene.add(dirLight2);

    // 9. Resize listener
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 10. Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.015;

      // Auto rotation when idle
      if (autoRotate && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.0018;
      }

      // Smooth damping interpolation
      currentRotationRef.current.x +=
        (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y +=
        (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      currentZoomRef.current +=
        (targetZoomRef.current - currentZoomRef.current) * 0.08;

      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.x = currentRotationRef.current.x;
        globeGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      if (cameraRef.current) {
        cameraRef.current.position.z = currentZoomRef.current;
      }

      if (cloudsMesh) {
        cloudsMesh.rotation.y += 0.0006;
      }

      // Pulse markers halo
      if (markersGroupRef.current) {
        markersGroupRef.current.children.forEach((child) => {
          const halo = child.getObjectByName("halo");
          if (halo) {
            const scale = 1 + Math.sin(time * 3) * 0.22;
            halo.scale.set(scale, scale, scale);
          }
        });
      }

      renderer.render(scene, camera);
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      renderer.dispose();
      earthGeo.dispose();
      earthMat.dispose();
    };
  }, [autoRotate]);

  // Update Markers on Globe when activeMarkers change
  useEffect(() => {
    const markersGroup = markersGroupRef.current;
    if (!markersGroup) return;

    // Clear previous marker meshes
    while (markersGroup.children.length > 0) {
      markersGroup.remove(markersGroup.children[0]);
    }
    markerMeshesRef.current.clear();

    const globeRadius = 1.0;

    activeMarkers.forEach((marker) => {
      const pos = latLngToVector3(marker.lat, marker.lng, globeRadius * 1.015);
      const markerPivot = new THREE.Group();
      markerPivot.position.copy(pos);

      // Align pivot outward along sphere normal
      markerPivot.lookAt(pos.clone().multiplyScalar(2));

      // 1. Glowing Icon Badge Sprite
      const spriteMat = new THREE.SpriteMaterial({
        map: createMarkerTexture(marker),
        transparent: true,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.12, 0.12, 1);
      sprite.position.set(0, 0, 0.04);
      sprite.name = "core";
      (sprite as any).markerData = marker;
      markerPivot.add(sprite);

      // 2. Pulsing Glow Ring
      const haloGeo = new THREE.RingGeometry(0.06, 0.088, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(marker.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.name = "halo";
      markerPivot.add(haloMesh);

      // 3. Outer Beacon Spike Line
      const spikeGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0.09),
      ]);
      const spikeMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(marker.color),
        linewidth: 2,
      });
      const spikeLine = new THREE.Line(spikeGeo, spikeMat);
      markerPivot.add(spikeLine);

      markersGroup.add(markerPivot);
      markerMeshesRef.current.set(marker.id, markerPivot);
    });
  }, [activeMarkers]);

  // Pointer Interaction (Drag, Rotate & Raycast click)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const container = containerRef.current;
    if (!container || !cameraRef.current || !globeGroupRef.current) return;

    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousPointerPositionRef.current.x;
      const deltaY = e.clientY - previousPointerPositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x = Math.max(
        -Math.PI / 2.5,
        Math.min(Math.PI / 2.5, targetRotationRef.current.x + deltaY * 0.005)
      );

      previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
    } else {
      // Raycasting for Hover Detection
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      if (markersGroupRef.current) {
        const cores: THREE.Object3D[] = [];
        markersGroupRef.current.children.forEach((group) => {
          const core = group.getObjectByName("core");
          if (core) cores.push(core);
        });

        const intersects = raycaster.intersectObjects(cores);
        if (intersects.length > 0) {
          const intersectedCore = intersects[0].object as any;
          if (intersectedCore.markerData) {
            setHoveredMarker(intersectedCore.markerData);
            setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            return;
          }
        }
      }

      setHoveredMarker(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;

    // Detect click vs drag (less than 6px movement)
    const moveDist = Math.hypot(
      e.clientX - pointerDownPosRef.current.x,
      e.clientY - pointerDownPosRef.current.y
    );

    if (moveDist < 6) {
      const container = containerRef.current;
      if (!container || !cameraRef.current) return;

      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      if (markersGroupRef.current) {
        const cores: THREE.Object3D[] = [];
        markersGroupRef.current.children.forEach((group) => {
          const core = group.getObjectByName("core");
          if (core) cores.push(core);
        });

        const intersects = raycaster.intersectObjects(cores);
        if (intersects.length > 0) {
          const intersectedCore = intersects[0].object as any;
          if (intersectedCore.markerData) {
            flyToMarker(intersectedCore.markerData);
            return;
          }
        }
      }

      // Clicked on empty space of the globe/background -> dismiss callout card!
      setActiveMarker(null);
      if (onSelectMarker) onSelectMarker(null as any);
    }
  };

  const handlePointerLeave = () => {
    isDraggingRef.current = false;
    setHoveredMarker(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.002;
    targetZoomRef.current = Math.max(1.8, Math.min(4.5, targetZoomRef.current + zoomDelta));
  };

  // Fly to specific marker coordinates
  const flyToMarker = useCallback((marker: GlobeMarker) => {
    setActiveMarker(marker);
    if (onSelectMarker) onSelectMarker(marker);

    const phi = (marker.lat * Math.PI) / 180;
    const theta = (-marker.lng * Math.PI) / 180 - Math.PI / 2;

    targetRotationRef.current = {
      x: phi * 0.7,
      y: theta,
    };
    targetZoomRef.current = 2.4;
  }, [onSelectMarker]);

  // Controls Handlers
  const handleZoomIn = () => {
    targetZoomRef.current = Math.max(1.8, targetZoomRef.current - 0.4);
  };

  const handleZoomOut = () => {
    targetZoomRef.current = Math.min(4.5, targetZoomRef.current + 0.4);
  };

  const handleResetView = () => {
    targetRotationRef.current = { x: 0.25, y: 0 };
    targetZoomRef.current = 2.8;
  };

  return (
    <div
      className={`relative w-full h-full min-h-[460px] lg:min-h-[600px] overflow-hidden select-none ${className}`}
      onWheel={handleWheel}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      />

      {/* Atmospheric Star Dust Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#0a0b18_100%)] opacity-70" />

      {/* Control Buttons (Top Left Overlay matching design) */}
      <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white/80 text-[#1E1E22] hover:bg-white shadow-md backdrop-blur-md transition dark:border-white/20 dark:bg-black/60 dark:text-white dark:hover:bg-white/20 hover:scale-105 active:scale-95"
          aria-label="Zoom in globe"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white/80 text-[#1E1E22] hover:bg-white shadow-md backdrop-blur-md transition dark:border-white/20 dark:bg-black/60 dark:text-white dark:hover:bg-white/20 hover:scale-105 active:scale-95"
          aria-label="Zoom out globe"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={handleResetView}
          title="Reset Camera Center"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white/80 text-[#1E1E22] hover:bg-white shadow-md backdrop-blur-md transition dark:border-white/20 dark:bg-black/60 dark:text-white dark:hover:bg-white/20 hover:scale-105 active:scale-95"
          aria-label="Reset camera orientation"
        >
          <Crosshair className="h-4 w-4" />
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border backdrop-blur-md transition hover:scale-105 active:scale-95 shadow-md ${
            autoRotate
              ? "border-indigo-500/40 bg-indigo-600 text-white"
              : "border-black/10 bg-white/80 text-[#1E1E22] dark:border-white/20 dark:bg-black/60 dark:text-white/70"
          }`}
          aria-label="Toggle auto rotation"
        >
          {autoRotate ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Central Screen Projected Card: Currently Active Marker Callout */}
      {activeMarker && (
        <div
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-[28%] left-8 md:left-14 z-20 max-w-[280px] sm:max-w-[320px] rounded-2xl border border-black/10 bg-white/95 text-[#1E1E22] p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-left-4 duration-300 dark:border-indigo-500/30 dark:bg-[#16162C]/95 dark:text-white"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded truncate"
                style={{ backgroundColor: `${activeMarker.color}25`, color: activeMarker.color }}
              >
                {activeMarker.category}
              </span>
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 truncate">
                {activeMarker.country}
              </span>
            </div>

            {/* Close Button to dismiss callout */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMarker(null);
                if (onSelectMarker) onSelectMarker(null as any);
              }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/5 text-gray-600 hover:bg-black/10 hover:text-black transition-colors dark:border-white/10 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20 dark:hover:text-white"
              title="Close card (or click globe/Esc)"
              aria-label="Dismiss callout"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <h4 className="mt-2 text-sm sm:text-base font-bold text-[#1E1E22] dark:text-white leading-snug">
            {activeMarker.title}
          </h4>

          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {activeMarker.headline}
          </p>

          <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-black/10 dark:border-white/10">
            <button
              onClick={() => onOpenDetails && onOpenDetails(activeMarker)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              View Details
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-[#D3E57A]">
              {activeMarker.relevanceScore}% match
            </span>
          </div>
        </div>
      )}

      {/* Floating Hover Tooltip */}
      {hoveredMarker && tooltipPos && (
        <div
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full pb-3 animate-in fade-in zoom-in-95 duration-150"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="rounded-xl border border-white/20 bg-black/85 px-3 py-2 text-center text-white shadow-xl backdrop-blur-md">
            <p className="text-xs font-black">{hoveredMarker.title}</p>
            <p className="text-[10px] text-gray-300">{hoveredMarker.location}</p>
          </div>
        </div>
      )}
    </div>
  );
}
