'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import DashboardTitle from '@/components/dashboard-title';
import InferenceVideoUploadCard from '@/components/inference-video-upload-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Page() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onUploadSuccess = () => {
    console.log('Upload successful');
    setIsDialogOpen(true);
  };

  return (
    <div className="relative flex h-screen flex-col space-y-6">
      <DashboardTitle>Import Video</DashboardTitle>
      <InferenceVideoUploadCard onUploadSuccess={onUploadSuccess} />
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <AlertDialog
            open={isDialogOpen}
            onOpenChange={(isOpen) => setIsDialogOpen(isOpen)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Upload successful</AlertDialogTitle>
                <AlertDialogDescription>
                  This analysis job will be perform soon.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  className="bg-cyan-500 text-white hover:bg-cyan-600"
                  onClick={() => {
                    setIsDialogOpen(false);
                    router.push('/dashboard/inference-events'); // Redirect to inference dashboard
                  }}
                >
                  OK
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
