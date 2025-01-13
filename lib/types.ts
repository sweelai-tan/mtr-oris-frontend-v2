export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

export enum EventSource {
  SIL_EMAIL = 'SIL_EMAIL',
  SIL_VIDEO = 'SIL_VIDEO',
  TML_EMAIL = 'TML_EMAIL',
  TML_VIDEO = 'TML_VIDEO',
  EAL_EMAIL = 'EAL_EMAIL',
}

export enum EventDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  NK = 'NK',
  SWITCH = 'SW',
  UNKNOWN = 'UNKNOWN',
}

export enum EventPosition {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  UNKNOWN = 'UNKNOWN',
}

export enum EventStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  MODIFIED = 'MODIFIED',
}

export enum DefectGroup {
  NORMAL = 'NORMAL',
  ABNORMAL = 'ABNORMAL',
  UNKNOWN = 'UNKNOWN',
}

export enum DefectClass {
  UNKNOWN = 'UNKNOWN',
  ABNORMAL_RAIL_JOINT = 'ABNORMAL_RAIL_JOINT',
  ALUMINOTHERMIC_WELD = 'ALUMINOTHERMIC_WELD',
  AXLE_COUNTER = 'AXLE_COUNTER',
  BROKEN_CLIP = 'BROKEN_CLIP',
  BROKEN_RAIL = 'BROKEN_RAIL',
  CONCRETE_CRACK = 'CONCRETE_CRACK',
  CORRUGATION = 'CORRUGATION',
  DIRT = 'DIRT',
  ERROR_IMAGE = 'ERROR_IMAGE',
  FISHPLATE_JOINT = 'FISHPLATE_JOINT',
  FLASH_BUTT_WELD = 'FLASH_BUTT_WELD',
  FOREIGN_OBJECT = 'FOREIGN_OBJECT',
  GRINDING_MARK = 'GRINDING_MARK',
  HEAD_CHECKING = 'HEAD_CHECKING',
  IRREGULAR_RUNNING_BAND = 'IRREGULAR_RUNNING_BAND',
  INSULATED_RAIL_JOINT = 'INSULATED_RAIL_JOINT',
  JOGGLE_CLAMP = 'JOGGLE_CLAMP',
  LUBRICATOR_BLADE = 'LUBRICATOR_BLADE',
  LUBRICATOR_BUTTON = 'LUBRICATOR_BUTTON',
  MISSING_CLIP = 'MISSING_CLIP',
  PAINT_MARK = 'PAINT_MARK',
  PEDESTRIAN_LEVEL_CROSSING = 'PEDESTRIAN_LEVEL_CROSSING',
  RAIL_CRACK = 'RAIL_CRACK',
  RAIL_CROSSING = 'RAIL_CROSSING',
  RAIL_DISCONTINUITY = 'RAIL_DISCONTINUITY',
  RAIL_EXPANSION_JOINT = 'RAIL_EXPANSION_JOINT',
  RAIL_MOVEMENT_JOINT = 'RAIL_MOVEMENT_JOINT',
  RAIL_SWITCH = 'RAIL_SWITCH',
  SHELLING_FLAKING = 'SHELLING_FLAKING',
  SQUAT = 'SQUAT',
  SWITCH_BASEPLATE_WITHOUT_CLIP = 'SWITCH_BASEPLATE_WITHOUT_CLIP',
  TRACK_ANOMALY = 'TRACK_ANOMALY',
  TRI_METAL_WELD = 'TRI_METAL_WELD',
  OTHER = 'OTHER',
}

export const sourceTranslations: { [key in EventSource]: string } = {
  [EventSource.SIL_EMAIL]: 'SIL Email',
  [EventSource.SIL_VIDEO]: 'SIL Video',
  [EventSource.TML_EMAIL]: 'TML Email',
  [EventSource.TML_VIDEO]: 'TML Video',
  [EventSource.EAL_EMAIL]: 'EAL Email',
};

export const directionTranslations: { [key in EventDirection]: string } = {
  [EventDirection.UP]: 'Up',
  [EventDirection.DOWN]: 'Down',
  [EventDirection.NK]: 'Neck',
  [EventDirection.SWITCH]: 'Switch',
  [EventDirection.UNKNOWN]: 'Unknown',
};

export const positionTranslations: { [key in EventPosition]: string } = {
  [EventPosition.LEFT]: 'Left',
  [EventPosition.RIGHT]: 'Right',
  [EventPosition.UNKNOWN]: 'Unknown',
};

export const statusTranslations: { [key in EventStatus]: string } = {
  [EventStatus.PENDING]: 'Pending',
  [EventStatus.VERIFIED]: 'Verified',
  [EventStatus.MODIFIED]: 'Modified',
};

