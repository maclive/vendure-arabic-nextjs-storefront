import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { query } from '@/lib/vendure/api';
import { GetActiveOrderQuery } from '@/lib/vendure/queries';
import { getAuthToken } from '@/lib/auth';
import { CartClient } from './cart-client';
import { Skeleton } from '@/components/ui/skeleton';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Cart' });
  return { title: t('title') };
}

async function CartContent({ locale }: { locale: string }) {
  const token = await getAuthToken();
  const result = await query(GetActiveOrderQuery, undefined, { token });
  const order = result.data?.activeOrder ?? null;
  return <CartClient order={order} locale={locale} />;
}

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <CartContent locale={locale} />
    </Suspense>
  );
}
