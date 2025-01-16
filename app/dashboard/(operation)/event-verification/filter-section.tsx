'use client';

import React, { forwardRef, useImperativeHandle, useState } from 'react';

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
} from '@/lib/types';
import { Label } from '@/components/ui/label';

export type ChainageRange = {
  from: number | undefined;
  to: number | undefined;
};

interface FilterSectionProps {
  source: EventSource;
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
  // clearFilters: () => void;
}

export interface FilterSectionHandle {
  getCarName: () => string | undefined;
  getEventDirections: () => string[];
  getChainageRange: () => ChainageRange;
  getDefectGroup: () => string | undefined;
  getDefectClasses: () => string[];
  getRemark: () => string | undefined;
}

export const FilterSection = forwardRef<
  FilterSectionHandle,
  FilterSectionProps
>((params, ref) => {
  // TODO: check base on source
  const carNameList = silCarNameList;

  const { fetchEvents } = params;
  const [carName, setCarName] = useState<string | undefined>();
  const [chainageRange, setChainageRange] = useState<ChainageRange>({
    from: undefined,
    to: undefined,
  });
  const [eventDirections, setEventDirections] = useState<string[]>([]);
  const [defectGroup, setDefectGroup] = useState<string | undefined>(undefined);
  const [defectClasses, setDefectClasses] = useState<string[]>([]);
  const [remark, setRemark] = useState<string | undefined>();

  useImperativeHandle(ref, () => ({
    getCarName: () => carName,
    getEventDirections: () => eventDirections,
    getChainageRange: () => chainageRange,
    getDefectGroup: () => defectGroup,
    getDefectClasses: () => defectClasses,
    getRemark: () => remark,
  }));

  const clearFilters = () => {
    setCarName(undefined);
    setChainageRange({
      from: undefined,
      to: undefined,
    });
    setEventDirections([]);
    setDefectGroup(undefined);
    setDefectClasses([]);
    setRemark(undefined);
  };

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
                  setCarName(v);
                }}
                value={carName ? carName : ''}
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
                onValueChange={setEventDirections}
                defaultValue={eventDirections}
                placeholder=""
                variant="contructive"
                animation={0}
                maxCount={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-50">Chainage</label>
              <div className="flex gap-2">
                <Input
                  value={chainageRange.from ? chainageRange.from : ''}
                  placeholder=""
                  className="border-slate-100 bg-slate-900 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  type="number"
                  min={0}
                  onChange={(e) =>
                    setChainageRange({
                      ...chainageRange,
                      from: +e.target.value,
                    })
                  }
                />
                <Input
                  value={chainageRange.to ? chainageRange.to : ''}
                  placeholder=""
                  className="border-slate-100 bg-slate-900 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  type="number"
                  min={0}
                  onChange={(e) =>
                    setChainageRange({ ...chainageRange, to: +e.target.value })
                  }
                />
                <span className="flex items-center">m</span>
              </div>
            </div>
          </div>
          {/* second row */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-xs text-slate-50">Event Type</Label>
              <Select
                onValueChange={(v) => {
                  setDefectClasses([]);
                  setDefectGroup(v);
                }}
                value={defectGroup ? defectGroup : ''}
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
                  defectGroup === undefined
                    ? []
                    : defectGroup === DefectGroup.ABNORMAL
                      ? abnormalDefectList
                      : defectGroup === DefectGroup.NORMAL
                        ? normalDefectList
                        : []
                }
                onValueChange={setDefectClasses}
                defaultValue={defectClasses}
                placeholder=""
                variant="contructive"
                animation={0}
                maxCount={3}
                disabled={defectGroup === undefined}
              />
              <label className="text-xs text-slate-200">
                Select defect category first
              </label>
            </div>
          </div>
          {/* remark input */}
          <div className="max-w-md space-y-2">
            <Label className="text-xs text-slate-50">
              Remark (Containing Characters)
            </Label>
            <Input
              placeholder="Enter your remark"
              className="border-slate-100 bg-slate-900"
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
          {/* buttons */}
          <div className="flex gap-2 pt-8">
            <Button
              className="bg-cyan-500 text-primary hover:bg-cyan-600"
              onClick={fetchEvents}
            >
              Apply
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});

FilterSection.displayName = 'FilterSection';

export default FilterSection;
