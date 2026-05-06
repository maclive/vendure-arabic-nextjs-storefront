import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { query } from '@/lib/vendure/api';
import { SearchProductsQuery } from '@/lib/vendure/queries';
import { ProductGrid } from '@/components/commerce/product-grid';
import { FacetFilters } from '@/components/commerce/facet-filters';
import { SITE_NAME } from '@/lib/metadata';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; sort?: string; facets?: string; page?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { q } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'Search' });
  return {
    title: q ? t('resultsTitle', { query: q }) : t('pageTitle'),
    description: q
      ? t('metaDescription', { query: q, siteName: SITE_NAME })
      : t('metaCatalogDescription', { siteName: SITE_NAME }),
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q = '', sort, facets, page } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'Search' });

  const currentPage = parseInt(page ?? '1', 10);
  const take = 24;
  const selectedFacets = facets ? facets.split(',').filter(Boolean) : [];
  const [sortKey, sortOrder] = sort ? sort.split('_') : ['', ''];

  const productDataPromise = query(SearchProductsQuery, {
    input: {
      term: q,
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
      <h1 className="text-2xl font-bold mb-6">
        {q ? t('resultsFor', { query: q }) : t('pageTitle')}
      </h1>
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
