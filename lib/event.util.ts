import moment from 'moment-timezone';

import {
  Event,
  Defect,
  DefectClass,
  DefectGroup,
  getDefectClassLabel,
  EventStatus,
} from './types';

const emptyDetect: Defect = {
  group: DefectGroup.UNKNOWN,
  class: DefectClass.UNKNOWN,
  category: '',
  name: getDefectClassLabel(DefectClass.UNKNOWN),
  xMin: 0,
  yMin: 0,
  xMax: 0,
  yMax: 0,
  width: 0,
  length: 0,
  severity: '',
};

const getLocalTime = (time: string) => {
  return moment(time).tz('Asia/Hong_Kong').format('YYYY/MM/DD HH:mm:ss');
};

const getEventStatus = (
  originalEvent: Event,
  modifiedEvent: Event,
): EventStatus => {
  const copiedEvent = {
    ...modifiedEvent,
    status: originalEvent.status,
    remark: originalEvent.remark,
    defects: originalEvent.defects,
  };

  console.log('originalEvent', originalEvent);
  console.log('modifiedEvent', modifiedEvent);
  console.log('copiedEvent', copiedEvent);

  // if status is modified, return modified
  if (modifiedEvent.status === EventStatus.MODIFIED) {
    return EventStatus.MODIFIED;
  }

  let hasEventChanged =
    JSON.stringify(originalEvent) !== JSON.stringify(copiedEvent);

  console.log('hasEventChanged 1', hasEventChanged);

  copiedEvent.remark = modifiedEvent.remark;
  copiedEvent.status = modifiedEvent.status;
  copiedEvent.defects = modifiedEvent.defects;

  // other parameters are not changed, let's check defects
  if (!hasEventChanged) {
    // the event does not have any defects, defect is added
    if (originalEvent.defects.length === 0) {
      if (originalEvent.sysDefects.length === 0) {
        hasEventChanged =
          JSON.stringify(modifiedEvent.defects[0]) !==
          JSON.stringify(emptyDetect);
      } else {
        hasEventChanged =
          JSON.stringify(modifiedEvent.defects[0]) !==
          JSON.stringify(originalEvent.sysDefects[0]);
      }
    } else {
      // the event has defects, let's compare them
      hasEventChanged =
        JSON.stringify(originalEvent.defects) !==
        JSON.stringify(modifiedEvent.defects);
    }
  }

  return hasEventChanged ? EventStatus.MODIFIED : EventStatus.VERIFIED;
};

export { emptyDetect, getLocalTime, getEventStatus };
