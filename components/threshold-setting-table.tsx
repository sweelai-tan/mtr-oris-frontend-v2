'use client';

import { useEffect, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  DefectClass,
  Threshold,
  ThresholdCategory,
} from '@/lib/types';

import { Button } from './ui/button';

interface SettingsProps {
  threshold: Threshold;
  handdleUpdate: (threshold: Threshold) => void;
}

interface CheckboxState {
  [key: string]: boolean;
}

export default function ThresholdSettingTable({
  threshold,
  handdleUpdate,
}: SettingsProps) {
  const [modfifiedThreshold, setModifiedThreshold] = useState<Threshold>(JSON.parse(JSON.stringify(threshold)));

  const [checkboxState, setCheckboxState] = useState<CheckboxState>({
    length_cat3: threshold.setting.cat3.length > 0,
    length_cat2c: threshold.setting.cat2c.length > 0,
    length_cat2b: threshold.setting.cat2b.length > 0,
    length_cat2a: threshold.setting.cat2a.length > 0,
    length_cat1: threshold.setting.cat1.length > 0,
    width_cat3: threshold.setting.cat3.width > 0,
    width_cat2c: threshold.setting.cat2c.width > 0,
    width_cat2b: threshold.setting.cat2b.width > 0,
    width_cat2a: threshold.setting.cat2b.width > 0,
    width_cat1: threshold.setting.cat1.width > 0,
    area_cat3: threshold.setting.cat3.area > 0,
    area_cat2c: threshold.setting.cat2c.area > 0,
    area_cat2b: threshold.setting.cat2b.area > 0,
    area_cat2a: threshold.setting.cat2b.area > 0,
    area_cat1: threshold.setting.cat1.area > 0,
  });

  const isCheckboxInputChecked = (): boolean => {
    return (
      modfifiedThreshold.defectClass === DefectClass.ABNORMAL_RAIL_JOINT ||
      modfifiedThreshold.defectClass === DefectClass.RAIL_CRACK ||
      modfifiedThreshold.defectClass === DefectClass.HEAD_CHECKING ||
      modfifiedThreshold.defectClass === DefectClass.SHELLING_FLAKING ||
      modfifiedThreshold.defectClass === DefectClass.SQUAT ||
      modfifiedThreshold.defectClass === DefectClass.IRREGULAR_RUNNING_BAND
    );
  };

  useEffect(() => {
    setModifiedThreshold(JSON.parse(JSON.stringify(threshold)));
    setCheckboxState({
      length_cat3: threshold.setting.cat3.length > 0,
      length_cat2c: threshold.setting.cat2c.length > 0,
      length_cat2b: threshold.setting.cat2b.length > 0,
      length_cat2a: threshold.setting.cat2a.length > 0,
      length_cat1: threshold.setting.cat1.length > 0,
      width_cat3: threshold.setting.cat3.width > 0,
      width_cat2c: threshold.setting.cat2c.width > 0,
      width_cat2b: threshold.setting.cat2b.width > 0,
      width_cat2a: threshold.setting.cat2b.width > 0,
      width_cat1: threshold.setting.cat1.width > 0,
      area_cat3: threshold.setting.cat3.area > 0,
      area_cat2c: threshold.setting.cat2c.area > 0,
      area_cat2b: threshold.setting.cat2b.area > 0,
      area_cat2a: threshold.setting.cat2b.area > 0,
      area_cat1: threshold.setting.cat1.area > 0,
    });
  }, [threshold]);

  const handlePositiveNumberInput = (
    event: React.FormEvent<HTMLInputElement>,
  ) => {
    const value = event.currentTarget.value;
    if (value && parseFloat(value) < 0) {
      event.currentTarget.value = '0';
    }
  };

  const handleUndo = () => {
    console.log('handleUndo');
    setModifiedThreshold(JSON.parse(JSON.stringify(threshold)));
  };

  // console.log(`threshold: ${JSON.stringify(threshold)}`);
  // console.log(`modfifiedThreshold: ${JSON.stringify(modfifiedThreshold)}`);

  const handleInputChange = (
    category: string,
    field: string,
    value: number,
  ) => {
    setModifiedThreshold((prev) => {
      const threshold = prev.setting[category as keyof typeof prev.setting];

      if (!threshold || typeof threshold !== 'object') {
        return prev;
      }

      return {
        ...prev,
        setting: {
          ...prev.setting,
          [category]: {
            ...threshold,
            [field]: Number.isNaN(value) ? '' : value,
          },
        },
      };
    });
  };

  const handleCheckboxChange = (
    key: string,
    checked: boolean,
    category: string,
    field: string,
  ) => {
    setCheckboxState((prev) => ({ ...prev, [key]: checked }));
    setModifiedThreshold((prev) => {
      const threshold = prev.setting[category as keyof typeof prev.setting];

      if (!threshold || typeof threshold !== 'object') {
        return prev;
      }

      return {
        ...prev,
        setting: {
          ...prev.setting,
          [category]: {
            ...threshold,
            [field]: checked ? threshold[field as keyof typeof threshold] : 0,
          },
        },
      };
    });
  };

  const renderCheckboxInput = (
    label: string,
    key: string,
    category: string,
    field: string,
  ) => (
    <div className="flex items-center space-x-2">
      <span className="text-gray-400">{label}</span>
      <Checkbox
        checked={checkboxState[key]}
        onCheckedChange={(check: boolean) =>
          handleCheckboxChange(key, check, category, field)
        }
      />
      <Input
        type="number"
        onInput={handlePositiveNumberInput}
        className="w-24 border-gray-700 bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        onChange={(e) =>
          handleInputChange(
            category,
            field,
            parseFloat((e.target as HTMLInputElement).value),
          )
        }
        value={
          typeof modfifiedThreshold.setting[
            category as keyof typeof modfifiedThreshold.setting
          ] === 'object' &&
          modfifiedThreshold.setting[
            category as keyof typeof modfifiedThreshold.setting
          ] !== null
            ? (
                modfifiedThreshold.setting[
                  category as keyof typeof modfifiedThreshold.setting
                ] as ThresholdCategory
              )[field as keyof ThresholdCategory]
            : ''
        }
      />
    </div>
  );

  const renderCheckbox = (
    label: string,
    key: string,
    category: string,
    field: string,
  ) => (
    <div className="flex items-center space-x-2">
      <span className="text-gray-400">{label}</span>
      <Checkbox
        checked={checkboxState[key]}
        onCheckedChange={(check: boolean) => {
          handleCheckboxChange(key, check, category, field);
          handleInputChange(category, field, check ? 1 : 0);
        }}
      />
    </div>
  );

  return (
    <div className="w-full bg-slate-900 p-2">
      {/* Threshold categories section */}
      <div className="flex flex-row items-center bg-[#4E5255]">
        <div className="mb-2 mt-2 w-[180px] pl-2">
          <div className="text-sm text-white">Severity</div>
        </div>
        <div className="ml-10 grid flex-1 grid-cols-5 items-center gap-4">
          <div className="mb-2 mt-2">
            <span className="text-sm text-white">Cat. 3</span>
          </div>
          <div className="mb-2 mt-2">
            <span className="text-sm text-white">Cat. 2C</span>
          </div>
          <div className="mb-2 mt-2">
            <span className="text-sm text-white">Cat. 2B</span>
          </div>
          <div className="mb-2 mt-2">
            <span className="text-sm text-white">Cat. 2A</span>
          </div>
          <div className="mb-2 mt-2">
            <span className="text-sm text-white">Cat. 1</span>
          </div>
        </div>
      </div>

      {/* Length Row */}
      {isCheckboxInputChecked() && (
        <div className="mt-4 flex flex-row">
          <div className="mb-4 flex w-[180px] items-center justify-between">
            <div className="pl-2 text-sm text-gray-400">Length (mm)</div>
            <Input
              defaultValue={0}
              className="w-16 border-gray-700 bg-transparent"
              disabled
            />
          </div>
          <div className="mb-4 ml-10 grid flex-1 grid-cols-5 items-center gap-4">
            {/* <div className="flex items-center space-x-2">
            <span className="text-gray-400">to</span>
            <Checkbox
              checked={checkboxState.length_cat3}
              // onCheckedChange={(check) => {
              //   if (check) {
              //     setCheckboxState((prev) => ({ ...prev, length_cat3: true }));
              //   } else {
              //     setCheckboxState((prev) => ({ ...prev, length_cat3: false }));
              //     setModifiedThreshold((prev) => ({
              //       ...prev,
              //       setting: {
              //         ...prev.setting,
              //         cat3: {
              //           ...prev.setting.cat3,
              //           length: 0,
              //         },
              //       },
              //     }));
              //   }
              // }}
              onCheckedChange={(check: boolean) => {handleCheckboxChange('length_cat3', check, 'cat3', 'length');}}
            />
            <Input
              type="number"
              className="w-24 border-gray-700 bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              onInput={handlePositiveNumberInput}
              value={modfifiedThreshold.setting.cat3.length}
              // onChange={(e) => {
              //   setModifiedThreshold((prev) => ({
              //     ...prev,
              //     setting: {
              //       ...prev.setting,
              //       cat3: {
              //         ...prev.setting['cat3'],
              //         length: parseFloat(e.target.value),
              //       },
              //     },
              //   }));
              // }}
                onChange={(e) => {
                  handleInputChange('cat3', 'length', parseFloat(e.target.value));
                  }}
            />
          </div> */}
            {renderCheckboxInput('to', 'length_cat3', 'cat3', 'length')}
  
            {renderCheckboxInput('to', 'length_cat2c', 'cat2c', 'length')}
  
            {renderCheckboxInput('to', 'length_cat2b', 'cat2b', 'length')}
   
            {renderCheckboxInput('to', 'length_cat2a', 'cat2a', 'length')}

            {renderCheckboxInput('to', 'length_cat1', 'cat1', 'length')}
          </div>
        </div>
      )}

      {/* Width Row */}
      {isCheckboxInputChecked() && (
        <div className="mt-4 flex flex-row">
          <div className="mb-4 flex w-[180px] items-center justify-between">
            <div className="pl-2 text-sm text-gray-400">Width (mm)</div>
            <Input
              defaultValue={0}
              className="w-16 border-gray-700 bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              disabled
            />
          </div>
          <div className="mb-4 ml-10 grid flex-1 grid-cols-5 items-center gap-4">
            {/* <div className="flex items-center space-x-2">
            <span className="text-gray-400">to</span>
            <Checkbox
              checked={checkboxState.width_cat3}
              onCheckedChange={(check) => {
                if (check) {
                  setCheckboxState((prev) => ({ ...prev, width_cat3: true }));
                } else {
                  setCheckboxState((prev) => ({ ...prev, width_cat3: false }));
                  setModifiedThreshold((prev) => ({
                    ...prev,
                    setting: {
                      ...prev.setting,
                      cat3: {
                        ...prev.setting.cat3,
                        width: 0,
                      },
                    },
                  }));
                }
              }}
            />
            <Input
              type="number"
              className="w-24 border-gray-700 bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              onInput={handlePositiveNumberInput}
              value={modfifiedThreshold.setting.cat3.width}
              onChange={(e) => {
                setModifiedThreshold((prev) => ({
                  ...prev,
                  setting: {
                    ...prev.setting,
                    cat3: {
                      ...prev.setting.cat3,
                      width: parseFloat(e.target.value),
                    },
                  },
                }));
              }}
            />
          </div> */}
            {renderCheckboxInput('to', 'width_cat3', 'cat3', 'width')}
            {/* <div className="flex items-center space-x-2">
            <span className="text-gray-400">to</span>
            <Checkbox
              checked={checkboxState.width_cat2c}
              onCheckedChange={(check) => {
                if (check) {
                  setCheckboxState((prev) => ({ ...prev, width_cat2c: true }));
                } else {
                  setCheckboxState((prev) => ({ ...prev, width_cat2c: false }));
                  setModifiedThreshold((prev) => ({
                    ...prev,
                    setting: {
                      ...prev.setting,
                      cat2c: {
                        ...prev.setting.cat2c,
                        width: 0,
                      },
                    },
                  }));
                }
              }}
            />
            <Input
              type="number"
              className="w-24 border-gray-700 bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              onInput={handlePositiveNumberInput}
              value={modfifiedThreshold.setting.cat2c.width}
              onChange={(e) => {
                setModifiedThreshold((prev) => ({
                  ...prev,
                  setting: {
                    ...prev.setting,
                    cat2c: {
                      ...prev.setting.cat2c,
                      width: parseFloat(e.target.value),
                    },
                  },
                }));
              }}
            />
          </div> */}
            {renderCheckboxInput('to', 'width_cat2c', 'cat2c', 'width')}
            {/* <div className="flex items-center space-x-2">
            <span className="text-gray-400">to</span>
            <Checkbox
              checked={checkboxState.width_cat2b}
              onCheckedChange={(check) => {
                if (check) {
                  setCheckboxState((prev) => ({ ...prev, width_cat2b: true }));
                } else {
                  setCheckboxState((prev) => ({ ...prev, width_cat2b: false }));
                  setModifiedThreshold((prev) => ({
                    ...prev,
                    setting: {
                      ...prev.setting,
                      cat2b: {
                        ...prev.setting.cat2b,
                        width: 0,
                      },
                    },
                  }));
                }
              }}
            />
            <Input
              type="number"
              className="w-24 border-gray-700 bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              onInput={handlePositiveNumberInput}
              value={modfifiedThreshold.setting.cat2b.width}
              onChange={(e) => {
                setModifiedThreshold((prev) => ({
                  ...prev,
                  setting: {
                    ...prev.setting,
                    cat2b: {
                      ...prev.setting.cat2b,
                      width: parseFloat(e.target.value),
                    },
                  },
                }));
              }}
            />
          </div> */}
            {renderCheckboxInput('to', 'width_cat2b', 'cat2b', 'width')}
            {/* <div className="flex items-center space-x-2">
            <span className="text-gray-400">to</span>
            <Checkbox
              checked={checkboxState.width_cat2a}
              onCheckedChange={(check) => {
                if (check) {
                  setCheckboxState((prev) => ({ ...prev, width_cat2a: true }));
                } else {
                  setCheckboxState((prev) => ({ ...prev, width_cat2a: false }));
                  setModifiedThreshold((prev) => ({
                    ...prev,
                    setting: {
                      ...prev.setting,
                      cat2a: {
                        ...prev.setting.cat2a,
                        width: 0,
                      },
                    },
                  }));
                }
              }}
            />
            <Input
              type="number"
              className="w-24 border-gray-700 bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              onInput={handlePositiveNumberInput}
              value={modfifiedThreshold.setting.cat2a.width}
              onChange={(e) => {
                setModifiedThreshold((prev) => ({
                  ...prev,
                  setting: {
                    ...prev.setting,
                    cat2a: {
                      ...prev.setting.cat2a,
                      width: parseFloat(e.target.value),
                    },
                  },
                }));
              }}
            />
          </div> */}
            {renderCheckboxInput('to', 'width_cat2a', 'cat2a', 'width')}
            {/* <div className="flex items-center space-x-2">
            <span className="text-gray-400">to</span>
            <Checkbox
              checked={checkboxState.width_cat1}
              onCheckedChange={(check) => {
                if (check) {
                  setCheckboxState((prev) => ({ ...prev, width_cat1: true }));
                } else {
                  setCheckboxState((prev) => ({ ...prev, width_cat1: false }));
                  setModifiedThreshold((prev) => ({
                    ...prev,
                    setting: {
                      ...prev.setting,
                      cat1: {
                        ...prev.setting.cat1,
                        width: 0,
                      },
                    },
                  }));
                }
              }}
            />
            <Input
              type="number"
              className="w-24 border-gray-700 bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              onInput={handlePositiveNumberInput}
              value={modfifiedThreshold.setting.cat1.width}
              onChange={(e) => {
                setModifiedThreshold((prev) => ({
                  ...prev,
                  setting: {
                    ...prev.setting,
                    cat1: {
                      ...prev.setting.cat1,
                      width: parseFloat(e.target.value),
                    },
                  },
                }));
              }}
            />
          </div> */}
            {renderCheckboxInput('to', 'width_cat1', 'cat1', 'width')}
          </div>
        </div>
      )}

      {/* Area Row */}
      {isCheckboxInputChecked() && (
        <div className="mt-4 flex flex-row">
          <div className="mb-4 flex w-[180px] items-center justify-between">
            <div className="pl-2 text-sm text-gray-400">Area (mm2)</div>
            <Input
              defaultValue={0}
              className="w-16 border-gray-700 bg-transparent"
              disabled
            />
          </div>
          <div className="mb-4 ml-10 grid flex-1 grid-cols-5 items-center gap-4">

            {renderCheckboxInput('to', 'area_cat3', 'cat3', 'area')}

            {renderCheckboxInput('to', 'area_cat2c', 'cat2c', 'area')}

            {renderCheckboxInput('to', 'area_cat2b', 'cat2b', 'area')}

            {renderCheckboxInput('to', 'area_cat2a', 'cat2a', 'area')}

            {renderCheckboxInput('to', 'area_cat1', 'cat1', 'area')}
          </div>
        </div>
      )}

      {/* Enable Row */}
      {!isCheckboxInputChecked() && (
        <div className="mt-4 flex flex-row">
          <div className="mb-4 flex w-[180px] items-center justify-between">
            <div className="pl-2 text-sm text-gray-400">Enable</div>
          </div>
          <div className="mb-4 ml-10 grid flex-1 grid-cols-5 items-center gap-4">
            {renderCheckbox('', 'length_cat3', 'cat3', 'length')}
            {renderCheckbox('', 'length_cat2c', 'cat2c', 'length')}
            {renderCheckbox('', 'length_cat2b', 'cat2b', 'length')}
            {renderCheckbox('', 'length_cat2a', 'cat2a', 'length')}
            {renderCheckbox('', 'length_cat1', 'cat1', 'length')}
          </div>
        </div>
      )}

      {/* Combination Type */}
      {/* <div className="space-y-2 mt-4">
        <Label className="text-sm text-gray-400">Combination type</Label>
        <RadioGroup
          defaultValue="OR"
          // onValueChange={setCombinationType}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="OR" id="or" />
            <Label htmlFor="or">OR</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="AND" id="and" />
            <Label htmlFor="and">AND</Label>
          </div>
        </RadioGroup>
      </div> */}

      {/* Save Button */}
      <div className="mt-6">
        <Button
          className="w-[100px] bg-cyan-500"
          variant="secondary"
          onClick={() => handdleUpdate(modfifiedThreshold)}
        >
          Save
        </Button>
        <Button className="w-[100px]" variant="ghost" onClick={handleUndo}>
          Undo
        </Button>
      </div>
    </div>
  );
}
