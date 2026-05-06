import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/layout/hero-section';
import { FeaturedProducts } from '@/components/commerce/featured-products';
import { SITE_NAME, SITE_URL } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });
  return {
    title: t('pageTitle'),
    description: t('description'),
    openGraph: { title: SITE_NAME, description: t('ogDescription'), url: SITE_URL },
  };
}

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
    </>
  );
}
