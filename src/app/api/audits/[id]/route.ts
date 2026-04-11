import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const audit = await prisma.audit.findFirst({
    where: {
      id,
      clerkUserId: userId,
    },
  });

  if (!audit) {
    return Response.json({ error: 'Audit not found' }, { status: 404 });
  }

  return Response.json({ audit });
}
