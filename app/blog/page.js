import BlogListingClient from '@/components/blog/BlogListingClient';

export const metadata = {
  title: "Blog | smol Insights",
  description: "Explore the latest insights on link management, digital marketing, and data analytics. Learn how to optimize your digital footprint with smol.",
  openGraph: {
    title: "Blog | smol Insights",
    description: "Mastering the future of link management and marketing data.",
    type: 'website',
  },
};

export default function BlogPage() {
  return <BlogListingClient />;
}
