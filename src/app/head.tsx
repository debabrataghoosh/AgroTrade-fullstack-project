import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AgroTrade - Your Trusted Agricultural Marketplace',
  description: 'Buy and sell fresh farm produce, grains, spices, and agricultural products directly from farmers and verified sellers.',
  keywords: 'agriculture, farming, produce, marketplace, organic, fresh food',
  authors: [{ name: 'AgroTrade Team' }],
  openGraph: {
    title: 'AgroTrade - Your Trusted Agricultural Marketplace',
    description: 'Buy and sell fresh farm produce, grains, spices, and agricultural products directly from farmers and verified sellers.',
    type: 'website',
  },
};

export default function Head() {
  return (
    <>
      <title>AgroTrade</title>
      <meta name="description" content="Agricultural trading platform for farmers and buyers" />
    </>
  );
} 