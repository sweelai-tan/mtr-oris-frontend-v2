'use client';

import { ChevronDown, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useConfig } from '@/lib/config-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { sourceTranslations, EventSource } from '@/lib/types';

export default function Header() {
  const { language, user, source, updateConfig } = useConfig();
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between px-4 py-2">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <h1 className="text-sm font-medium text-gray-200">
          A.I. ORIS Event Classification System
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-8 border-gray-700 font-semibold text-cyan-500 hover:text-cyan-600"
            >
              {language === 'EN' ? 'EN' : '中文'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => updateConfig && updateConfig({ language: 'EN' })}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateConfig && updateConfig({ language: 'ZH' })}
            >
              中文
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-8 border-gray-700 text-gray-300 hover:bg-[#234454]"
            >
              {source
                ? sourceTranslations[source]
                : sourceTranslations.SIL_EMAIL}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                updateConfig && updateConfig({ source: EventSource.SIL_EMAIL })
              }
            >
              {sourceTranslations.SIL_EMAIL}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                updateConfig && updateConfig({ source: EventSource.SIL_VIDEO })
              }
            >
              {sourceTranslations.SIL_VIDEO}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                updateConfig && updateConfig({ source: EventSource.TML_EMAIL })
              }
            >
              {sourceTranslations.TML_EMAIL}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                updateConfig && updateConfig({ source: EventSource.TML_VIDEO })
              }
            >
              {sourceTranslations.TML_VIDEO}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                updateConfig && updateConfig({ source: EventSource.EAL_EMAIL })
              }
            >
              {sourceTranslations.EAL_EMAIL}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-8 border-gray-700 text-gray-300 hover:bg-[#234454]"
            >
              <User className="mr-2 h-4 w-4" />
              {user?.user.name}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={() => {
                router.push('/login');
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
