'use client';

import { useCallback, useEffect, useState } from 'react';

import DashboardTitle from '@/components/dashboard-title';
import { useConfig } from '@/lib/config-context';
import Loading from '@/components/loading';
import Error from '@/components/error';
import UserTable from '@/components/user-table';
import { User } from '@/lib/types';
import { getUsers } from '@/lib/api';

export default function Page() {
  const { source } = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    if (!source) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getUsers();
      setUsers(result);
    } catch (err) {
      console.error(err);
      setError('An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [source]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="flex h-screen flex-col space-y-6">
      <DashboardTitle>User Management</DashboardTitle>
      {(isLoading || !source) && <Loading />}
      {error && <Error>{error}</Error>}
      {!error && !isLoading && source && <UserTable users={users} />}
    </div>
  );
}
