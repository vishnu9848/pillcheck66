import Link from 'next/link';
import React from 'react';

const PillCheckLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-teal-400 shadow-md">
        <img src="/icons/pill.svg" alt="pill" className="w-7 h-7" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight text-foreground font-headline">PillCheck AI</span>
        <span className="text-xs text-muted-foreground">Safer meds, smarter care</span>
      </div>
    </Link>
  );
};

export default PillCheckLogo;
