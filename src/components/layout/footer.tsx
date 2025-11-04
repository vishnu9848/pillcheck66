import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t bg-gradient-to-t from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-4 mb-3">
          <img src="/icons/pill.svg" alt="pill" className="w-6 h-6 opacity-90" />
          <img src="/icons/stethoscope.svg" alt="stethoscope" className="w-6 h-6 opacity-80" />
          <img src="/icons/caduceus.svg" alt="caduceus" className="w-6 h-6 opacity-80" />
        </div>
        <p className="text-sm">
          © {new Date().getFullYear()} PillCheck AI. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Disclaimer: The information provided by PillCheck AI is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
