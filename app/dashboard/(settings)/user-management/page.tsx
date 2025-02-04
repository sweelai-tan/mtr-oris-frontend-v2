'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import DashboardTitle from '@/components/dashboard-title';
import { useConfig } from '@/lib/config-context';
import Loading from '@/components/loading';
import Error from '@/components/error';
import UserTable from '@/components/user-table';
import { User } from '@/lib/types';
import { getUsers } from '@/lib/api';
import { Button } from '@/components/ui/button';

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
      {!error && !isLoading && source && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Link href="/dashboard/user-management/user">
              <Button className="ml-auto bg-cyan-500 text-primary hover:bg-cyan-600">
                Add User
              </Button>
            </Link>
          </div>
          <div>
            <UserTable users={users} />
          </div>
        </div>
      )}
    </div>
  );
}
