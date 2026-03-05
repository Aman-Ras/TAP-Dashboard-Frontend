import { getComparison } from '../../lib/api';
import ComparisonClient from './ComparisonClient';

export default async function ComparisonPage() {
  let data = [];

  try {
    data = await getComparison();
  } catch {
    return (
      <div className="text-[var(--danger)] p-8">
        Could not load comparison data. Make sure the backend is running on port 5002.
      </div>
    );
  }

  return <ComparisonClient data={data} />;
}
