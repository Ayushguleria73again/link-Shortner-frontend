import { PLANS } from '@/lib/plans';

export async function generateMetadata({ params }) {
  const { planId } = await params;
  const plan = PLANS[planId];
  
  if (!plan) {
    return {
      title: 'Plan Not Found',
    };
  }
  
  return {
    title: `${plan.name} Plan Pricing`,
    description: plan.longDescription,
    openGraph: {
        title: `${plan.name} Plan | smolSaaS`,
        description: plan.description,
    }
  };
}

export default function Layout({ children }) {
    return children;
}
