const createSuspect = (id, name, role, relation, alibi, motive) => ({
  id,
  name,
  role,
  relationToVictim: relation,
  alibi,
  motive,
  avatarUrl: ''
});

const makeTimestamp = (hour, minute) => `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

export function generateCaseFromPrompt(prompt) {
  const safePrompt = (prompt || '').trim() || 'A wealthy museum curator is murdered during a stormy gala';
  const suspects = [
    createSuspect(
      'suspect_1',
      'Mara Quinn',
      'Executive Assistant',
      'She managed the victim\'s schedule and finances.',
      'Mara insists she remained in the office until 9:30 PM, preparing invoices and speaking to vendors.',
      'She was secretly blackmailed for a forged signature and feared exposure.'
    ),
    createSuspect(
      'suspect_2',
      'Victor Hale',
      'Business Partner',
      'He co-owned the museum expansion project with the victim.',
      'Victor claims he was in the lobby arguing with a contractor until 9:05 PM.',
      'He stood to lose a major investment and a board seat if the victim exposed financial fraud.'
    ),
    createSuspect(
      'suspect_3',
      'Dorian Vale',
      'Private Security Chief',
      'He was responsible for the building and night patrols.',
      'Dorian says he was checking the rooftop perimeter from 8:50 PM to 9:20 PM after hearing an alarm.',
      'He resented the victim\'s refusal to approve a security upgrade and feared scandal.'
    )
  ];

  const culpritId = 'suspect_3';
  const culpritName = 'Dorian Vale';

  const caseObject = {
    title: 'The Glass Vault at Midnight',
    synopsis: `During a storm-heavy gala, ${safePrompt}, the victim is found dead in the glass vault. The room is locked, the alarms were active, and every guest has an explanation. Only one motive and one discrepancy hold the truth together.`,
    victim: {
      name: 'Elias Mercer',
      details: 'A celebrated collector and founder of the Meridian Museum. Known for meticulous discipline, private financial dealings, and a habit of auditing staff at the end of each night.'
    },
    suspects,
    evidence: {
      chats: [
        {
          id: 'chat_1',
          title: 'Mara to Victor',
          participants: ['Mara Quinn', 'Victor Hale'],
          messages: [
            { sender: 'Mara Quinn', recipient: 'Victor Hale', timestamp: '[09:12 PM]', text: 'u sure he didnt leave the vault early? i saw his light still on' },
            { sender: 'Victor Hale', recipient: 'Mara Quinn', timestamp: '[09:14 PM]', text: 'he was in there. i left before the storm hit. dont mention this to anyone' },
            { sender: 'Mara Quinn', recipient: 'Victor Hale', timestamp: '[09:18 PM]', text: 'i already told security to lock the east wing. its fine' }
          ]
        },
        {
          id: 'chat_2',
          title: 'Dorian to Staff',
          participants: ['Dorian Vale', 'Night Team'],
          messages: [
            { sender: 'Dorian Vale', recipient: 'Night Team', timestamp: '[08:47 PM]', text: 'Roofs clear. keep the west stairwell gated until i say otherwise.' },
            { sender: 'Night Team', recipient: 'Dorian Vale', timestamp: '[08:57 PM]', text: 'copy. cam 4 shows a figure near the glass vault at 9:03' },
            { sender: 'Dorian Vale', recipient: 'Night Team', timestamp: '[09:06 PM]', text: 'ignore that. patrol is on the south corridor. no one enters the vault' }
          ]
        }
      ],
      cctvLogs: [
        {
          id: 'cam_1',
          cameraLocation: 'East Corridor',
          timestampRange: '2026-10-30 21:02:44 - 21:05:11',
          transcriptLog: '21:02:44 - Figure in black coat enters east corridor. 21:04:06 - Stops outside glass vault. 21:05:11 - Turns back toward stairwell.',
          notes: 'The figure matches Dorian\'s build and gait.'
        },
        {
          id: 'cam_2',
          cameraLocation: 'South Stairwell',
          timestampRange: '2026-10-30 21:11:12 - 21:17:50',
          transcriptLog: '21:11:12 - Dorian Vale observed on stairwell camera carrying a metal key case. 21:14:08 - Key case jangles against rail. 21:17:50 - Dorian exits the stairwell heading toward the archive room.',
          notes: 'This directly contradicts his alibi of roaming the rooftop perimeter.'
        }
      ],
      images: [
        {
          id: 'img_1',
          title: 'Smudged Glass and Keyprint',
          imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
          promptUsed: 'A close-up of a fingerprint smudge on a glass display case with a key ring imprint and faint rainwater streaks',
          description: 'A faint fingerprint pattern on the vault glass includes the metal ridges from a security keyring, matching Dorian\'s equipment.'
        },
        {
          id: 'img_2',
          title: 'Security Still of the Stairs',
          imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
          promptUsed: 'A dark hallway surveillance still showing a figure in a security uniform moving through a stairwell at night',
          description: 'The figure is holding a key case and moving away from the rooftop route toward the archive room.'
        }
      ]
    },
    solution: {
      culpritId,
      culpritName,
      motiveBreakdown: 'Dorian was trying to conceal a deliberate security lapse and to stop Elias from exposing the breach. The victim had discovered the missing access logs and intended to fire Dorian.',
      smokingGunEvidenceId: 'cam_2',
      fullExplanation: 'Dorian is guilty because his rooftop alibi fails against the south stairwell CCTV, which shows him carrying the access key case at 21:14. The security log also places him near the glass vault after the victim was last seen alive. His own chat logs mention shutting down the east wing and instructing staff to ignore a suspicious figure. The keyring imprint on the vault glass confirms he handled the lock directly. The motive is clear: Elias planned to expose the security breach and remove Dorian from the leadership team.'
    }
  };

  return caseObject;
}
