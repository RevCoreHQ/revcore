// Native scroll — Lenis removed to eliminate JS-driven scroll latency.
// The browser handles momentum and inertia natively with zero overhead.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
