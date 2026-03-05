import { getAllRecruiters, getPositions } from '../../lib/api';
import RecruiterTable from '../../components/RecruiterTable';
import OverviewFilterBar from '../../components/OverviewFilterBar';

export default async function RecruitersPage({ searchParams }) {
  const position  = searchParams?.position  || '';
  const startDate = searchParams?.startDate || '';
  const endDate   = searchParams?.endDate   || '';

  const apiParams = {};
  if (position)  apiParams.position  = position;
  if (startDate) apiParams.startDate = startDate;
  if (endDate)   apiParams.endDate   = endDate;

  let recruiters = [], positions = [];
  try {
    [recruiters, positions] = await Promise.all([
      getAllRecruiters(apiParams),
      getPositions(),
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

  const periodLabel = startDate || endDate ? `${startDate || '…'} → ${endDate || '…'}` : null;

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <h1 className="page-title">Recruiters</h1>
          <p className="page-sub">
            {recruiters.length} recruiter{recruiters.length !== 1 ? 's' : ''}
            {position && <> · <span style={{ color:'var(--info)' }}>{position}</span></>}
            {periodLabel && <> · <span style={{ color:'var(--warning)' }}>{periodLabel}</span></>}
          </p>
        </div>
      </div>

      <OverviewFilterBar
        positions={positions}
        currentPosition={position}
        currentStart={startDate}
        currentEnd={endDate}
      />

      <RecruiterTable data={recruiters} />
    </div>
  );
}
