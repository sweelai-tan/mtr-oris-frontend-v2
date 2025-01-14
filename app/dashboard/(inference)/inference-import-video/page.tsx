import DashboardTitle from '@/components/dashboard-title';
import InferenceVideoUploadCard from '@/components/inference-video-upload-card';

export default function Page() {
  return (
    <div className="flex h-screen flex-col space-y-6">
      <DashboardTitle>Import Video</DashboardTitle>
      <InferenceVideoUploadCard />
    </div>
  );
}
