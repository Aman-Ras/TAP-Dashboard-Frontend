import { getCandidates, getPositions, getAllRecruiters } from '../../lib/api';
import CandidatesClient from './CandidatesClient';

export default async function CandidatesPage({ searchParams }) {
  const position      = searchParams?.position  || '';
  const startDate     = searchParams?.startDate || '';
  const endDate       = searchParams?.endDate   || '';
  const recruiterEmail = searchParams?.recruiterEmail || '';

  const apiParams = {};
  if (position)       apiParams.position       = position;
  if (startDate)      apiParams.startDate      = startDate;
  if (endDate)        apiParams.endDate        = endDate;
  if (recruiterEmail) apiParams.recruiterEmail = recruiterEmail;

  let candidates = [], positions = [], recruiters = [];
  try {
    [candidates, positions, recruiters] = await Promise.all([
      getCandidates(apiParams),
      getPositions(),
      getAllRecruiters(),
    ]);
  } catch {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:320 }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:36, marginBottom:12, color:'var(--danger)' }}>⚠</div>
          <p style={{ fontWeight:600, color:'var(--text)' }}>Backend not reachable</p>
          <p style={{ fontSize:13, color:'var(--muted)', marginTop:6 }}>Make sure the server is running on port 5002</p>
        </div>
      </div>
    );
  }

  return (
    <CandidatesClient
      candidates={candidates}
      positions={positions}
      recruiters={recruiters}
      filters={{ position, startDate, endDate, recruiterEmail }}
    />
  );
}
