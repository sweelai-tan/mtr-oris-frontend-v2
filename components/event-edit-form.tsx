import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Hand,
  Moon,
  MoveUpLeftIcon,
  RotateCcw,
  Sun,
  TrainFront,
} from 'lucide-react';
import moment from 'moment-timezone';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ClassIcon from '@/public/icons/defect_class.svg';
import ChainangeIcon from '@/public/icons/event_chainange.svg';
import DirectionIcon from '@/public/icons/event_direction.svg';
import {
  abnormalDefectList,
  DefectClass,
  DefectGroup,
  defectGroupList,
  Event,
  EventDirection,
  eventDirectionList,
  EventPosition,
  eventPositionList,
  EventStatus,
  getDefectClassLabel,
  getDefectGroupLabel,
  getEventDirectionLabel,
  getEventPositionLabel,
  normalDefectList,
  statusTranslations,
  unknownDefectList,
} from '@/lib/types';
import { emptyDetect, getEventStatus } from '@/lib/event.util';
import { patchEvent, PatchEventData } from '@/lib/api';
import ZoomInIcon from '@/public/icons/zoom_in.svg';
import ZoomOutIcon from '@/public/icons/zoom_out.svg';
import ZoomFullIcon from '@/public/icons/zoom_full.svg';
import ZoomResetIcon from '@/public/icons/zoom_reset.svg';

import { RectangleOnImage, RectangleOnImageHandle } from './rectangle-on-image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Separator } from './ui/separator';

interface EventEditFormProps {
  className?: string;
  event: Event;
  previousEventId: string | null;
  nextEventId: string | null;
  onEventUpdated?: (event: Event) => void;
}

