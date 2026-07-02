import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';
import { usePrefersReducedMotion } from '../hooks';
import { ShaderErrorBoundary } from './primitives';

/**
 * Static, GPU-free background used when the visitor prefers reduced motion or
 * when WebGPU/WebGL initialisation fails. Mirrors the calm corporate palette of
 * the animated shader (near-white with a faint teal wash).
 */
function StaticBackground() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(1200px 600px at 72% 18%, rgba(13,122,111,0.10), transparent 60%),' +
          'radial-gradient(900px 520px at 18% 88%, rgba(13,122,111,0.06), transparent 60%),' +
          '#F7F8F9',
      }}
    />
  );
}

/**
 * Animated shader stack, calibrated for a clean corporate environment:
 *  - Swirl        → soft near-white flowing base
 *  - ChromaFlow   → subtle teal liquid that follows the cursor (multiply blend
 *                   so the Swirl reads through the white base)
 *  - FlutedGlass  → gentle ribbed-glass refraction over the layers beneath
 *  - FilmGrain    → barely-there noise for texture
 *
 * FlutedGlass/FilmGrain carry no children, so they filter the preceding
 * sibling generators.
 */
function ShaderCanvas() {
  return (
    <Shader style={{ width: '100%', height: '100%' }}>
      <Swirl colorA="#ffffff" colorB="#f7f8f9" detail={1.2} speed={0.3} />
      <ChromaFlow
        baseColor="#ffffff"
        upColor="#0D7A6F"
        downColor="#0D7A6F"
        leftColor="#0D7A6F"
        rightColor="#0D7A6F"
        momentum={6}
        radius={2.5}
        blendMode="multiply"
      />
      <FlutedGlass refraction={0.2} />
      <FilmGrain strength={0.02} />
    </Shader>
  );
}

/**
 * Full-bleed hero background overlay (absolute · inset-0 · z-10 ·
 * pointer-events-none). Purely decorative, so it is hidden from assistive tech.
 */
export function HeroShader() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden bg-neutral-50"
      aria-hidden="true"
    >
      {reducedMotion ? (
        <StaticBackground />
      ) : (
        <ShaderErrorBoundary fallback={<StaticBackground />}>
          <ShaderCanvas />
        </ShaderErrorBoundary>
      )}
    </div>
  );
}
