'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

import DashboardTitle from '@/components/dashboard-title';
import { UserRole, UserStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createUser, getUser, updateUser } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import Loading from '@/components/loading';
import Error from '@/components/error';

const baseSchema = z.object({
  status: z
    .enum([UserStatus.ACTIVE, UserStatus.INACTIVE])
    .refine((value) => value !== undefined, {
      message: 'User status is required',
    }),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  role: z
    .enum([UserRole.OPERATOR, UserRole.USER, UserRole.ADMIN])
    .refine((value) => value !== undefined, {
      message: 'User role is required',
    }),
});

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must include at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
  .regex(/[0-9]/, 'Password must include at least one number')
  .regex(
    /[^a-zA-Z0-9]/,
    'Password must include at least one special character',
  );

const passwordOptionalSchema = z
  .string()
  .optional()
  .refine(
    (data) => {
      console.log(
        '1 data',
        data === undefined || data === '' || data.length >= 8,
      );
      return data === undefined || data === '' || data.length >= 8;
    },
    {
      message: 'Password must be at least 8 characters',
    },
  )
  .refine(
    (data) => {
      console.log(
        '2 data',
        data === undefined || data === '' || /[a-z]/.test(data),
      );
      return data === undefined || data === '' || /[a-z]/.test(data);
    },
    {
      message: 'Password must include at least one lowercase letter',
    },
  )
  .refine(
    (data) => {
      console.log(
        '3 data',
        data === undefined || data === '' || /[A-Z]/.test(data),
      );
      return data === undefined || data === '' || /[A-Z]/.test(data);
    },
    {
      message: 'Password must include at least one uppercase letter',
    },
  )
  .refine(
    (data) => {
      console.log(
        '4 data',
        data === undefined || data === '' || /[0-9]/.test(data),
      );
      return data === undefined || data === '' || /[0-9]/.test(data);
    },
    {
      message: 'Password must include at least one number',
    },
  )
  .refine(
    (data) => {
      console.log(
        '5 data',
        data === undefined || data === '' || /[^a-zA-Z0-9]/.test(data),
      );
      return data === undefined || data === '' || /[^a-zA-Z0-9]/.test(data);
    },
    {
      message: 'Password must include at least one special character',
    },
  );

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const title = userId ? 'Edit User' : 'Add User';
  const isEdit = !!userId;
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const userSchema = isEdit
    ? baseSchema.extend({ password: passwordOptionalSchema })
    : baseSchema.extend({ password: passwordSchema });

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      status: UserStatus.ACTIVE,
      username: '',
      email: '',
      role: UserRole.USER,
      password: undefined,
    },
  });
  console.log('userId', userId);
  console.log('isEdit', isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchUser = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const user = await getUser(userId);

          // update form values
          form.setValue('status', user.status);
          form.setValue('username', user.name);
          form.setValue('email', user.email);
          form.setValue('role', user.role);
          form.setValue('password', '');
        } catch (error) {
          console.error(error);
          setError('An unknown error occurred');
        } finally {
          setIsLoading(false);
        }
      };

      fetchUser();
    }
  }, [form, isEdit, userId]);

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    try {
      // Handle form submission
      let user = null;
      console.log('data--', data);

      if (isEdit) {
        user = await updateUser(
          {
            name: data.username,
            role: data.role,
            password: data.password === '' ? undefined : data.password,
            status: data.status,
          },
          userId,
        );
      } else {
        if (data.password) {
          user = await createUser({
            name: data.username,
            email: data.email,
            role: data.role,
            password: data.password,
            status: data.status,
          });
        }
      }

      if (user) {
        if (isEdit) {
          toast({
            title: 'Edit user',
            description: 'Edit user information successfully.',
          });
        } else {
          toast({
            title: 'Create user',
            description: 'User created successfully.',
          });
        }

        // Redirect to user management page
        router.push('/dashboard/user-management');
      }
      console.log(data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'An error occurred while creating user.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardTitle>{title}</DashboardTitle>
      <div className="mx-auto max-w-4xl p-4">
        {isLoading && <Loading />}
        {error && <Error>{error}</Error>}
        {!isLoading && !error && (
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-slate-200">Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={UserStatus.ACTIVE}
                                id="active"
                              />
                              <Label
                                htmlFor="active"
                                className="text-slate-200"
                              >
                                Active
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={UserStatus.INACTIVE}
                                id="inactive"
                              />
                              <Label
                                htmlFor="inactive"
                                className="text-slate-200"
                              >
                                Inactive
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* username */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-slate-700 bg-slate-800 text-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="border-slate-700 bg-slate-800 text-slate-200"
                            disabled={isEdit}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* role */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-slate-700 bg-slate-800 text-slate-200">
                              <SelectValue placeholder="Select a user group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-slate-700 bg-slate-800">
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="OPERATOR">Operator</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              className="border-slate-700 bg-slate-800 pr-10 text-slate-200"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-slate-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-slate-400" />
                              )}
                              <span className="sr-only">
                                {showPassword
                                  ? 'Hide password'
                                  : 'Show password'}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <div className="text-sm text-slate-400">
                          Password must be at least 8 characters long and
                          include at least one uppercase letter, one lowercase
                          letter, one number, and one special character.
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="bg-cyan-500 text-white hover:bg-cyan-600"
                    >
                      Submit
                    </Button>
                    <Link href="/dashboard/user-management">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-slate-200"
                        // onClick={() => form.reset()}
                      >
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
