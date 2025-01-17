'use client';

import {
  Activity,
  BarChart3,
  Brain,
  FileDown,
  FileSpreadsheet,
  FileVideo,
  Gauge,
  LayoutDashboard,
  ListVideo,
  Mail,
  Plus,
  Sparkles,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useConfig } from '@/lib/config-context';
import { EventSource } from '@/lib/types';
import logo from '@/public/mtr-logo.svg';

const emailSidebarItems = [
  {
    title: 'Overview',
    items: [
      {
        name: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard/dashboard',
      },
      {
        name: 'Track health analysis',
        icon: Activity,
        href: '/dashboard/track-health-analysis',
      },
    ],
  },
  {
    title: 'Operation',
    items: [
      {
        name: 'Event verification',
        icon: FileSpreadsheet,
        href: '/dashboard/event-verification',
      },
      {
        name: 'Event exporting',
        icon: FileDown,
        href: '/dashboard/event-exporting',
      },
    ],
  },
  // {
  //   title: 'Inferencing',
  //   items: [
  //     { name: 'Inference job', icon: Gauge, href: '/dashboard/inference-job' },
  //     { name: 'New inference job', icon: Plus, href: '/dashboard/new-inference-job' },
  //   ],
  // },
  {
    title: 'AI Model Training',
    items: [
      {
        name: 'AI model training',
        icon: Brain,
        href: '/dashboard/ai-model-training',
      },
      { name: 'New model', icon: Plus, href: '/dashboard/new-model' },
      {
        name: 'Enhance model',
        icon: Sparkles,
        href: '/dashboard/enhance-model',
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        name: 'User management',
        icon: Users,
        href: '/dashboard/user-management',
      },
      {
        name: 'Defect category threshold',
        icon: BarChart3,
        href: '/dashboard/defect-category-threshold',
      },
      {
        name: 'Alert management',
        icon: Mail,
        href: '/dashboard/alert-management',
      },
    ],
  },
];

const videoSidebarItems = [
  {
    title: 'Overview',
    items: [
      {
        name: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard/dashboard',
      },
      {
        name: 'Track health analysis',
        icon: Activity,
        href: '/dashboard/track-health-analysis',
      },
    ],
  },
  {
    title: 'Operation',
    items: [
      {
        name: 'Event verification',
        icon: FileVideo,
        href: '/dashboard/event-verification',
      },
      {
        name: 'Event exporting',
        icon: ListVideo,
        href: '/dashboard/event-exporting',
      },
    ],
  },
  {
    title: 'Video Inferencing',
    items: [
      {
        name: 'Import video',
        icon: Gauge,
        href: '/dashboard/inference-import-video',
      },
      {
        name: 'Classified events in video',
        icon: Plus,
        href: '/dashboard/inference-events',
      },
    ],
  },
  {
    title: 'AI Model Training',
    items: [
      {
        name: 'AI model training',
        icon: Brain,
        href: '/dashboard/ai-model-training',
      },
      { name: 'New model', icon: Plus, href: '/dashboard/new-model' },
      {
        name: 'Enhance model',
        icon: Sparkles,
        href: '/dashboard/enhance-model',
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        name: 'User management',
        icon: Users,
        href: '/dashboard/user-management',
      },
      // {
      //   name: 'Defect category threshold',
      //   icon: BarChart3,
      //   href: '/dashboard/defect-category-threshold',
      // },
      // {
      //   name: 'Alert management',
      //   icon: Mail,
      //   href: '/dashboard/alert-management',
      // },
    ],
  },
];

export function AppSidebar() {
  const currentPath = usePathname();
  const { source } = useConfig();
  const sidebarItems =
    source === EventSource.EAL_EMAIL ||
    source === EventSource.SIL_EMAIL ||
    source === EventSource.TML_EMAIL
      ? emailSidebarItems
      : videoSidebarItems;

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex flex-col items-center justify-between">
          <div className="flex items-center justify-center pt-4">
            <Image src={logo} alt="Logo" width={120} />
          </div>
          <div className="p-4 text-sm text-gray-500">
            Version: {process.env.version}
          </div>
        </div>
        <SidebarGroup>
          {sidebarItems.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={currentPath === item.href}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
