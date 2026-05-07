import { routing } from '@/i18n/routing';   // أو المسار الصحيح بتاع routing

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getActiveCustomer } from '@/lib/vendure/actions';
import { AccountNavLinks } from '@/components/account/account-nav-links';
export const dynamic = 'force-dynamic';
const accountNavItems = [
  { href: '/account', labelKey: 'profile', icon: 'user' },
  { href: '/account/orders', labelKey: 'orders', icon: 'package' },
  { href: '/account/addresses', labelKey: 'addresses', icon: 'map-pin' },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Account' });
  return { title: t('pageTitle') };
}

export default async function AccountPage() {
  const customer = await getActiveCustomer();
  if (!customer) redirect('/sign-in');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <AccountNavLinks items={accountNavItems} layout="vertical" />
        </aside>
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-bold mb-4">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-muted-foreground">{customer.emailAddress}</p>
        </div>
      </div>
    </div>
  );
}
