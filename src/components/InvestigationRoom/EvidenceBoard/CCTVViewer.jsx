import { useState } from 'react';

export function CCTVViewer({ logs }) {
  const [selectedLog, setSelectedLog] = useState(logs[0] || null);

  if (!selectedLog) {
    return <p>No CCTV logs available.</p>;
  }

  return (
    <div className="cctv-layout">
      <div className="cctv-monitor">
        <div className="monitor-overlay">
          <span className="record-pill">REC</span>
          <strong>{selectedLog.timestampRange}</strong>
        </div>
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
          alt="Security feed"
        />
      </div>

      <aside className="transcript-panel">
        <h4>Transcript</h4>
        {logs.map((log) => (
          <button key={log.id} className={log.id === selectedLog.id ? 'log-item active' : 'log-item'} onClick={() => setSelectedLog(log)}>
            <strong>{log.cameraLocation}</strong>
            <span>{log.timestampRange}</span>
          </button>
        ))}

        <div className="transcript-box">
          <p>{selectedLog.transcriptLog}</p>
          {selectedLog.notes && <em>{selectedLog.notes}</em>}
        </div>
      </aside>
    </div>
  );
}
