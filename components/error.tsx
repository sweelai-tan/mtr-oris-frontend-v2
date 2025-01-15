'use client';

export default function Error({ children }: { children: React.ReactNode }) {
  return <div className="text-center text-red-500">{children}</div>;
}
