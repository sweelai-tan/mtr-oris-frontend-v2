'use client';

import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  EventSource,
  abnormalDefectList,
  DefectGroup,
  defectGroupList,
  eventDirectionList,
  normalDefectList,
  silCarNameList,
  tmlCarNameList,
  ealCarNameList,
} from '@/lib/types';
import { Label } from '@/components/ui/label';

export type ChainageRange = {
  from: number | undefined;
  to: number | undefined;
};

export type FilterData = {
  carName: string | undefined;
  chainageRange: ChainageRange;
  eventDirections: string[];
  defectGroup: string | undefined;
  defectClasses: string[];
  remark: string | undefined;
};

interface FilterSectionProps {
  source: EventSource;
  data: FilterData;
  // eventDirections: string[];
  // setEventDirections: (value: string[]) => void;
  // chainageRange: ChainageRange;
  // setChainageRange: (value: ChainageRange) => void;
  // defectGroup: string | undefined;
  // setDefectGroup: (value: string | undefined) => void;
  // defectClasses: string[];
  // setDefectClasses: (value: string[]) => void;
  // carName: string | undefined;
  // setCarName: (value: string | undefined) => void;
  // remark: string | undefined;
  // setRemark: (value: string | undefined) => void;
  fetchEvents: () => void;
  setData: (data: FilterData) => void;
  // clearFilters: () => void;
}

export type FilterSectionHandle = object;

const getCarNameList = (source: EventSource) => {
  if (source === EventSource.TML_EMAIL) {
    return tmlCarNameList;
  } else if (source === EventSource.EAL_EMAIL) {
    return ealCarNameList;
  }
  return silCarNameList;
};

export function FilterSection(params: FilterSectionProps) {
  const { fetchEvents, source, data, setData } = params;
  const carNameList = getCarNameList(source);

  return (
    <Card className="border-slate-800 bg-slate-900 p-6">
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-zinc-100">Filtering</h3>
        <div className="space-y-2">
          {/* first row */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs text-slate-50">Car Name</label>
              <Select
                onValueChange={(v) => {
                  setData({ ...data, carName: v });
                }}
                value={data.carName ? data.carName : ''}
              >
                <SelectTrigger className="border-slate-100 bg-slate-900">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {carNameList.map((carName, index) => (
                    <SelectItem
                      key={index}
                      value={carName.value}
                      className="text-sm"
                    >
                      {carName.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-50">Track</label>
              <MultiSelect
                className="border-slate-100 bg-slate-900 text-primary"
                options={eventDirectionList}
                onValueChange={(v) => {
                  setData({ ...data, eventDirections: v });
                }}
                defaultValue={data.eventDirections}
                placeholder=""
                variant="contructive"
                animation={0}
                maxCount={3}
              />
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex flex-col gap-4">
                  <label className="text-xs text-slate-50">From Chainage</label>
                  <Input
                    value={
                      data.chainageRange.from ? data.chainageRange.from : ''
                    }
                    placeholder=""
                    className="border-slate-100 bg-slate-900 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    type="number"
                    min={0}
                    onChange={(e) =>
                      setData({
                        ...data,
                        chainageRange: {
                          ...data.chainageRange,
                          from: +e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-xs text-slate-50">To Chainage</label>
                  <Input
                    value={data.chainageRange.to ? data.chainageRange.to : ''}
                    placeholder=""
                    className="border-slate-100 bg-slate-900 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    type="number"
                    min={0}
                    onChange={(e) =>
                      setData({
                        ...data,
                        chainageRange: {
                          ...data.chainageRange,
                          to: +e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex items-center pt-4">
                  <span>m</span>
                </div>
              </div>
            </div>
          </div>
          {/* second row */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-xs text-slate-50">Event Type</Label>
              <Select
                onValueChange={(v) => {
                  setData({ ...data, defectClasses: [], defectGroup: v });
                }}
                value={data.defectGroup ? data.defectGroup : ''}
              >
                <SelectTrigger className="border-slate-100 bg-slate-900">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {defectGroupList.map((defectGroup, index) => (
                    <SelectItem key={index} value={defectGroup.value}>
                      {defectGroup.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-50">Event Class</label>
              <MultiSelect
                className="border-slate-100 bg-slate-900 text-primary"
                options={
                  data.defectGroup === undefined
                    ? []
                    : data.defectGroup === DefectGroup.ABNORMAL
                      ? abnormalDefectList
                      : data.defectGroup === DefectGroup.NORMAL
                        ? normalDefectList
                        : []
                }
                onValueChange={(v) => {
                  setData({ ...data, defectClasses: v });
                }}
                defaultValue={data.defectClasses}
                placeholder=""
                variant="contructive"
                animation={0}
                maxCount={3}
                disabled={data.defectGroup === undefined}
              />
              <label className="text-xs text-slate-200">
                Select defect category first
              </label>
            </div>
            {/* remark input */}
            <div className="max-w-md space-y-2">
              <Label className="text-xs text-slate-50">
                Remark (Containing Characters)
              </Label>
              <Input
                placeholder="Enter your remark"
                value={data.remark ? data.remark : ''}
                className="border-slate-100 bg-slate-900"
                onChange={(e) => setData({ ...data, remark: e.target.value })}
              />
            </div>
          </div>

          {/* buttons */}
          <div className="flex gap-2 pt-8">
            <Button
              className="bg-cyan-500 text-primary hover:bg-cyan-600"
              onClick={fetchEvents}
            >
              Apply
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setData({
                  carName: undefined,
                  chainageRange: { from: undefined, to: undefined },
                  eventDirections: [],
                  defectGroup: undefined,
                  defectClasses: [],
                  remark: undefined,
                })
              }
            >
              Clear all filters
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

FilterSection.displayName = 'FilterSection';

export default FilterSection;