export const groupTranslations: { [key in DefectGroup]: string } = {
  [DefectGroup.NORMAL]: 'Normal',
  [DefectGroup.ABNORMAL]: 'Abnormal',
  [DefectGroup.UNKNOWN]: 'Unknown',
};

export const classTranslations: { [key in DefectClass]: string } = {
  [DefectClass.UNKNOWN]: 'Unknown',
  [DefectClass.ABNORMAL_RAIL_JOINT]: 'Abnormal Rail Joint',
  [DefectClass.ALUMINOTHERMIC_WELD]: 'Aluminothermic Weld',
  [DefectClass.AXLE_COUNTER]: 'Axle Counter',
  [DefectClass.BROKEN_CLIP]: 'Broken Clip',
  [DefectClass.BROKEN_RAIL]: 'Broken Rail',
  [DefectClass.CONCRETE_CRACK]: 'Concrete Crack',
  [DefectClass.CORRUGATION]: 'Corrugation',
  [DefectClass.DIRT]: 'Dirt',
  [DefectClass.ERROR_IMAGE]: 'Error Image',
  [DefectClass.FISHPLATE_JOINT]: 'Fishplate Joint',
  [DefectClass.FLASH_BUTT_WELD]: 'Flash Butt Weld',
  [DefectClass.FOREIGN_OBJECT]: 'Foreign Object',
  [DefectClass.GRINDING_MARK]: 'Grinding Mark',
  [DefectClass.HEAD_CHECKING]: 'Head Checking',
  [DefectClass.IRREGULAR_RUNNING_BAND]: 'Irregular Running Band',
  [DefectClass.INSULATED_RAIL_JOINT]: 'Insulated Rail Joint',
  [DefectClass.JOGGLE_CLAMP]: 'Joggle Clamp',
  [DefectClass.LUBRICATOR_BLADE]: 'Lubricator Blade',
  [DefectClass.LUBRICATOR_BUTTON]: 'Lubricator Button',
  [DefectClass.MISSING_CLIP]: 'Missing Clip',
  [DefectClass.PAINT_MARK]: 'Paint Mark',
  [DefectClass.PEDESTRIAN_LEVEL_CROSSING]: 'Pedestrian Level Crossing',
  [DefectClass.RAIL_CRACK]: 'Rail Crack',
  [DefectClass.RAIL_CROSSING]: 'Rail Crossing',
  [DefectClass.RAIL_DISCONTINUITY]: 'Rail Discontinuity',
  [DefectClass.RAIL_EXPANSION_JOINT]: 'Rail Expansion Joint',
  [DefectClass.RAIL_MOVEMENT_JOINT]: 'Rail Movement Joint',
  [DefectClass.RAIL_SWITCH]: 'Rail Switch',
  [DefectClass.SHELLING_FLAKING]: 'Shelling Flaking',
  [DefectClass.SQUAT]: 'Squat',
  [DefectClass.SWITCH_BASEPLATE_WITHOUT_CLIP]: 'Switch Base',
  [DefectClass.TRACK_ANOMALY]: 'Track Anomaly',
  [DefectClass.TRI_METAL_WELD]: 'Tri Metal Weld',
  [DefectClass.OTHER]: 'Other',
};

export type Defect = {
  category: string;
  class: DefectClass;
  group: DefectGroup;
  name: string;
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
  width: number;
  length: number;
  severity: string;
};

export type Event = {
  chainage: number;
  defects: Defect[];
  direction: EventDirection;
  eventAt: string;
  id: string;
  parentId: string;
  image: string;
  imageSrc: string;
  originalHeight: number;
  originalWidth: number;
  position: EventPosition;
  remark: string;
  source: EventSource;
  status: EventStatus;
  sysDefects: Defect[];
  sysMetadata: string;
  carName: string;
};

export const eventDirectionList = [
  { value: EventDirection.UP, label: 'Up' },
  { value: EventDirection.DOWN, label: 'Down' },
  { value: EventDirection.NK, label: 'Neck' },
  { value: EventDirection.UNKNOWN, label: 'Unknown' },
];

export const eventPositionList = [
  { value: 'LEFT', label: 'Left' },
  { value: 'RIGHT', label: 'Right' },
  { value: 'CENTER', label: 'Center' },
  { value: 'UNKNOWN', label: 'Unknown' },
];

export const defectGroupList = [
  { value: DefectGroup.ABNORMAL, label: 'Abnormal' },
  { value: DefectGroup.NORMAL, label: 'Normal' },
  { value: DefectGroup.UNKNOWN, label: 'Unknown' },
];

