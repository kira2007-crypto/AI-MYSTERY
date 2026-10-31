export function ScenarioInput({ value, onChange, onGenerate }) {
  const presets = [
    'A wealthy collector is found dead in a museum vault during a stormy gala.',
    'A famous chef is poisoned at a private penthouse dinner after a power outage.',
    'A biotech founder vanishes during a luxury yacht party on a black-water night.'
  ];

  return (
    <div className="scenario-panel">
      <div className="panel-head">
        <h2>Build a case</h2>
      </div>

      <div className="preset-row">
        {presets.map((preset) => (
          <button key={preset} className="preset-button" onClick={() => onChange(preset)}>
            {preset}
          </button>
        ))}
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Describe the crime scene, victim, and setting..."
      />

      <button className="primary-button" onClick={onGenerate}>Generate Mystery Case</button>
    </div>
  );
}
