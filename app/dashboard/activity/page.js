import ActivityStreamClient from '@/components/dashboard/ActivityStreamClient';

export const metadata = {
  title: "Activity Stream | smol Dashboard",
  description: "Monitor real-time link interaction signals, geographical distribution, and device metrics as they happen.",
  robots: {
    index: false,
    follow: false,
  }
};

export default function ActivityPage() {
  return <ActivityStreamClient />;
}
