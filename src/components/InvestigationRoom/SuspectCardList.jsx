export function SuspectCardList({ suspects }) {
  return (
    <div>
      <div className="panel-head">
        <h3>Suspect roster</h3>
      </div>

      <div className="suspect-grid">
        {suspects.map((suspect) => (
          <article key={suspect.id} className="suspect-card">
            <div className="avatar">{suspect.name.charAt(0)}</div>
            <h4>{suspect.name}</h4>
            <p className="minor">{suspect.role}</p>
            <p><strong>Relation:</strong> {suspect.relationToVictim}</p>
            <p><strong>Alibi:</strong> {suspect.alibi}</p>
            <p><strong>Motive:</strong> {suspect.motive}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
