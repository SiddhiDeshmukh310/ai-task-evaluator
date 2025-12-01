import { Suspense } from 'react';
import PaymentClient from './PaymentClient';

export default async function PaymentPage({ searchParams }) {
  const params = await searchParams;
  const reportId = params?.reportId ?? null;

  return (
    <Suspense>
      <PaymentClient initialReportId={reportId} />
    </Suspense>
  );
}
