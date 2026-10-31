export function DeductionInput({ value, onChange }) {
  return (
    <div className="selection-block">
      <label>Explain your deduction</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Describe the contradiction, timeline mismatch, or physical evidence that proves guilt..."
      />
    </div>
  );
}
