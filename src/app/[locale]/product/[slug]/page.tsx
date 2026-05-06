import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { query } from '@/lib/vendure/api';
import { GetProductDetailQuery } from '@/lib/vendure/queries';
import { ProductInfo } from '@/components/commerce/product-info';
import { ProductImageCarousel } from '@/components/commerce/product-image-carousel';
import { RelatedProducts } from '@/components/commerce/related-products';
import { SITE_NAME, truncateDescription } from '@/lib/metadata';
import { getActiveCurrencyCode } from '@/lib/currency-server';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Product' });
  try {
    const result = await query(GetProductDetailQuery, { slug }, { languageCode: locale });
    const product = result.data?.product;
    if (!product) return { title: t('notFound') };
    return {
      title: t('shopProductAt', { name: product.name, siteName: SITE_NAME }),
      description: truncateDescription(product.description),
      openGraph: { images: product.assets[0] ? [{ url: product.assets[0].preview }] : [] },
    };
  } catch {
    return { title: t('notFound') };
  }
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug, locale } = await params;
  const resolvedSearchParams = await searchParams;

  const [productResult, currencyCode] = await Promise.all([
    query(GetProductDetailQuery, { slug }, { languageCode: locale }),
    getActiveCurrencyCode(),
  ]);

  const product = productResult.data?.product;
  if (!product) notFound();

  const firstCollectionSlug = product.collections?.find(
    (c) => c.parent?.id != null && c.parent.id !== '1'
  )?.slug ?? product.collections?.[0]?.slug ?? '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductImageCarousel images={product.assets} />
        <ProductInfo product={product} searchParams={resolvedSearchParams} currencyCode={currencyCode} />
      </div>
      {firstCollectionSlug && (
        <RelatedProducts collectionSlug={firstCollectionSlug} currentProductId={product.id} />
      )}
    </div>
  );
}
