import PublicProfileClient from '@/components/profile/PublicProfileClient';
import { notFound } from 'next/navigation';

async function getProfile(username) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/${username}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export async function generateMetadata({ params }) {
  const { username } = await params;
  const data = await getProfile(username);

  if (!data) {
    return {
      title: 'Profile Not Found | smol',
    };
  }

  const { profile } = data;
  return {
    title: `${profile.displayName || profile.username} (@${profile.username}) | smol`,
    description: profile.bio || `View the verified digital identity and curated links of ${profile.displayName || profile.username}.`,
    openGraph: {
      title: `${profile.displayName || profile.username} | smol Profile`,
      description: profile.bio,
      images: profile.avatar ? [{ url: profile.avatar }] : [],
    },
  };
}

export default async function PublicProfilePage({ params }) {
  const { username } = await params;
  const data = await getProfile(username);

  if (!data) {
    notFound();
  }

  return <PublicProfileClient data={data} />;
}
