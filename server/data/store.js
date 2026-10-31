export const cases = new Map();

export function saveCase(caseDoc) {
  const id = caseDoc.caseId || caseDoc._id || `case_${Date.now()}`;
  cases.set(id, caseDoc);
  return caseDoc;
}

export function getCaseById(id) {
  return cases.get(id) || null;
}

export function sanitizeCase(caseDoc) {
  if (!caseDoc) return null;
  const { solution, ...rest } = caseDoc;
  return rest;
}
