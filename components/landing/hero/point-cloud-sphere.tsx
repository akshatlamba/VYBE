"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { sphereVertexShader, sphereFragmentShader } from "./sphere-shaders";

interface PointCloudSphereProps {
  className?: string;
  onLoaded?: () => void;
}

export function PointCloudSphere({ className = "", onLoaded }: PointCloudSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [glowOpacity, setGlowOpacity] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Viewport dimensions
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    // Detect mobile device
    const isMobile = width < 768;
    const particleCount = isMobile ? 2500 : 7000;
    const haloCount = isMobile ? 120 : 320;
    const totalCount = particleCount + haloCount;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Group for parallax tilt and rotation
    const pointsGroup = new THREE.Group();
    scene.add(pointsGroup);

    // ============================================================
    // GEOMETRY & FIBONACCI POINT DISTRIBUTION
    // ============================================================
    const geometry = new THREE.BufferGeometry();
    const initialPos = new Float32Array(totalCount * 3);
    const targetPos = new Float32Array(totalCount * 3);
    const phases = new Float32Array(totalCount);
    const sizes = new Float32Array(totalCount);

    const radius = 1.0;
    const phi = Math.PI * (3.0 - Math.sqrt(5.0)); // Golden ratio angle

    for (let i = 0; i < particleCount; i++) {
      // Fibonacci sphere mapping
      const y = 1 - (i / (particleCount - 1)) * 2; // -1 to 1
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;

      const tx = Math.cos(theta) * r * radius;
      const ty = y * radius;
      const tz = Math.sin(theta) * r * radius;

      // Surface target position
      targetPos[i * 3] = tx;
      targetPos[i * 3 + 1] = ty;
      targetPos[i * 3 + 2] = tz;

      // Initial scattered position (dispersed outward / cosmic cloud)
      const spread = 2.5 + Math.random() * 2.0;
      const angle = Math.random() * Math.PI * 2;
      const elev = (Math.random() - 0.5) * Math.PI;
      initialPos[i * 3] = Math.cos(angle) * Math.cos(elev) * spread;
      initialPos[i * 3 + 1] = Math.sin(elev) * spread;
      initialPos[i * 3 + 2] = Math.sin(angle) * Math.cos(elev) * spread;

      phases[i] = Math.random();
      sizes[i] = 0.85 + Math.random() * 0.45;
    }

    // Halo Stray Particles (Radius 1.06 to 1.35)
    for (let j = 0; j < haloCount; j++) {
      const idx = particleCount + j;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phiAngle = Math.acos(2.0 * v - 1.0);
      const haloR = radius * (1.06 + Math.random() * 0.3);

      const hx = haloR * Math.sin(phiAngle) * Math.cos(theta);
      const hy = haloR * Math.sin(phiAngle) * Math.sin(theta);
      const hz = haloR * Math.cos(phiAngle);

      targetPos[idx * 3] = hx;
      targetPos[idx * 3 + 1] = hy;
      targetPos[idx * 3 + 2] = hz;

      const spread = 3.5 + Math.random() * 2.5;
      initialPos[idx * 3] = (hx / haloR) * spread;
      initialPos[idx * 3 + 1] = (hy / haloR) * spread;
      initialPos[idx * 3 + 2] = (hz / haloR) * spread;

      phases[idx] = Math.random();
      sizes[idx] = 0.6 + Math.random() * 0.35; // slightly smaller halo particles
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(targetPos, 3));
    geometry.setAttribute("aInitialPos", new THREE.BufferAttribute(initialPos, 3));
    geometry.setAttribute("aTargetPos", new THREE.BufferAttribute(targetPos, 3));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    // Custom Shader Material
    const material = new THREE.ShaderMaterial({
      vertexShader: sphereVertexShader,
      fragmentShader: sphereFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0.0 },
        uIntroProgress: { value: prefersReducedMotion ? 1.0 : 0.0 },
        uMouse: { value: new THREE.Vector2(999, 999) },
        uMouseRadius: { value: 0.38 },
        uMouseStrength: { value: 0.35 },
        uDpr: { value: Math.min(window.devicePixelRatio || 1, 2) },
        uColorCore: { value: new THREE.Color("#FFFFFF") },
        uColorFringe: { value: new THREE.Color("#E2D9FC") }, // subtle lilac fringe
      },
    });

    const pointCloud = new THREE.Points(geometry, material);
    pointsGroup.add(pointCloud);

    // ============================================================
    // MOUSE INTERACTION & SMOOTHING
    // ============================================================
    const mouseTarget = new THREE.Vector2(999, 999);
    const mouseCurrent = new THREE.Vector2(999, 999);
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e) {
        if (e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else return;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Normalized coordinates within container (-1 to 1)
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      mouseTarget.set(x * 1.1, y * 1.1);

      // Sphere parallax tilt target (+-0.22 rad)
      targetRotationY = x * 0.22;
      targetRotationX = -y * 0.22;
    };

    const handlePointerLeave = () => {
      // Spring back to off-screen
      mouseTarget.set(999, 999);
      targetRotationX = 0;
      targetRotationY = 0;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    container.addEventListener("mouseleave", handlePointerLeave);
    container.addEventListener("touchend", handlePointerLeave);

    // ============================================================
    // TIMELINE ORCHESTRATION & RENDER LOOP
    // ============================================================
    let isVisible = true;
    let animationFrameId: number;
    const startTime = performance.now();

    // IntersectionObserver to pause rendering when hero is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = (now - startTime) / 1000;
      material.uniforms.uTime.value = elapsed;

      // Intro timing:
      // 0.0 - 1.6s: Sphere is hidden (uIntroProgress = 0.0)
      // 1.6 - 3.4s: Sphere coalesces inward from scatter into cohesive sphere surface
      // 3.4s+: Fully assembled settled state
      if (!prefersReducedMotion) {
        if (elapsed < 1.6) {
          material.uniforms.uIntroProgress.value = 0.0;
          setGlowOpacity(0);
        } else if (elapsed <= 3.4) {
          const progress = (elapsed - 1.6) / 1.8;
          // Smooth cubic in-out curve
          const eased =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          material.uniforms.uIntroProgress.value = Math.min(1.0, Math.max(0.0, eased));
          setGlowOpacity(Math.min(1.0, eased));
        } else {
          material.uniforms.uIntroProgress.value = 1.0;
          setGlowOpacity(1);
        }
      }

      // Smooth mouse lerp (elastic lag & spring back ~0.15-0.2)
      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.16;
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.16;
      material.uniforms.uMouse.value.copy(mouseCurrent);

      // Continuous subtle idle rotation
      pointsGroup.rotation.y += 0.0022;

      // Smooth parallax tilt dampening
      pointsGroup.rotation.x += (targetRotationX - pointsGroup.rotation.x) * 0.08;
      pointsGroup.rotation.z += (targetRotationY * 0.3 - pointsGroup.rotation.z) * 0.08;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);
    if (onLoaded) onLoaded();

    // ============================================================
    // RESIZE LISTENER
    // ============================================================
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      material.uniforms.uDpr.value = Math.min(window.devicePixelRatio || 1, 2);
    };

    window.addEventListener("resize", handleResize);

    // ============================================================
    // CLEANUP & DISPOSAL ON UNMOUNT
    // ============================================================
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      container.removeEventListener("mouseleave", handlePointerLeave);
      container.removeEventListener("touchend", handlePointerLeave);
      window.removeEventListener("resize", handleResize);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onLoaded]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Deep Violet Radial Glow behind the sphere */}
      <div
        className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-[#6366F1]/30 via-[#7C3AED]/22 to-[#A855F7]/15 blur-[90px] pointer-events-none transition-opacity duration-1000 -z-10"
        style={{
          opacity: glowOpacity,
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%",
        }}
        aria-hidden="true"
      />

      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center pointer-events-auto"
        aria-hidden="true"
      />
    </div>
  );
}

export default PointCloudSphere;
