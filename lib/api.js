const BASE = 'http://localhost:5002/api/dashboard';

async function apiFetch(path) {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export const getPositions = () => apiFetch('/positions');
export const getOverview = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/overview${qs ? '?' + qs : ''}`);
};
export const getAllRecruiters = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/recruiters${qs ? '?' + qs : ''}`);
};
export const getRecruiterDetail = (email, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/recruiter/${encodeURIComponent(email)}${qs ? '?' + qs : ''}`);
};
export const getInterviews = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/interviews${qs ? '?' + qs : ''}`);
};
export const getResumeSessions = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/resume-sessions${qs ? '?' + qs : ''}`);
};
export const getComparison = () => apiFetch('/comparison');
export const getCandidates = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/candidates${qs ? '?' + qs : ''}`);
};