export const abnormalDefectList = [
  { value: DefectClass.ABNORMAL_RAIL_JOINT, label: 'Abnormal Rail Joint' },
  { value: DefectClass.BROKEN_RAIL, label: 'Broken Rail' },
  { value: DefectClass.CONCRETE_CRACK, label: 'Concrete Crack' },
  { value: DefectClass.CORRUGATION, label: 'Corrugation' },
  { value: DefectClass.HEAD_CHECKING, label: 'Head Checking' },
  { value: DefectClass.MISSING_CLIP, label: 'Missing Clip' },
  { value: DefectClass.RAIL_CRACK, label: 'Rail Crack' },
  { value: DefectClass.RAIL_DISCONTINUITY, label: 'Rail Discontinuity' },
  { value: DefectClass.SHELLING_FLAKING, label: 'Shelling Flaking' },
  { value: DefectClass.SQUAT, label: 'Squat' },
];

export const normalDefectList = [
  { value: DefectClass.ALUMINOTHERMIC_WELD, label: 'Aluminothermic Weld' },
  { value: DefectClass.DIRT, label: 'Dirt' },
  { value: DefectClass.ERROR_IMAGE, label: 'Error Image' },
  { value: DefectClass.FISHPLATE_JOINT, label: 'Fishplate Joint' },
  { value: DefectClass.FLASH_BUTT_WELD, label: 'Flash Butt Weld' },
  { value: DefectClass.GRINDING_MARK, label: 'Grinding Mark' },
  { value: DefectClass.INSULATED_RAIL_JOINT, label: 'Insulated Rail Joint' },
  {
    value: DefectClass.IRREGULAR_RUNNING_BAND,
    label: 'Irregular Running Band',
  },
  { value: DefectClass.PAINT_MARK, label: 'Paint Mark' },
  { value: DefectClass.RAIL_EXPANSION_JOINT, label: 'Rail Expansion Joint' },
  { value: DefectClass.RAIL_MOVEMENT_JOINT, label: 'Rail Movement Joint' },
  { value: DefectClass.TRI_METAL_WELD, label: 'Tri Metal Weld' },
];

export const unknownDefectList = [
  { value: DefectClass.UNKNOWN, label: 'Unknown' },
];

export const silCarNameList = [
  { value: 'TS09', label: 'TS09' },
  { value: 'TS10', label: 'TS10' },
];

export const tmlCarNameList = [
  { value: 'TS14', label: 'TS14' },
  { value: 'TS15', label: 'TS15' },
  { value: 'TS16', label: 'TS16' },
];

export const ealCarNameList = [
  { value: 'TS05', label: 'TS05' },
  { value: 'TS06', label: 'TS06' },
];

export const getEventDirectionLabel = (value: EventDirection): string => {
  const direction = eventDirectionList.find((item) => item.value === value);
  return direction ? direction.label : 'Unknown';
};

export const getEventPositionLabel = (value: EventPosition): string => {
  const position = eventPositionList.find((item) => item.value === value);
  return position ? position.label : 'Unknown';
};

export const getDefectGroupLabel = (value: DefectGroup): string => {
  const group = defectGroupList.find((item) => item.value === value);
  return group ? group.label : 'Unknown';
};

export const getDefectClassLabel = (value: DefectClass): string => {
  let group = abnormalDefectList.find((item) => item.value === value);
  if (!group) {
    group = normalDefectList.find((item) => item.value === value);
  }
  return group ? group.label : 'Unknown';
};

// Thresholds
export enum ThresholdCategoryType {
  CAT_3 = 'CAT_3',
  CAT_2C = 'CAT_2C',
  CAT_2B = 'CAT_2B',
  CAT_2A = 'CAT_2A',
  CAT_1 = 'CAT_1',
}

export enum ThresholdCombinationType {
  AND = 'AND',
  OR = 'OR',
}

export type ThresholdCategory = {
  type: ThresholdCategoryType;
  length: number;
  width: number;
  area: number;
};

export type ThresholdSetting = {
  minWidth: number;
  minHeight: number;
  minArea: number;
  combinationType: ThresholdCombinationType;
  cat3: ThresholdCategory;
  cat2c: ThresholdCategory;
  cat2b: ThresholdCategory;
  cat2a: ThresholdCategory;
  cat1: ThresholdCategory;
};

export type Threshold = {
  id: string;
  defectClass: DefectClass;
  setting: ThresholdSetting;
};

// Alert
export type Alert = {
  id: string;
  eventAt: string;
  eventId: string;
  source: EventSource;
  content: string;
  topic: string;
  emails: string[];
  sent: boolean;
};

// Email
export type EmailSetting = {
  cat3: boolean;
  cat2c: boolean;
  cat2b: boolean;
  cat2a: boolean;
  cat1: boolean;
};

export type Email = {
  source: EventSource;
  id: string;
  email: string;
  name: string;
  settings: EmailSetting;
};

// User
export type LoginData = {
  accessToken: {
    accessToken: string;
  };
  user: {
    email: string;
    name: string;
    role: string;
    id: string;
  };
};
