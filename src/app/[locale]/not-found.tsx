import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export default async function NotFound() {
  const t = await getTranslations('NotFound');
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-4">{t('title')}</h2>
      <p className="text-muted-foreground mb-8">{t('message')}</p>
      <Link href="/">
        <Button>{t('goHome')}</Button>
      </Link>
    </div>
  );
}
