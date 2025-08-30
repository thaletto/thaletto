import { Suspense } from 'react';
import { getPortfolioData } from '@/functions';
import PageClient from './page-client';

export default async function Personal() {
  const data = await getPortfolioData();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageClient data={data} />
    </Suspense>
  );
}
