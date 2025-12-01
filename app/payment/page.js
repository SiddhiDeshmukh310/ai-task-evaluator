import { Suspense } from 'react';
import PaymentClient from './PaymentClient';

export default function PaymentPage({ searchParams }) {
  const reportId = searchParams?.reportId ?? null;

  return (
    <Suspense>
      <PaymentClient initialReportId={reportId} />
    </Suspense>
  );
}
