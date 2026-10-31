import { useMemo, useState } from 'react';
import { api } from './services/api';
import { ScenarioInput } from './components/CaseCreator/ScenarioInput';
import { GenerationLoader } from './components/CaseCreator/GenerationLoader';
import { CaseBrief } from './components/InvestigationRoom/CaseBrief';
import { SuspectCardList } from './components/InvestigationRoom/SuspectCardList';
import { EvidenceTabs } from './components/InvestigationRoom/EvidenceBoard/EvidenceTabs';
import { SuspectPicker } from './components/InvestigationRoom/AccusationDesk/SuspectPicker';
import { EvidencePicker } from './components/InvestigationRoom/AccusationDesk/EvidencePicker';
import { DeductionInput } from './components/InvestigationRoom/AccusationDesk/DeductionInput';
import { VerdictModal } from './components/Verdict/VerdictModal';

export default function App() {
  const [prompt, setPrompt] = useState('A wealthy collector is found dead in a museum vault during a stormy gala.');
  const [caseData, setCaseData] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [selectedSuspectId, setSelectedSuspectId] = useState('');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState('');
  const [deductionReasoning, setDeductionReasoning] = useState('');
  const [loading, setLoading] = useState(false);

  const evidenceOptions = useMemo(() => {
    if (!caseData?.evidence) return [];
    return [
      ...caseData.evidence.chats.map(item => ({ id: item.id, label: `${item.title} (Chat)`, type: 'chat' })),
      ...caseData.evidence.cctvLogs.map(item => ({ id: item.id, label: `${item.cameraLocation} (CCTV)`, type: 'cctv' })),
      ...caseData.evidence.images.map(item => ({ id: item.id, label: `${item.title} (Image)`, type: 'image' }))
    ];
  }, [caseData]);

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || trimmedPrompt.length < 10) {
      alert('Please enter a longer mystery prompt before generating a case.');
      return;
    }

    setLoading(true);
    setVerdict(null);

    try {
      const response = await api.post('/cases/generate', {
        scenarioPrompt: trimmedPrompt
      });

      setCaseData(response.data);
      setSelectedSuspectId(response.data.suspects[0]?.id || '');
      setSelectedEvidenceId(response.data.evidence?.cctvLogs[0]?.id || '');
      setDeductionReasoning('');
    } catch (error) {
      console.error(error);
      alert('Failed to generate the mystery case.');
    } finally {
      setLoading(false);
    }
  };

  const handleSolve = async () => {
    if (!caseData) return;

    if (!selectedSuspectId || !selectedEvidenceId || deductionReasoning.trim().length < 10) {
      alert('Select a suspect, evidence item, and provide a detailed deduction before submitting.');
      return;
    }

    try {
      const response = await api.post(`/cases/${caseData.caseId}/solve`, {
        selectedSuspectId,
        evidenceIdCited: selectedEvidenceId,
        deductionReasoning: deductionReasoning.trim()
      });
      setVerdict(response.data);
    } catch (error) {
      console.error(error);
      alert('Unable to evaluate your accusation.');
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AI-generated investigation room</p>
          <h1>AI Mystery Room</h1>
        </div>
      </header>

      <main className="layout">
        <section className="panel generator-panel">
          <ScenarioInput value={prompt} onChange={setPrompt} onGenerate={handleGenerate} />
          {loading && <GenerationLoader />}
        </section>

        {caseData && (
          <>
            <section className="panel">
              <CaseBrief caseData={caseData} />
            </section>

            <section className="panel">
              <SuspectCardList suspects={caseData.suspects} />
            </section>

            <section className="panel evidence-panel">
              <EvidenceTabs evidence={caseData.evidence} />
            </section>

            <section className="panel accusation-panel">
              <div className="accusation-header">
                <h3>Accusation Desk</h3>
              </div>

              <SuspectPicker
                suspects={caseData.suspects}
                selectedSuspectId={selectedSuspectId}
                onSelect={setSelectedSuspectId}
              />

              <EvidencePicker
                evidenceOptions={evidenceOptions}
                selectedEvidenceId={selectedEvidenceId}
                onSelect={setSelectedEvidenceId}
              />

              <DeductionInput value={deductionReasoning} onChange={setDeductionReasoning} />

              <button className="primary-button" onClick={handleSolve}>
                Submit Accusation
              </button>
            </section>
          </>
        )}
      </main>

      {verdict && <VerdictModal verdict={verdict} onClose={() => setVerdict(null)} />}
    </div>
  );
}
