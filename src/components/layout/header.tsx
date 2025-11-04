"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import LanguageSelector from '@/components/language-selector';
import VinnuChat from '@/components/vinnu-chat';
import PillCheckLogo from '@/components/pill-check-logo';
import { Button } from '../ui/button';
import { Bot } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-white via-sky-50 to-emerald-50/60 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <PillCheckLogo />
              {/* Active section badge */}
              {(() => {
                const pathname = usePathname();
                let label = '';
                let cls = 'bg-muted/10 text-muted-foreground border-muted/20';
                if (pathname?.toLowerCase().includes('/studentdetail')) {
                  label = 'Medical students';
                  cls = 'bg-indigo-100 text-indigo-700 border-indigo-200';
                } else if (pathname?.toLowerCase().includes('/doctordetail')) {
                  label = 'Doctors';
                  cls = 'bg-violet-100 text-violet-700 border-violet-200';
                } else if (pathname?.toLowerCase().includes('/publiccheck')) {
                  label = 'Common people';
                  cls = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                }
                return label ? (
                  <div className={`hidden sm:flex items-center px-3 py-1 rounded-full text-sm font-medium border ${cls}`}>
                    {label}
                  </div>
                ) : null;
              })()}
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <img src="/icons/stethoscope.svg" alt="stethoscope" className="w-6 h-6 opacity-90" />
              <img src="/icons/caduceus.svg" alt="caduceus" className="w-5 h-5 opacity-80" />
              <img src="/icons/syringe.svg" alt="syringe" className="w-5 h-5 opacity-80" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <VinnuChat>
              <Button>
                <Bot className="mr-2 h-5 w-5" />
                Ask Vinnu
              </Button>
            </VinnuChat>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
