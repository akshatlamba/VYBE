/**
 * Custom GLSL Shaders for VYBE 3D Point-Cloud Sphere
 * Features:
 * - Fibonacci point-cloud distribution with smooth radial attenuation
 * - Coalescence animation (uIntroProgress: 0.0 -> 1.0)
 * - Mouse repulsion with tangential swirl in screen space
 * - Continuous breathing wave and micro-shimmer
 * - Soft round circular points via gl_PointCoord
 */

export const sphereVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntroProgress;
  uniform vec2 uMouse;
  uniform float uMouseRadius;
  uniform float uMouseStrength;
  uniform float uDpr;

  attribute vec3 aInitialPos;
  attribute vec3 aTargetPos;
  attribute float aPhase;
  attribute float aSize;

  varying float vShimmer;
  varying float vDistToMouse;
  varying float vAlpha;

  void main() {
    // 1. Smooth coalescence from scattered space into sphere surface
    // Using cubic smoothstep easing for silky organic arrival
    float t = smoothstep(0.0, 1.0, uIntroProgress);
    vec3 basePos = mix(aInitialPos, aTargetPos, t);

    // 2. Continuous breathing wave
    float breath = sin(uTime * 1.4 + aPhase * 6.28318) * 0.028;
    vec3 pos = basePos * (1.0 + breath);

    // 3. World / view transformation
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vec4 viewPos = viewMatrix * worldPos;

    // Projected 2D coordinates for screen-space cursor interaction
    vec2 screenPos = viewPos.xy / -viewPos.z;
    float mouseDist = distance(screenPos, uMouse);
    vDistToMouse = mouseDist;

    // 4. Mouse repulsion and swirling interaction (active only when intro is settled)
    if (uIntroProgress > 0.3 && mouseDist < uMouseRadius) {
      float factor = smoothstep(uMouseRadius, 0.0, mouseDist);
      vec2 dir = normalize(screenPos - uMouse + vec2(0.0001));

      // Tangential perpendicular vector for subtle vortex swirl
      vec2 swirlDir = vec2(-dir.y, dir.x);

      // Displace along repulsion direction + swirl
      pos.xy += (dir * 0.75 + swirlDir * 0.35) * factor * uMouseStrength * (1.0 + breath);
      pos.z += factor * 0.18; // Slight forward elastic push
    }

    // 5. Per-particle shimmer wave
    vShimmer = 0.72 + 0.28 * sin(uTime * 3.2 + aPhase * 12.566);
    vAlpha = t; // Fade opacity in sync with intro progress

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Point size with distance attenuation and cursor proximity enlargement
    float proximityBonus = smoothstep(uMouseRadius, 0.0, mouseDist) * 0.45;
    gl_PointSize = (aSize * 22.0 * (1.0 / -mvPosition.z) * uDpr) * (1.0 + proximityBonus);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const sphereFragmentShader = /* glsl */ `
  varying float vShimmer;
  varying float vDistToMouse;
  varying float vAlpha;

  uniform vec3 uColorCore;
  uniform vec3 uColorFringe;

  void main() {
    // Round circular dots via gl_PointCoord (discard outer corners)
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Smooth soft radial falloff (soft glowing spheres, no harsh pixel edges)
    float radial = smoothstep(0.5, 0.06, dist);
    float finalAlpha = radial * vShimmer * vAlpha;

    // Proximity brightening near cursor
    float cursorGlow = smoothstep(0.35, 0.0, vDistToMouse) * 0.35;

    // Core is crisp white; fringe carries a soft violet/lilac hint
    vec3 color = mix(uColorFringe, uColorCore, smoothstep(0.4, 0.0, dist));
    color += vec3(cursorGlow);

    gl_FragColor = vec4(color, finalAlpha);
  }
`;
