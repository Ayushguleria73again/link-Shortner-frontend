import PricingCheckoutClient from '@/components/payment/PricingCheckoutClient';

export async function generateMetadata({ params }) {
  const { planId } = await params;
  const capitalized = planId.charAt(0).toUpperCase() + planId.slice(1);

  return {
    title: `Upgrade to ${capitalized} | smol`,
    description: `Complete your transition to the ${capitalized} plan. Unlock premium intelligence, custom domains, and high-performance link management.`,
    robots: {
        index: false,
        follow: false,
    }
  };
}

export default async function PricingCheckoutPage({ params }) {
  const { planId } = await params;
  return <PricingCheckoutClient planId={planId} />;
}
