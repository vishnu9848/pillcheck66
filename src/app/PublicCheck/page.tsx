import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill } from 'lucide-react';

export default function PublicCheckPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Pill className="text-primary" />
              <CardTitle>Public Pill Check</CardTitle>
            </div>
            <CardDescription>Identify pills and check interactions safely — no account needed.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You can use the emergency checker or the regular checker to add medicines and analyze interactions.</p>
            <div className="flex gap-2">
              <Link href="/checker"><Button>Open Checker</Button></Link>
              <Link href="/"><Button variant="ghost">Back</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
