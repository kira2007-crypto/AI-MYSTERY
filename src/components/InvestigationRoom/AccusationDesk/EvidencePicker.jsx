export function EvidencePicker({ evidenceOptions, selectedEvidenceId, onSelect }) {
  return (
    <div className="selection-block">
      <label>Key evidence</label>
      <select value={selectedEvidenceId} onChange={(event) => onSelect(event.target.value)}>
        {evidenceOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
