'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function Refresh() {
  const r = useRouter();
  useEffect(() => { const t = setInterval(() => r.refresh(), 5000); return () => clearInterval(t); }, [r]);
  return null;
}
