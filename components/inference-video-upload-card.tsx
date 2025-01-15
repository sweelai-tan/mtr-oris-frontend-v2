'use client';

import { Info, Upload } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment-timezone';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import { cn } from '@/lib/utils';
import {
  createInference,
  getPresignedUploadUri,
  updateInference,
} from '@/lib/api';
import { useConfig } from '@/lib/config-context';
import { toast } from '@/hooks/use-toast';

import { Card, CardContent, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Progress } from './ui/progress';

const formSchema = z.object({
  videoDate: z.string().nonempty('Video date is required'),
  remark: z.string().max(100, 'Remark must be 100 characters or less'),
  file: z
    .custom<File>()
    .refine((file) => file !== null, 'File is required')
    .refine(
      (file) => file && ['video/mp4', 'video/avi'].includes(file.type),
      'File format should be MP4 or AVI',
    )
    .refine((file) => file && file.size <= 2 * 1024 * 1024 * 1024, {
      message: 'File size should not exceed 2GB',
    }),
});

type FormData = z.infer<typeof formSchema>;

interface InferenceVideoUploadCardProps {
  onUploadSuccess: () => void;
}

export default function InferenceVideoUploadCard({
  onUploadSuccess,
}: InferenceVideoUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const { source } = useConfig();

  useEffect(() => {
    if (isUploadSuccess) {
      onUploadSuccess();
    }
  }, [isUploadSuccess, onUploadSuccess]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoDate: '',
      remark: '',
      file: undefined,
    },
  });

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop();
  };

  // const simulateUpload = () => {
  //   return new Promise<void>((resolve) => {
  //     let progress = 0;
  //     const interval = setInterval(() => {
  //       progress += 10;
  //       setUploadProgress(progress);
  //       if (progress >= 100) {
  //         clearInterval(interval);
  //         resolve();
  //       }
  //     }, 500);
  //   });
  // };

  const onSubmit = async (data: FormData) => {
    if (!source) {
      return;
    }

    try {
      // Handle form submission
      console.log(data);
      const hktMoment = moment.tz(data.videoDate, 'Asia/Hong_Kong');
      const utcMoment = hktMoment.clone().utc();

      setIsUploading(true);

      const inference = await createInference(source, {
        eventAt: utcMoment.toISOString(),
        comment: data.remark,
      });

      console.log(`Inference created: ${inference.id}`);

      // how to get filename extension?
      const filename = `${inference.id}_${source}_${data.videoDate}.${getFileExtension(data.file.name)}`;
      const presignedUploadUri = await getPresignedUploadUri(filename);

      const uploadResponse = await axios.put(presignedUploadUri, data.file, {
        headers: {
          'Content-Type': data.file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total),
            );
          }
        },
      });

      if (uploadResponse.status === 200) {
        const inference2 = await updateInference(source, inference.id, {
          videoFilename: filename,
        });

        console.log(`Inference updated: ${inference2.id}`);

        toast({
          title: 'Upload successful',
          description: 'The video has been uploaded successfully.',
        });

        setIsUploadSuccess(true);
        return;
      }

      toast({
        title: 'Upload failed',
        description: 'An error occurred while uploading the video.',
        variant: 'destructive',
      });
      // await simulateUpload();
    } catch (error) {
      console.error(error);

      toast({
        title: 'Upload failed',
        description: 'An error occurred while uploading the video.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      form.setValue('file', droppedFile);
      form.trigger('file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      form.setValue('file', selectedFile);
      form.trigger('file');
    }
  };

  return (
    <div className="flex w-full items-center justify-center p-2">
      <Card className="w-full border-slate-800 bg-slate-900 p-4 text-slate-200">
        <CardTitle>Information</CardTitle>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>AI training model</Label>
                  <div className="mt-1 font-medium">Model 1</div>
                  <Alert className="mt-2 border-slate-700 bg-slate-800">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      The current AI model has been selected. If you would like
                      to use a different model, please deploy the model you
                      prefer.
                    </AlertDescription>
                  </Alert>
                </div>

                {/* date */}
                <div className="max-w-sm">
                  <FormField
                    disabled={isUploading}
                    control={form.control}
                    name="videoDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="mt-1 border-slate-700 bg-slate-800 text-slate-200"
                            placeholder="DD/MM/YYYY"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* remark */}
                <FormField
                  disabled={isUploading}
                  control={form.control}
                  name="remark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remark</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Fill in the note about the video"
                          className="mt-1 min-h-[100px] border-slate-700 bg-slate-800 text-slate-200"
                          maxLength={100}
                          {...field}
                        />
                      </FormControl>
                      <div className="mt-1 text-sm text-slate-400">
                        {field.value.length}/100
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* file */}
                <FormField
                  disabled={isUploading}
                  control={form.control}
                  name="file"
                  render={(
                    { field: { value, onChange, ...field } }, // eslint-disable-line @typescript-eslint/no-unused-vars
                  ) => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <div
                          className={cn(
                            'mt-1 rounded-lg border-2 border-dashed p-8',
                            'border-slate-700 bg-slate-800/50',
                            'flex flex-col items-center justify-center gap-2',
                            'cursor-pointer transition-colors hover:border-slate-600',
                          )}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            className="hidden"
                            accept=".mp4,.avi"
                            onChange={handleFileSelect}
                            {...field}
                            ref={fileInputRef}
                          />
                          <Upload className="h-8 w-8 text-slate-400" />
                          <div className="text-center text-sm text-slate-400">
                            {file
                              ? file.name
                              : 'Click or drag the file to this area to upload'}
                          </div>
                        </div>
                      </FormControl>
                      <div className="mt-2 flex justify-between text-sm text-slate-400">
                        <div>Formats supported: MP4, AVI</div>
                        <div>Maximum size: 2 GB</div>
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {isUploading && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} />
                    <p className="text-center text-sm text-slate-400">
                      Uploading: {uploadProgress}%
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="bg-cyan-500 text-white hover:bg-cyan-600"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Submit'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
