'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import DashboardTitle from '@/components/dashboard-title';
import EmailTable from '@/components/email-table';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { getEmails } from '@/lib/api';
import { useConfig } from '@/lib/config-context';
import { Email } from '@/lib/types';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const { source } = useConfig();

  const fetchEmails = useCallback(async () => {
    if (!source) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await getEmails(source);
      const data = response.data.data['emails'];

      setEmails(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, [source]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  return (
    <div className="flex h-screen flex-col space-y-6">
      <DashboardTitle>Email Management</DashboardTitle>
      <div className="flex flex-row items-center justify-between gap-x-4">
        <Link href="/dashboard/alert-management">
          <Button className="ml-auto" variant={'outline'}>
            <ArrowLeft />
            Back
          </Button>
        </Link>
        {/* </Link> */}
      </div>
      {isLoading && <Loading />}
      {error && <div className="text-center text-red-500">{error}</div>}
      <EmailTable emails={emails} />
    </div>
  );
}
