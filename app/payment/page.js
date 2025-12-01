import { Suspense } from 'react';
import PaymentClient from './PaymentClient';

export const dynamic = 'force-dynamic';

export default function PaymentPage({ searchParams }) {
  const reportId = searchParams?.reportId ?? null;

  return (
    <Suspense fallback={<div>Loading payment...</div>}>
      <PaymentClient initialReportId={reportId} />
    </Suspense>
  );
}
