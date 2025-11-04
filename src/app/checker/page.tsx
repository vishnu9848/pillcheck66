'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import UserInfoForm from '@/components/user-info-form';
import MedicineInput from '@/components/medicine-input';
import ResultsDisplay from '@/components/results-display';
import type { UserInfo, AnalysisResult } from '@/lib/types';
import { checkDrugInteractions } from '@/ai/flows/check-drug-interactions';
import { identifySideEffects } from '@/ai/flows/identify-side-effects';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function CheckerPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [medicines, setMedicines] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasTakenMedicines, setHasTakenMedicines] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleUserInfoSubmit = (data: UserInfo) => {
    setUserInfo(data);
  };

  const handleAnalyze = async (taken: boolean) => {
    if (!userInfo || medicines.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide your info and at least one medicine.',
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setHasTakenMedicines(taken);

    try {
      const [interactionsResult, sideEffectsResult] = await Promise.all([
        checkDrugInteractions({
          medicineNames: medicines,
          age: userInfo.age,
          gender: userInfo.gender,
        }),
        identifySideEffects({ medicineNames: medicines }),
      ]);

      setAnalysisResult({
        interactions: interactionsResult,
        sideEffects: sideEffectsResult,
        taken,
      });
      // persist latest analysis for visualization pages
      try {
        const persisted = JSON.stringify({
          interactions: interactionsResult,
          sideEffects: sideEffectsResult,
          taken,
          medicines,
        });
        localStorage.setItem('latestAnalysis', persisted);
      } catch (e) {
        // ignore localStorage errors (e.g., SSR or blocked)
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          'An error occurred while analyzing the medicines. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setUserInfo(null);
    setMedicines([]);
    setAnalysisResult(null);
    setIsLoading(false);
    setHasTakenMedicines(null);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {!userInfo ? (
            <UserInfoForm onSubmit={handleUserInfoSubmit} />
          ) : (
            <>
              <MedicineInput
                medicines={medicines}
                setMedicines={setMedicines}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                userInfo={userInfo}
                onResetInfo={handleReset}
                analysisResult={analysisResult}
              />

              {isLoading && (
                <Card className="w-full">
                  <CardContent className="p-10 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg font-semibold text-primary">
                      Vinnu is analyzing...
                    </p>
                    <p className="text-muted-foreground text-center">
                      Please wait while we check for interactions and side
                      effects.
                    </p>
                  </CardContent>
                </Card>
              )}

              {analysisResult && (
                <ResultsDisplay result={analysisResult} onReset={handleReset} />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
