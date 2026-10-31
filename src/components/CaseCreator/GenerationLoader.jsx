export function GenerationLoader() {
  return (
    <div className="loader-box" aria-live="polite">
      <div className="loader-dots">
        <span />
        <span />
        <span />
      </div>
      <p>Generating evidence, suspects, and contradictions...</p>
    </div>
  );
}
