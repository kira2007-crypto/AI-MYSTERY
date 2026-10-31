export function SuspectPicker({ suspects, selectedSuspectId, onSelect }) {
  return (
    <div className="selection-block">
      <label>Choose suspect</label>
      <div className="option-grid">
        {suspects.map((suspect) => (
          <button
            key={suspect.id}
            className={suspect.id === selectedSuspectId ? 'choice-card selected' : 'choice-card'}
            onClick={() => onSelect(suspect.id)}
          >
            {suspect.name}
          </button>
        ))}
      </div>
    </div>
  );
}
