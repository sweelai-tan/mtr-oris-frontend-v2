'use client';

import { useCallback, useEffect, useState } from 'react';

import DashboardTitle from '@/components/dashboard-title';
import EventVideoTable from '@/components/event-video-table';
import Loading from '@/components/loading';
import Error from '@/components/error';
import { deleteInference, getInferences } from '@/lib/api';
import { useConfig } from '@/lib/config-context';
import { Inference } from '@/lib/types';

export default function Page() {
  const [inferences, setInferences] = useState<Inference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { source } = useConfig();

  const fetchInferences = useCallback(async () => {
    if (!source) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const results = await getInferences(source);
      setInferences(results);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching video list');
    } finally {
      setIsLoading(false);
      setError(null);
    }
  }, [source]);

  const handleDelete = async (id: string) => {
    if (!source) {
      return;
    }

    try {
      await deleteInference(source, id);
      setInferences((prev) => prev.filter((inference) => inference.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInferences();
  }, [fetchInferences]);

  return (
    <div className="flex h-screen flex-col space-y-6">
      <DashboardTitle>Classified Events In Video</DashboardTitle>
      {isLoading && <Loading />}
      {error && <Error>{error}</Error>}
      {!isLoading && !error && (
        <EventVideoTable inferences={inferences} onItemDelete={handleDelete} />
      )}
    </div>
  );
}
