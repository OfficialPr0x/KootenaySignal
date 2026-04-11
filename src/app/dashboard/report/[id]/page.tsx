import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import ReportContent from './ReportContent';

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { id } = await params;

  const audit = await prisma.audit.findFirst({
    where: { id, clerkUserId: userId },
  });

  if (!audit) redirect('/dashboard');

  return <ReportContent audit={JSON.parse(JSON.stringify(audit))} />;
}
