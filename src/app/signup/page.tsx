'use client';

import AuthForm from '@/components/AuthForm';
import PillCheckLogo from '@/components/pill-check-logo';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <PillCheckLogo />
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Create an account</h2>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