export default function EventEditForm({
  className,
  event,
  previousEventId,
  nextEventId,
  onEventUpdated,
}: EventEditFormProps) {
  console.log(`EventEditForm event: ${JSON.stringify(event)}`);
  const [modifiedEvent, setModifiedEvent] = useState<Event>({
    ...event,
    defects:
      event.defects && event.defects.length > 0
        ? JSON.parse(JSON.stringify(event.defects))
        : event.sysDefects && event.sysDefects.length > 0
          ? JSON.parse(JSON.stringify(event.sysDefects))
          : [emptyDetect],
  });
  // const [originalEvent, setOriginalEvent] = useState<Event | null>(null);
  const rectOnImageRef = useRef<RectangleOnImageHandle>(null);
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [isMovable, setIsMovable] = useState(false);
  const [isPanable, setIsPanable] = useState(false);

  useEffect(() => {
    console.log('onload');
    // console.log('event:', event);
    if (modifiedEvent === null || event.id !== modifiedEvent.id) {
      // const aDefect = event.defects.length === 0
      //   ? event.sysDefects.length === 0
      //     ? emptyDetect
      //     : event.sysDefects[0]
      //   : event.defects[0];
      const defects =
        event.defects && event.defects.length > 0
          ? Array.from(event.defects)
          : event.sysDefects && event.sysDefects.length > 0
            ? Array.from(event.sysDefects)
            : [emptyDetect];

      const duplicateEvent = JSON.parse(JSON.stringify(event)) as Event;

      setModifiedEvent({
        ...duplicateEvent,
        defects: JSON.parse(JSON.stringify(defects)),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const localEventAt = moment(event.eventAt)
    .tz('Asia/Hong_Kong')
    .format('YYYY/MM/DD HH:mm:ss');

  const updateEvent = async (
    source: string,
    id: string,
    patchEventData: PatchEventData,
  ): Promise<Event> => {
    try {
      // const response = await axios.patch(
      //   `/events/${source}/${id}`,
      //   updateEvent,
      // );
      const response = await patchEvent(source, id, patchEventData);
      console.log('Event updated successfully:', response);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleSave = async () => {
    if (modifiedEvent === null) {
      console.error('modifiedEvent is null');
      return;
    }
    // console.log('modifiedEvent:', modifiedEvent);

    // const aModifiedEvent = JSON.parse(JSON.stringify(modifiedEvent)) as Event;
    // aModifiedEvent.status = originalEvent.status;
    // aModifiedEvent.remark = originalEvent.remark;

    if (rectOnImageRef.current) {
      const rect = rectOnImageRef.current.getRect();
      if (rect !== null) {
        console.log('rect:', rect.x);
        // only update defect if more than 2
        const yMinDiff = Math.abs(rect.y - modifiedEvent.defects[0].yMin) > 2;
        const xMinDiff = Math.abs(rect.x - modifiedEvent.defects[0].xMin) > 2;
        const yMaxDiff =
          Math.abs(rect.y + rect.height - modifiedEvent.defects[0].yMax) > 2;
        const xMaxDiff =
          Math.abs(rect.x + rect.width - modifiedEvent.defects[0].xMax) > 2;

        if (yMinDiff || xMinDiff || yMaxDiff || xMaxDiff) {
          modifiedEvent.defects[0].xMin = rect.x;
          modifiedEvent.defects[0].yMin = rect.y;
          modifiedEvent.defects[0].width = rect.width;
          modifiedEvent.defects[0].length = rect.height;
          modifiedEvent.defects[0].xMax = rect.x + rect.width;
          modifiedEvent.defects[0].yMax = rect.y + rect.height;
        }
      }
    }

    const newStatus = getEventStatus(event, modifiedEvent);

    console.log('newStatus:', newStatus);

    // let hasEventChange =
    //   JSON.stringify(originalEvent) !== JSON.stringify(aModifiedEvent);
    // console.log('hasEventChange:', hasEventChange);

    // aModifiedEvent.status = modifiedEvent.status;
    // aModifiedEvent.remark = modifiedEvent.remark;

    // console.log('originalEvent.defect:', originalEvent.defects[0]);
    // console.log('modifiedEvent.defect:', modifiedEvent.defects[0]);

    // check if defects are changed or copied from sysDefects
    // if (hasEventChange) {
    //   if (
    //     JSON.stringify(event.sysDefects[0]) ===
    //     JSON.stringify(aModifiedEvent.defects[0])
    //   ) {
    //     hasEventChange = false;
    //   }
    // }

    // if (hasEventChange) {
    //   try {
    //     const response = await updateEvent(
    //       modifiedEvent.source,
    //       modifiedEvent.id,
    //       {
    //         status: EventStatus.MODIFIED,
    //         direction: aModifiedEvent.direction,
    //         position: aModifiedEvent.position,
    //         chainage: aModifiedEvent.chainage,
    //         defects: aModifiedEvent.defects,
    //         remark: aModifiedEvent.remark,
    //       },
    //     );

    //     setModifiedEvent({
    //       ...response,
    //     });

    //     setOriginalEvent(JSON.parse(JSON.stringify(response)));

    //     if (onEventUpdated) {
    //       onEventUpdated(JSON.parse(JSON.stringify(response)));
    //     }

    //     toast({
    //       title: 'Update event',
    //       description: 'Event updated successfully.',
    //     });
    //   } catch (error) {
    //     console.error('Error updating event:', error);
    //     toast({
    //       title: 'Update event',
    //       description: 'Event updated failed.',
    //       variant: 'destructive',
    //     });
    //   }
    // } else {
    //   try {
    //     // update status only with remark
    //     if (modifiedEvent.status === EventStatus.PENDING) {
    //       const response = await updateEvent(
    //         modifiedEvent.source,
    //         modifiedEvent.id,
    //         {
    //           status: EventStatus.VERIFIED,
    //           remark: modifiedEvent.remark,
    //         },
    //       );
    //       toast({
    //         title: 'Update event',
    //         description: 'Event updated successfully.',
    //       });

    //       setModifiedEvent({
    //         ...response,
    //       });

    //       if (onEventUpdated) {
    //         onEventUpdated(JSON.parse(JSON.stringify(response)));
    //       }
    //       return;
    //     }

    //     // if only remark changed, update remark only
    //     if (modifiedEvent.remark !== originalEvent.remark) {
    //       const response = await updateEvent(
    //         modifiedEvent.source,
    //         modifiedEvent.id,
    //         {
    //           remark: modifiedEvent.remark,
    //         },
    //       );
    //       toast({
    //         title: 'Update event',
    //         description: 'Event updated successfully.',
    //       });

    //       setModifiedEvent({
    //         ...response,
    //       });

    //       if (onEventUpdated) {
    //         onEventUpdated(JSON.parse(JSON.stringify(response)));
    //       }
    //       return;
    //     }
    //   } catch (error) {
    //     console.error('Error updating event:', error);
    //     toast({
    //       title: 'Update event',
    //       description: 'Event updated failed.',
    //       variant: 'destructive',
    //     });
    //   }
    // }
    try {
      const response = await updateEvent(
        modifiedEvent.source,
        modifiedEvent.id,
        {
          status: newStatus,
          direction: modifiedEvent.direction,
          position: modifiedEvent.position,
          chainage: modifiedEvent.chainage,
          defects: modifiedEvent.defects,
          remark: modifiedEvent.remark,
        },
      );

      setModifiedEvent({
        ...response,
      });

      if (onEventUpdated) {
        onEventUpdated(JSON.parse(JSON.stringify(response)));
      }

      toast({
        title: 'Update event',
        description: 'Event updated successfully.',
      });
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: 'Update event',
        description: 'Event updated failed.',
        variant: 'destructive',
      });
    }
  };

  const handleRemarkSave = async () => {
    if (modifiedEvent === null) {
      return;
    }

    try {
      await updateEvent(modifiedEvent.source, modifiedEvent.id, {
        // status: status,
        remark: modifiedEvent.remark,
      });

      toast({
        title: 'Update event',
        description: 'Event updated successfully.',
      });
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: 'Update event',
        description: 'Event updated failed.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (rectOnImageRef.current) {
      rectOnImageRef.current.setBrightnessInPercent(brightness);
    }
  }, [brightness]);

  useEffect(() => {
    if (rectOnImageRef.current) {
      rectOnImageRef.current.setContrastInPercent(contrast);
    }
  }, [contrast]);

  if (modifiedEvent === null) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-cyan-500"></div>
      </div>
    );
  }

  const handleReset = () => {
    // change the defects to original
    const defects =
      event.sysDefects && event.sysDefects.length > 0
        ? Array.from(event.sysDefects)
        : event.defects && event.defects.length > 0
          ? Array.from(event.defects)
          : [emptyDetect];
    setModifiedEvent({
      ...event,
      defects: JSON.parse(JSON.stringify(defects)),
    });
  };

  // console.log('setModifiedEvent:', modifiedEvent.defects[0].xMin);
  // console.log('setOriginalEvent:', originalEvent?.defects[0].xMin);

  // Canvas drawing and interaction logic (same as previous component)
  return (
    <div className={cn(className, 'flex gap-x-2 text-gray-200')}>
      {/* Left side - Image and toolbar */}
      <div className="flex basis-2/3 flex-col">
        {/* Toolbar */}
        <div className="flex flex-col items-start justify-start border-b p-1 lg:flex-row lg:justify-between lg:gap-x-20">
          {/* Adjust panel*/}
          <div className="flex items-start space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* move button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('border', isMovable ? 'border-cyan-500' : '')}
                    onClick={() => {
                      if (rectOnImageRef.current) {
                        // if zoom level is not 1, disable move
                        if (rectOnImageRef.current.getZoomLevel() !== 1) {
                          return;
                        }
                        if (isPanable && !isMovable) {
                          setIsPanable(false);
                        }
                        setIsMovable(!isMovable);
                      }
                    }}
                  >
                    <MoveUpLeftIcon
                      className={cn(
                        'h-4 w-4',
                        isMovable ? 'text-cyan-500' : '',
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Move</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsMovable(false);
                      if (rectOnImageRef.current) {
                        rectOnImageRef.current.zoomIn();
                      }
                    }}
                  >
                    <Image src={ZoomInIcon} alt="ZoomIn" className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom In</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsMovable(false);
                      if (rectOnImageRef.current) {
                        rectOnImageRef.current.zoomOut();
                      }
                    }}
                  >
                    <Image
                      src={ZoomOutIcon}
                      alt="ZoomOut"
                      className="h-4 w-4"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom Out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsMovable(false);
                      if (rectOnImageRef.current) {
                        rectOnImageRef.current.zoomMax();
                      }
                    }}
                  >
                    <Image
                      src={ZoomFullIcon}
                      alt="ZoomFull"
                      className="h-4 w-4"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Full Zoom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsPanable(false);
                      if (rectOnImageRef.current) {
                        rectOnImageRef.current.zoomReset();
                      }
                    }}
                  >
                    <Image
                      src={ZoomResetIcon}
                      alt="ZoomReset"
                      className="h-4 w-4"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset Zoom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('border', isPanable ? 'border-cyan-500' : '')}
                    onClick={() => {
                      if (rectOnImageRef.current) {
                        // if zoom level is 1, disable pan
                        if (rectOnImageRef.current.getZoomLevel() === 1) {
                          return;
                        }
                        if (!isPanable && isMovable) {
                          setIsMovable(false);
                        }
                        setIsPanable(!isPanable);
                      }
                    }}
                  >
                    <Hand className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pan Image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* <Button variant="ghost" size="icon">
              <Hand className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button> */}
          </div>
          {/* Sliders */}
          <div className="flex flex-1 flex-col items-center justify-end gap-y-2 p-4 lg:flex-row lg:space-x-6">
            <div className="flex items-center space-x-4">
              <Sun className="h-5 w-5 text-gray-400" />
              <div className="flex flex-1 items-center space-x-2">
                <Slider
                  value={[brightness]}
                  onValueChange={(value) => setBrightness(value[0])}
                  max={100}
                  step={1}
                  className="min-w-[120px]"
                />
                <span className="min-w-[24px] text-sm text-gray-400">
                  {brightness}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Moon className="h-5 w-5 text-gray-400" />
              <div className="flex flex-1 items-center space-x-2">
                <Slider
                  value={[contrast]}
                  onValueChange={(value) => setContrast(value[0])}
                  max={100}
                  step={1}
                  className="min-w-[120px]"
                />
                <span className="min-w-[24px] text-sm text-gray-400">
                  {contrast}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main canvas area */}
        <div className="relative h-full w-full flex-1 overflow-hidden">
          <RectangleOnImage
            imageUrl={`/v1/${modifiedEvent.imageSrc}`}
            originalHeight={modifiedEvent.originalHeight}
            originalWidth={modifiedEvent.originalWidth}
            rectX={modifiedEvent.defects ? modifiedEvent.defects[0].xMin : 0}
            rectY={modifiedEvent.defects ? modifiedEvent.defects[0].yMin : 0}
            rectWidth={
              modifiedEvent.defects ? modifiedEvent.defects[0].width : 0
            }
            rectHeight={
              modifiedEvent.defects ? modifiedEvent.defects[0].length : 0
            }
            editable
            isMovable={isMovable}
            isPanable={isPanable}
            ref={rectOnImageRef}
          />
        </div>
      </div>

      {/* Right side - Info panel */}
      <div className="flex basis-1/3 flex-col border-l border-gray-800 bg-gray-900 p-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between pb-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TrainFront className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Car Name</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="w-full pl-4 text-gray-400">
              {modifiedEvent.carName}
            </div>
          </div>

          <div className="flex items-center justify-between pb-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Event Date</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="w-full pl-4 text-gray-400">{localEventAt}</div>
          </div>

          <Separator className="mb-2 mt-2" />

          <div className="flex items-center justify-between gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image src={DirectionIcon} alt="Direction" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Direction</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Select
              defaultValue={modifiedEvent.direction}
              onValueChange={(value: EventDirection) => {
                setModifiedEvent({
                  ...modifiedEvent,
                  direction: value,
                });
              }}
            >
              <SelectTrigger className="border-zinc-800">
                <SelectValue>
                  {getEventDirectionLabel(modifiedEvent.direction)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {eventDirectionList.map((eventDirection, index) => (
                  <SelectItem key={index} value={eventDirection.value}>
                    {eventDirection.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image src={ChainangeIcon} alt="Chainange" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chainage</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* <span className="text-gray-400 w-full pl-4">{chainage}</span> */}
            <Input
              type="number"
              value={modifiedEvent.chainage}
              onChange={(e) => {
                setModifiedEvent({
                  ...modifiedEvent,
                  chainage: parseFloat(e.target.value),
                });
              }}
            />
            {/* <ChevronDown className="w-4 h-4 text-gray-400" /> */}
          </div>

          <div className="flex items-center justify-between gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image src={ChainangeIcon} alt="Chainange" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Position</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Select
              defaultValue={modifiedEvent.position}
              onValueChange={(v: EventPosition) => {
                setModifiedEvent({
                  ...modifiedEvent,
                  position: v,
                });
              }}
            >
              <SelectTrigger className="border-zinc-800">
                <SelectValue>
                  {getEventPositionLabel(modifiedEvent.position)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {eventPositionList.map((position, index) => (
                  <SelectItem key={index} value={position.value}>
                    {position.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image src={ClassIcon} alt="Class" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Event Class</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Select
              value={
                modifiedEvent.defects && modifiedEvent.defects.length !== 0
                  ? modifiedEvent.defects[0].group
                  : DefectGroup.UNKNOWN
              }
              onValueChange={(v: DefectGroup) => {
                console.log(`group: ${v}`);
                const newDefect = { ...modifiedEvent };
                newDefect.defects[0].group = v;
                newDefect.defects[0].class = DefectClass.UNKNOWN;
                setModifiedEvent({ ...newDefect });
              }}
            >
              <SelectTrigger className="border-zinc-800">
                <SelectValue>
                  {getDefectGroupLabel(
                    modifiedEvent.defects && modifiedEvent.defects.length !== 0
                      ? modifiedEvent.defects[0].group
                      : DefectGroup.UNKNOWN,
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {defectGroupList.map((group, index) => (
                  <SelectItem key={index} value={group.value}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* <ChevronDown className="w-4 h-4 text-gray-400" /> */}
          </div>

          <div className="flex items-center justify-between gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image src={ClassIcon} alt="Class" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Event Class</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* <span className="text-gray-400 w-full pl-4">
                    {sysDefects.length === 0
                      ? classTranslations[DefectClass.UNKNOWN]
                      : classTranslations[sysDefects[0].class]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" /> */}
            <Select
              value={
                modifiedEvent.defects && modifiedEvent.defects.length > 0
                  ? modifiedEvent.defects[0].class
                  : DefectClass.UNKNOWN
              }
              onValueChange={(v: DefectClass) => {
                console.log(`class: ${v}`);

                const newDefect = { ...modifiedEvent };
                newDefect.defects[0].class = v;
                setModifiedEvent({ ...newDefect });
              }}
            >
              <SelectTrigger className="border-zinc-800">
                <SelectValue>
                  {getDefectClassLabel(
                    modifiedEvent.defects && modifiedEvent.defects.length !== 0
                      ? modifiedEvent.defects[0].class
                      : DefectClass.UNKNOWN,
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {/* {defectGroupList.map((group, index) => (
                        <SelectItem key={index} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))} */}
                {!modifiedEvent.defects || modifiedEvent.defects.length === 0
                  ? unknownDefectList.map((defect, index) => (
                      <SelectItem key={index} value={defect.value}>
                        {defect.label}
                      </SelectItem>
                    ))
                  : modifiedEvent.defects[0].group === DefectGroup.ABNORMAL
                    ? abnormalDefectList.map((defect, index) => (
                        <SelectItem key={index} value={defect.value}>
                          {defect.label}
                        </SelectItem>
                      ))
                    : normalDefectList.map((defect, index) => (
                        <SelectItem key={index} value={defect.value}>
                          {defect.label}
                        </SelectItem>
                      ))}
              </SelectContent>
            </Select>
          </div>

          {/* remark */}
          <div className="flex flex-col pt-4">
            <span className="w-full pb-2 pl-4 text-gray-400">Remarks</span>
            <div className="relative">
              <Textarea
                className="h-16 w-full resize-none rounded-md border-zinc-800 bg-slate-700 p-2 text-sm"
                value={modifiedEvent.remark}
                onChange={(e) => {
                  setModifiedEvent({
                    ...modifiedEvent,
                    remark: e.target.value,
                  });
                }}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute bottom-2 right-2"
                      onClick={handleRemarkSave}
                    >
                      <Check className="h-4 w-4 text-gray-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save remark</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* status */}
          <div className="flex items-center gap-1 pb-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* <Image src={StatusIcon} alt="Status" /> */}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Status</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex w-full flex-row items-center gap-x-2 pl-4">
              <CheckCircle2
                className={cn(
                  'h-4 w-4',
                  modifiedEvent.status === EventStatus.PENDING
                    ? 'text-yellow-500'
                    : '',
                  modifiedEvent.status === EventStatus.VERIFIED
                    ? 'text-green-500'
                    : '',
                  modifiedEvent.status === EventStatus.MODIFIED
                    ? 'text-blue-500'
                    : '',
                )}
              />
              <span
                className={cn(
                  modifiedEvent.status === EventStatus.PENDING
                    ? 'text-yellow-500'
                    : '',
                  modifiedEvent.status === EventStatus.VERIFIED
                    ? 'text-green-500'
                    : '',
                  modifiedEvent.status === EventStatus.MODIFIED
                    ? 'text-blue-500'
                    : '',
                )}
              >
                {statusTranslations[modifiedEvent.status]}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 text-transparent" />
          </div>

          <div className="flex gap-3 border-t border-gray-800 p-4">
            <Button className="flex-1" variant="secondary" onClick={handleSave}>
              Save
            </Button>
            {/* <Button
              className="border border-gray-300"
              size="icon"
              variant="ghost"
            >
              <Copy className="w-4 h-4" />
            </Button> */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className=""
                    size="icon"
                    variant="secondary"
                    onClick={handleReset}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset event</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <Link
            href={
              previousEventId
                ? `/dashboard/event-verification?id=${previousEventId}`
                : '#'
            }
            replace={true}
          >
            <Button variant={'ghost'} disabled={!previousEventId}>
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          </Link>
          <Link
            href={
              nextEventId
                ? `/dashboard/event-verification?id=${nextEventId}`
                : '#'
            }
            replace={true}
          >
            <Button variant={'ghost'} disabled={!nextEventId}>
              <ArrowRight className="h-4 w-4" />
              Next
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
