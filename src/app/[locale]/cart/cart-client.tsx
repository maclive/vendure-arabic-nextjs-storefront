'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Price } from '@/components/commerce/price';
import Image from 'next/image';

interface CartClientProps {
  order: any;
  locale: string;
}

export function CartClient({ order }: CartClientProps) {
  const t = useTranslations('Cart');

  if (!order || order.lines.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted-foreground mb-8">{t('emptyMessage')}</p>
        <Link href="/">
          <Button>{t('continueShopping')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t('title')}</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {order.lines.map((line: any) => (
            <div key={line.id} className="flex gap-4 border rounded-lg p-4">
              {line.featuredAsset && (
                <Image
                  src={line.featuredAsset.preview}
                  alt={line.productVariant.name}
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{line.productVariant.product.name}</p>
                <p className="text-sm text-muted-foreground">{line.productVariant.name}</p>
                <p className="text-sm">{t('sku', { sku: line.productVariant.sku })}</p>
              </div>
              <div className="text-right">
                <Price value={line.linePriceWithTax} currencyCode={order.currencyCode} />
                <p className="text-sm text-muted-foreground">x{line.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border rounded-lg p-6 h-fit space-y-4">
          <h2 className="font-semibold text-lg">{t('orderSummary')}</h2>
          <div className="flex justify-between">
            <span>{t('subtotal')}</span>
            <Price value={order.subTotalWithTax} currencyCode={order.currencyCode} />
          </div>
          <div className="flex justify-between">
            <span>{t('shipping')}</span>
            <span className="text-sm text-muted-foreground">{t('calculatedAtCheckout')}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-4">
            <span>{t('total')}</span>
            <Price value={order.totalWithTax} currencyCode={order.currencyCode} />
          </div>
          <Button className="w-full">{t('proceedToCheckout')}</Button>
        </div>
      </div>
    </div>
  );
}
