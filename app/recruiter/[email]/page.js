import { getRecruiterDetail, getPositions } from '../../../lib/api';
import RecruiterDetailClient from './RecruiterDetailClient';

export default async function RecruiterDetailPage({ params, searchParams }) {
  const email    = decodeURIComponent(params.email);
  const startDate = searchParams?.startDate || '';
  const endDate   = searchParams?.endDate   || '';
  const position  = searchParams?.position  || '';

  let data = null, positions = [];
  try {
    [data, positions] = await Promise.all([
      getRecruiterDetail(email, { startDate, endDate, ...(position ? { position } : {}) }),
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

  return (
    <RecruiterDetailClient
      data={data}
      email={email}
      initialStart={startDate}
      initialEnd={endDate}
      initialPosition={position}
      positions={positions}
    />
  );
}
