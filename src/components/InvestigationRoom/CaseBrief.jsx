export function CaseBrief({ caseData }) {
  return (
    <div>
      <div className="panel-head case-head">
        <div>
          <p className="eyebrow">Case brief</p>
          <h2>{caseData.title}</h2>
        </div>
      </div>

      <p className="synopsis">{caseData.synopsis}</p>

      <div className="victim-card">
        <h3>Victim dossier</h3>
        <p><strong>Name:</strong> {caseData.victim.name}</p>
        <p>{caseData.victim.details}</p>
      </div>
    </div>
  );
}
