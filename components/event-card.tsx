import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  RotateCcw,
  SquareStack,
  TrainFront,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ClassIcon from '@/public/icons/defect_class.svg';
import ChainangeIcon from '@/public/icons/event_chainange.svg';
import DirectionIcon from '@/public/icons/event_direction.svg';
import {
  Event,
  EventSource,
  DefectGroup,
  statusTranslations,
  DefectClass,
  EventDirection,
  EventPosition,
  eventDirectionList,
  eventPositionList,
  defectGroupList,
  abnormalDefectList,
  normalDefectList,
  unknownDefectList,
  EventStatus,
  getEventDirectionLabel,
  getEventPositionLabel,
  getDefectClassLabel,
  getDefectGroupLabel,
} from '@/lib/types';
import { patchEvent, PatchEventData } from '@/lib/api';
import { emptyDetect, getEventStatus, getLocalTime } from '@/lib/event.util';

import { RectangleOnImage } from './rectangle-on-image';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface EventCardProps {
  event: Event;
  onEventDuplicate: (event: Event) => void;
}

export default function EventCard(params: EventCardProps) {
  const { event, onEventDuplicate } = params;
  const [modifiedEvent, setModifiedEvent] = useState<Event>({
    ...event,
    defects:
      event.defects && event.defects.length > 0
        ? JSON.parse(JSON.stringify(event.defects))
        : event.sysDefects && event.sysDefects.length > 0
          ? JSON.parse(JSON.stringify(event.sysDefects))
          : [emptyDetect],
  });
  const { toast } = useToast();
  const router = useRouter();

  const updateEvent = async (
    source: string,
    id: string,
    patchEventData: PatchEventData,
  ) => {
    try {
      const response = await patchEvent(source, id, patchEventData);
      console.log('Event updated successfully:', response);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleSave = async () => {
    const newStatus = getEventStatus(event, modifiedEvent);
    console.log('newStatus:', newStatus);

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
    try {
      // const status =
      //   modifiedEvent.status === EventStatus.PENDING
      //     ? EventStatus.VERIFIED
      //     : modifiedEvent.status;

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

  const handleImageDoubleClick = () => {
    router.push(`/dashboard/event-verification?id=${event.id}`);
  };

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

  const defect =
    modifiedEvent.defects.length === 0
      ? modifiedEvent.sysDefects.length === 0
        ? null
        : modifiedEvent.sysDefects[0]
      : modifiedEvent.defects[0];

  // console.log('event:', event.defects);
  // console.log('modifiedEvent:', modifiedEvent.defects);

  return (
    <div className="flex w-full items-center justify-center p-1">
      <Card className="w-full border-slate-800 bg-slate-900 text-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col items-center justify-between">
            <div className="w-full space-y-4">
              {/* Main Content */}
              <div className="grid grid-cols-[3fr,2fr] gap-2">
                {/* Left side - Image placeholder */}

                {/* relative aspect-[4/3] bg-gray-800 rounded-lg border border-gray-500 overflow-hidden */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          modifiedEvent.source === EventSource.SIL_VIDEO ||
                            modifiedEvent.source === EventSource.TML_VIDEO
                            ? 'aspect-w-4 aspect-h-3 relative'
                            : 'aspect-w-3 aspect-h-4 relative',
                          'overflow-hidden rounded-lg border border-gray-500 bg-gray-800',
                        )}
                        onDoubleClick={handleImageDoubleClick}
                      >
                        <RectangleOnImage
                          imageUrl={`/v1/${event.imageSrc}`}
                          originalHeight={event.originalHeight}
                          originalWidth={event.originalWidth}
                          rectX={defect ? defect.xMin : 0}
                          rectY={defect ? defect.yMin : 0}
                          rectWidth={defect ? defect.width : 0}
                          rectHeight={defect ? defect.length : 0}
                        />
                        {event.parentId ? (
                          <div className="absolute bottom-2 right-2">
                            <SquareStack className="h-4 w-4" />
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Double click to view event detail</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Right side - Details */}
                <div className="space-y-2 text-sm">
                  {/* car name */}
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
                      {event.carName}
                    </div>
                  </div>

                  {/* date  */}
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
                    <div className="w-full pl-4 text-gray-400">
                      {getLocalTime(event.eventAt)}
                    </div>
                  </div>

                  <Separator className="mb-2 mt-2" />

                  {/* direction */}
                  <div className="flex items-center justify-between gap-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Image src={DirectionIcon} alt="Direction" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Track</p>
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

                  {/* chainage */}
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
                          <p>Event Type</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {/* <span className="text-gray-400 w-full pl-4">
                      {sysDefects.length === 0
                        ? groupTranslations[DefectGroup.UNKNOWN]
                        : groupTranslations[sysDefects[0].group]}
                    </span> */}
                    <Select
                      defaultValue={
                        modifiedEvent.defects.length === 0
                          ? DefectGroup.UNKNOWN
                          : modifiedEvent.defects[0].group
                      }
                      onValueChange={(v: DefectGroup) => {
                        console.log(v);
                        console.log(modifiedEvent);

                        const newDefect = { ...modifiedEvent };
                        newDefect.defects[0].group = v;
                        setModifiedEvent({ ...newDefect });
                      }}
                    >
                      <SelectTrigger className="border-zinc-800">
                        <SelectValue>
                          {getDefectGroupLabel(
                            modifiedEvent.defects.length === 0
                              ? DefectGroup.UNKNOWN
                              : modifiedEvent.defects[0].group,
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
                      defaultValue={
                        modifiedEvent.defects.length === 0
                          ? DefectClass.UNKNOWN
                          : modifiedEvent.defects[0].class
                      }
                      onValueChange={(v: DefectClass) => {
                        console.log(v);

                        const newDefect = { ...modifiedEvent };
                        newDefect.defects[0].class = v;
                        newDefect.defects[0].name = getDefectClassLabel(v);
                        setModifiedEvent({ ...newDefect });
                      }}
                    >
                      <SelectTrigger className="border-zinc-800">
                        <SelectValue>
                          {getDefectClassLabel(
                            modifiedEvent.defects.length === 0
                              ? DefectClass.UNKNOWN
                              : modifiedEvent.defects[0].class,
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {/* {defectGroupList.map((group, index) => (
                          <SelectItem key={index} value={group.value}>
                            {group.label}
                          </SelectItem>
                        ))} */}
                        {modifiedEvent.defects.length === 0
                          ? unknownDefectList.map((defect, index) => (
                              <SelectItem key={index} value={defect.value}>
                                {defect.label}
                              </SelectItem>
                            ))
                          : modifiedEvent.defects[0].group ===
                              DefectGroup.ABNORMAL
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
                  <div>
                    <Label
                      htmlFor="message"
                      className="text-sm text-muted-foreground"
                    >
                      Remark
                    </Label>
                    {/* remark text area */}
                    <div className="relative pt-2">
                      <Textarea
                        onChange={(e) => {
                          setModifiedEvent({
                            ...modifiedEvent,
                            remark: e.target.value,
                          });
                        }}
                        value={modifiedEvent.remark}
                        className="w-full resize-none rounded-md border-zinc-800 bg-slate-700 p-2 pr-12 text-sm"
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
                          <TooltipContent>Save remark</TooltipContent>
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

                  {/* buttons */}
                  <div className="flex gap-2 border-t border-gray-800 pt-4">
                    <Button
                      className="flex-1"
                      variant="secondary"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                    {/* Duplicate */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => onEventDuplicate(event)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Duplicate event</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {/* Reset */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={handleReset}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reset event</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
