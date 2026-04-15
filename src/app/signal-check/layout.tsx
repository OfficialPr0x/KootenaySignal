import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Signal Check | Kootenay Signal',
  description: 'A free 30-second check that shows what\'s costing your business customers. See how visible your business is, what\'s hurting you, and what to fix first.',
};

export default function SignalCheckLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
