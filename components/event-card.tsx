import {
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  RotateCcw,
  SquareStack,
} from 'lucide-react';
import moment from 'moment-timezone';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
import DateIcon from '@/public/icons/event_date.svg';
import DirectionIcon from '@/public/icons/event_direction.svg';
import StatusIcon from '@/public/icons/event_status.svg';
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
  Defect,
} from '@/lib/types';
import { patchEvent, PatchEventData } from '@/lib/api';

import { RectangleOnImage } from './rectangle-on-image';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

export default function EventCard(params: Event) {
  const localEventAt = moment(params.eventAt)
    .tz('Asia/Hong_KOng')
    .format('YYYY/MM/DD HH:mm:ss');
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

  const event: Event = {
    chainage: params.chainage,
    defects:
      params.defects && params.defects.length > 0
        ? Array.from(params.defects)
        : params.sysDefects && params.sysDefects.length > 0
          ? Array.from(params.sysDefects)
          : [emptyDetect],
    direction: params.direction,
    eventAt: params.eventAt,
    id: params.id,
    parentId: params.parentId,
    image: params.image,
    imageSrc: params.imageSrc,
    originalHeight: params.originalHeight,
    originalWidth: params.originalWidth,
    position: params.position,
    remark: params.remark,
    source: params.source,
    status: params.status,
    sysDefects: params.sysDefects,
    sysMetadata: params.sysMetadata,
    carName: params.carName,
  };

  const [modifiedEvent, setModifiedEvent] = useState<Event>({
    ...event,
    defects: JSON.parse(JSON.stringify(event.defects)),
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
      console.log('Event updated successfully:', response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSave = async () => {
    // console.log("Event:", event);
    // console.log("Modified Event:", modifiedEvent);
    // if (
    //   modifiedEvent.status === EventStatus.PENDING &&
    //   event.status !== EventStatus.PENDING
    // ) {
    //   // posible reset
    //   const originalStatus = event.status;
    //   const originalRemark = modifiedEvent.remark;
    //   event.status = EventStatus.PENDING;
    //   modifiedEvent.remark = event.remark;

    //   const hasEventChange =
    //     JSON.stringify(event) !== JSON.stringify(modifiedEvent);
    //   event.status = originalStatus;
    //   modifiedEvent.remark = originalRemark;

    //   if (hasEventChange) {
    //     try {
    //       await updateEvent(modifiedEvent.source, modifiedEvent.id, {
    //         status: EventStatus.MODIFIED,
    //         position: modifiedEvent.position,
    //         chainage: modifiedEvent.chainage,
    //         defects: modifiedEvent.defects,
    //         remark: modifiedEvent.remark,
    //       });

    //       setModifiedEvent({
    //         ...modifiedEvent,
    //         status: EventStatus.MODIFIED,
    //       });

    //       toast({
    //         title: 'Update event',
    //         description: 'Event updated successfully.',
    //       });
    //     } catch (error) {
    //       console.error('Error updating event:', error);
    //       toast({
    //         title: 'Update event',
    //         description: 'Event updated failed.',
    //         variant: 'destructive',
    //       });
    //     }
    //   } else {
    //     try {
    //       await updateEvent(modifiedEvent.source, modifiedEvent.id, {
    //         status: EventStatus.PENDING,
    //         position: modifiedEvent.position,
    //         chainage: modifiedEvent.chainage,
    //         defects: modifiedEvent.defects,
    //         remark: modifiedEvent.remark,
    //       });

    //       toast({
    //         title: 'Update event',
    //         description: 'Event updated successfully.',
    //       });
    //     } catch (error) {
    //       console.error('Error updating event:', error);
    //       toast({
    //         title: 'Update event',
    //         description: 'Event updated failed.',
    //         variant: 'destructive',
    //       });
    //     }
    //   }

    //   return;
    // }
    const aModifiedEvent = {
      ...modifiedEvent,
      status: event.status,
      remark: event.remark,
    };

    console.log('event:', event);
    console.log('aModifiedEvent:', aModifiedEvent);
    const hasEventChange =
      JSON.stringify(event) !== JSON.stringify(aModifiedEvent);

    if (hasEventChange) {
      try {
        await updateEvent(modifiedEvent.source, modifiedEvent.id, {
          status: EventStatus.MODIFIED,
          position: modifiedEvent.position,
          chainage: modifiedEvent.chainage,
          defects: modifiedEvent.defects,
          remark: modifiedEvent.remark,
        });

        setModifiedEvent({
          ...modifiedEvent,
          status: EventStatus.MODIFIED,
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
    } else {
      if (modifiedEvent.status !== EventStatus.PENDING) {
        return;
      }

      try {
        await updateEvent(modifiedEvent.source, modifiedEvent.id, {
          status: EventStatus.VERIFIED,
        });

        setModifiedEvent({
          ...modifiedEvent,
          status: EventStatus.VERIFIED,
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
    }
  };

  const handleRemarkSave = async () => {
    try {
      const status =
        modifiedEvent.status === EventStatus.PENDING
          ? EventStatus.VERIFIED
          : modifiedEvent.status;

        await updateEvent(
          modifiedEvent.source,
          modifiedEvent.id,
          {
            status: status,
          remark: modifiedEvent.remark,
          },
        );

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

  console.log('event:', event.defects);
  console.log('modifiedEvent:', modifiedEvent.defects);

  return (
    <div className="flex items-center justify-center p-1">
      <Card className="w-full max-w-2xl border-slate-800 bg-slate-900 text-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col items-center justify-between">
            <div className="space-y-4">
              {/* Main Content */}
              <div className="grid grid-cols-[3fr,2fr] gap-2">
                {/* Left side - Image placeholder */}

                {/* relative aspect-[4/3] bg-gray-800 rounded-lg border border-gray-500 overflow-hidden */}
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
                  {/* <img src={`http://20.205.128.43:10001${imageSrc}`} alt="Event Image" className="object-cover w-full h-full rounded-lg" /> */}
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

                {/* Right side - Details */}
                <div className="space-y-2 text-sm">
                  {/* date  */}
                  <div className="flex items-center justify-between pb-2">
                    <Image src={DateIcon} alt="Date" />
                    <div className="w-full pl-4 text-gray-400">
                      {localEventAt}
                    </div>
                  </div>

                  {/* car name */}
                  <div className="flex items-center justify-between pb-2">
                    <Image src={DateIcon} alt="Date" />
                    <div className="w-full pl-4 text-gray-400">
                      {event.carName}
                    </div>
                  </div>

                  {/* status */}
                  <div className="flex items-center gap-1 pb-2">
                    <Image src={StatusIcon} alt="Status" />
                    <div className="flex w-full flex-row items-center gap-x-2 pl-4">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">
                        {statusTranslations[modifiedEvent.status]}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 text-transparent" />
                  </div>

                  <Separator className="mb-2 mt-2" />

                  <div className="flex items-center justify-between gap-x-2">
                    <Image src={DirectionIcon} alt="Direction" />
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
                    <Image src={ChainangeIcon} alt="Chainange" />
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
                    <Image src={ChainangeIcon} alt="Chainange" />
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
                    <Image src={ClassIcon} alt="Class" />
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
                    <Image src={ClassIcon} alt="Class" />
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

                  <div className="relative">
                    {/* <Textarea 
                      className="w-full h-24 bg-gray-800 rounded-md p-2 text-sm text-gray-300 resize-none border-gray-800"
                      defaultValue={remark}
                      readOnly
                    /> */}
                    {/* <Button size="icon" variant="ghost" className="absolute right-2 top-2">
                      <Copy className="w-4 h-4" />
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid w-full gap-1.5">
              <Label
                htmlFor="message"
                className="text-sm text-muted-foreground"
              >
                Remark
              </Label>
              {/* remark text area */}
              <div className="relative">
                <Textarea
                  onChange={(e) => {
                    setModifiedEvent({
                      ...modifiedEvent,
                      remark: e.target.value,
                    });
                  }}
                  value={modifiedEvent.remark}
                  className="w-full resize-none rounded-md border-zinc-800 bg-slate-900 p-2 pr-12 text-sm"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute bottom-2 right-2"
                  onClick={handleRemarkSave}
                >
                  <Check className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2 border-t border-gray-800 p-4">
          <Button className="flex-1" variant="secondary" onClick={handleSave}>
            Save
          </Button>
          <Button size="icon" variant="secondary">
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          {/* <Link href={`/event-verification?id=${id}`}>
            <Button size="icon" variant="secondary">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link> */}
        </CardFooter>
      </Card>
    </div>
  );
}
