export function VerdictModal({ verdict, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="verdict-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>{verdict.verdictTitle}</h3>
        <p className="verdict-score">Score: {verdict.score}/100</p>
        <p>{verdict.aiEvaluation}</p>

        <div className="solution-box">
          <h4>Reveal</h4>
          <p><strong>Culprit:</strong> {verdict.solution.culpritName}</p>
          <p><strong>Motive:</strong> {verdict.solution.motiveBreakdown}</p>
          <p>{verdict.solution.fullExplanation}</p>
        </div>
      </div>
    </div>
  );
}
