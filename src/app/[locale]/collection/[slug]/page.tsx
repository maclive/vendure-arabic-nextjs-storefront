import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { query } from '@/lib/vendure/api';
import { SearchProductsQuery, GetCollectionProductsQuery } from '@/lib/vendure/queries';
import { ProductGrid } from '@/components/commerce/product-grid';
import { FacetFilters } from '@/components/commerce/facet-filters';
import { SITE_NAME, truncateDescription } from '@/lib/metadata';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ sort?: string; facets?: string; page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Product' });
  try {
    const result = await query(GetCollectionProductsQuery, {
      slug, input: { collectionSlug: slug, take: 1, groupByProduct: true },
    }, { languageCode: locale });
    const collection = result.data?.collection;
    if (!collection) return { title: t('collectionNotFound') };
    return {
      title: t('browseCollectionAt', { name: collection.name, siteName: SITE_NAME }),
      description: truncateDescription(collection.description),
    };
  } catch {
    return { title: t('collectionNotFound') };
  }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug, locale } = await params;
  const { sort, facets, page } = await searchParams;

  const currentPage = parseInt(page ?? '1', 10);
  const take = 24;
  const selectedFacets = facets ? facets.split(',').filter(Boolean) : [];
  const [sortKey, sortOrder] = sort ? sort.split('_') : ['', ''];

  // First get collection info
  const collectionResult = await query(GetCollectionProductsQuery, {
    slug, input: { collectionSlug: slug, take: 1, groupByProduct: true },
  }, { languageCode: locale });

  const collection = collectionResult.data?.collection;
  if (!collection) notFound();

  // Then get products with full search query
  const productDataPromise = query(SearchProductsQuery, {
    input: {
      collectionSlug: slug,
      take,
      skip: (currentPage - 1) * take,
      groupByProduct: true,
      facetValueIds: selectedFacets,
      sort: sortKey === 'price'
        ? { price: sortOrder === 'asc' ? 'ASC' : 'DESC' }
        : sortKey === 'name'
        ? { name: sortOrder === 'asc' ? 'ASC' : 'DESC' }
        : undefined,
    },
  }, { languageCode: locale });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>
      {collection.description && (
        <p className="text-muted-foreground mb-6">{collection.description}</p>
      )}
      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <FacetFilters productDataPromise={productDataPromise} />
        </aside>
        <div className="flex-1">
          <ProductGrid productDataPromise={productDataPromise} currentPage={currentPage} take={take} />
        </div>
      </div>
    </div>
  );
}
