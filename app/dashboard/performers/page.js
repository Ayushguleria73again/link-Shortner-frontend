import PerformersTableClient from '@/components/dashboard/PerformersTableClient';

export const metadata = {
  title: "Elite Performers | smol Dashboard",
  description: "Analyze your highest performing links. Identify traffic spikes, engagement leaders, and viral signals across your protocol.",
  robots: {
    index: false,
    follow: false,
  }
};

export default function PerformersPage() {
  return <PerformersTableClient />;
}
