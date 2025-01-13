'use client';

import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardTitle from '@/components/dashboard-title';
import Loading from '@/components/loading';
import Error from '@/components/error';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { abnormalDefectList, DefectClass, Threshold } from '@/lib/types';
import ThresholdSetting from '@/components/threshold-setting';
import { getThresholds, updateThreshold } from '@/lib/api';
import { useConfig } from '@/lib/config-context';
import { toast } from '@/hooks/use-toast';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAbnormalDefect, setSelectedAbnormalDefect] =
    useState<DefectClass>(DefectClass.ABNORMAL_RAIL_JOINT);
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [selcetedThreshold, setSelectedThreshold] = useState<Threshold | null>(
    null,
  );
  const { source } = useConfig();

  const fetchThresholds = useCallback(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // const response = await axios.get("/thresholds");
        const result = await getThresholds(source);
        setThresholds(result);
        setSelectedThreshold(
          result.find(
            (threshold) => threshold.defectClass === selectedAbnormalDefect,
          ) ?? null,
        );
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data.message || 'An error occurred');
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handdleUpdate = async (threshold: Threshold) => {
    try {
      const data = await updateThreshold(source, threshold);
      setThresholds((prev) =>
        prev.map((item) => (item.id === data.id ? data : item)),
      );

      toast({
        title: 'Update threshold successful',
        description: 'Threshold has been successfully updated.',
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message || 'An error occurred');
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    fetchThresholds();
  }, [fetchThresholds]);

  const handleSelectAbnormalChange = (value: string) => {
    console.log(`Selected abnormal defect: ${value}`);
    setSelectedAbnormalDefect(value as DefectClass);
    // find the threshold with the selected defect class and set it as the selected threshold
    const threshold = thresholds.find(
      (threshold) => threshold.defectClass === value,
    );
    console.log(threshold);
    setSelectedThreshold(threshold ?? null); // Cast the string to DefectClass
  };

  return (
    <div className="flex h-screen flex-col space-y-6">
      <DashboardTitle>Defect Category Threshold</DashboardTitle>
      {isLoading && <Loading />}
      {error && <Error message={error} />}
      {!isLoading && !error && (
        <Tabs defaultValue="abnormal" className="mb-4 space-y-6">
          <TabsList className="bg-transparent">
            <TabsTrigger
              value="abnormal"
              className="min-w-[100px] border-2 border-cyan-500 data-[state=active]:text-cyan-500"
            >
              Abnormal
            </TabsTrigger>
          </TabsList>
          <TabsContent value="abnormal">
            <Select
              onValueChange={handleSelectAbnormalChange}
              value={selectedAbnormalDefect}
            >
              <SelectTrigger className="w-[200px] border-slate-800 bg-slate-900">
                <SelectValue
                  placeholder="Select defect class"
                  // defaultValue={selectedAbnormalDefect}
                />
              </SelectTrigger>
              <SelectContent>
                {abnormalDefectList.map((defect) => (
                  <SelectItem key={defect.value} value={defect.value}>
                    {defect.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>
        </Tabs>
      )}
      {selcetedThreshold && (
        <ThresholdSetting
          threshold={selcetedThreshold}
          handdleUpdate={handdleUpdate}
        />
      )}
    </div>
  );
}
