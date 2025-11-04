'use client';

import { AnalysisResult } from '@/lib/types';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, Info, ListChecks, ShieldAlert, Phone, Ambulance, CheckCircle2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  const hasInteractions = result.interactions.interactions.length > 0;
  const hasSideEffects = result.sideEffects.sideEffects.length > 0;
  
  const isRisky = hasInteractions; // Simplified logic, can be expanded
  const isSevere = result.sideEffects.sideEffects.some(effect => ['severe', 'serious', 'allergic reaction'].some(keyword => effect.toLowerCase().includes(keyword)));
  const isEmergency = result.taken && (isRisky || isSevere);

  const isSafe = !hasInteractions && !hasSideEffects;

  const getInteractionCardClass = () => {
    if (!hasInteractions) return 'border-green-500 bg-green-500/5';
    if (result.taken) return 'border-orange-500 bg-orange-500/5';
    return 'border-yellow-500 bg-yellow-500/5';
  }
  
  const getSideEffectsCardClass = () => {
    if (!hasSideEffects) return 'border-green-500 bg-green-500/5';
    if (result.taken) return 'border-orange-500 bg-orange-500/5';
    return 'border-yellow-500 bg-yellow-500/5';
  }

  const getInteractionIconClass = () => {
    if (!hasInteractions) return 'text-green-500';
    if (result.taken) return 'text-orange-500';
    return 'text-yellow-500';
  }

  const getSideEffectsIconClass = () => {
    if (!hasSideEffects) return 'text-green-500';
    if (result.taken) return 'text-orange-500';
    return 'text-yellow-500';
  }


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-4 mb-2">
        <div className="p-2 rounded bg-gradient-to-r from-indigo-500 to-teal-400 shadow-sm">
          <img src="/icons/pill.svg" alt="pill" className="w-6 h-6" />
        </div>
        <div className="p-2 rounded bg-gradient-to-r from-emerald-400 to-yellow-400 shadow-sm">
          <img src="/icons/stethoscope.svg" alt="stethoscope" className="w-6 h-6" />
        </div>
        <div className="p-2 rounded bg-gradient-to-r from-orange-400 to-pink-400 shadow-sm">
          <img src="/icons/caduceus.svg" alt="caduceus" className="w-6 h-6" />
        </div>
      </div>
      {isEmergency && (
        <Card className="border-destructive border-2 bg-destructive/5 text-destructive-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-destructive text-2xl">
              <ShieldAlert className="h-8 w-8" />
              <span>Emergency Protocol</span>
            </CardTitle>
            <CardDescription className="text-destructive/90">
              Risky interactions or severe side effects detected. If you are experiencing severe symptoms, follow these steps immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-4">
                      <h3 className="font-semibold text-lg text-foreground">First-Aid Suggestions</h3>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/80 text-sm">
                          <li>Stay calm and do not panic.</li>
                          <li>Do not take any more medication until you consult a doctor.</li>
                          <li>If feeling dizzy or lightheaded, lie down.</li>
                          <li>If you have trouble breathing, call for an ambulance immediately.</li>
                          <li>Drink water if you can swallow safely.</li>
                      </ul>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                      <h3 className="font-semibold text-lg text-foreground">Emergency Helplines (India)</h3>
                       <div className="mt-2 space-y-2">
                          <a href="tel:108" className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors">
                              <Phone className="h-6 w-6 text-destructive" />
                              <div>
                                  <p className="font-bold text-destructive">Medical Emergency (Ambulance)</p>
                                  <p className="text-lg font-mono text-destructive">108</p>
                              </div>
                          </a>
                           <a href="tel:102" className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors">
                              <Ambulance className="h-6 w-6 text-destructive" />
                              <div>
                                  <p className="font-bold text-destructive">Patient Transport (Non-Emergency)</p>
                                  <p className="text-lg font-mono text-destructive">102</p>
                              </div>
                          </a>
                      </div>
                  </div>
              </div>
          </CardContent>
        </Card>
      )}

      {isSafe ? (
         <Card className="border-green-500 border-2 bg-green-500/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-600 text-2xl">
                    <CheckCircle2 className="h-8 w-8" />
                    <span>All Clear!</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-lg text-green-700">No major problems detected. It appears safe to take your medicines as per your doctor's prescription.</p>
            </CardContent>
        </Card>
      ) : (
        <>
            <Card className={cn(getInteractionCardClass(), 'border-2')}>
                <CardHeader>
                <CardTitle className={cn("flex items-center gap-2 text-xl", getInteractionIconClass())}>
                    <AlertTriangle />
                    <span>{result.taken ? 'Detected Interactions' : 'Potential Interactions'}</span>
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="mb-4 text-muted-foreground">{result.interactions.summary}</p>
                {hasInteractions ? (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>View detailed interactions</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-5 space-y-2 text-sm">
                                    {result.interactions.interactions.map((interaction, index) => (
                                        <li key={index}>{interaction}</li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ) : (
                    <div className="p-4 bg-green-500/10 rounded-md text-green-700 flex items-center gap-3">
                        <Info className="h-5 w-5"/>
                        <p>No significant interactions were found among the provided medicines.</p>
                    </div>
                )}
                </CardContent>
            </Card>
            
            <Card className={cn(getSideEffectsCardClass(), 'border-2')}>
                <CardHeader>
                <CardTitle className={cn("flex items-center gap-2 text-xl", getSideEffectsIconClass())}>
                    <ListChecks />
                    <span>{result.taken ? 'Possible Side Effects' : 'Potential Side Effects'}</span>
                </CardTitle>
                <CardDescription>{result.taken ? 'Monitor for these symptoms.' : 'Be aware of these potential side effects.'}</CardDescription>
                </CardHeader>
                <CardContent>
                {hasSideEffects ? (
                    <ul className="columns-1 md:columns-2 list-disc pl-5 space-y-1 text-sm">
                    {result.sideEffects.sideEffects.map((effect, index) => (
                        <li key={index}>{effect}</li>
                    ))}
                    </ul>
                ) : (
                    <div className="p-4 bg-green-500/10 rounded-md text-green-700 flex items-center gap-3">
                        <Info className="h-5 w-5"/>
                        <p>No common side effects were found for the provided medicines.</p>
                    </div>
                )}
                </CardContent>
            </Card>
        </>
      )}

      <div className="text-center pt-4">
        <Button onClick={onReset} size="lg">Start a New Check</Button>
      </div>

        {/* Helpful links for further reading */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Helpful resources</CardTitle>
            <CardDescription>Trusted resources to learn more about medicines, interactions and when to seek help.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://medlineplus.gov/druginformation.html" target="_blank" rel="noreferrer" className="text-primary hover:underline">MedlinePlus — Drug Information</a>
                <div className="text-muted-foreground">Authoritative patient-facing drug information from the U.S. National Library of Medicine.</div>
              </li>
              <li>
                <a href="https://www.fda.gov/drugs" target="_blank" rel="noreferrer" className="text-primary hover:underline">U.S. FDA — Drugs</a>
                <div className="text-muted-foreground">Regulatory information, safety alerts, and prescribing information.</div>
              </li>
              <li>
                <a href="https://www.nhs.uk/medicines/" target="_blank" rel="noreferrer" className="text-primary hover:underline">NHS — Medicines A–Z</a>
                <div className="text-muted-foreground">Patient-friendly descriptions and side effects (UK NHS).</div>
              </li>
              <li>
                <a href="https://www.who.int/health-topics/medicines-and-health-products" target="_blank" rel="noreferrer" className="text-primary hover:underline">WHO — Medicines and health products</a>
                <div className="text-muted-foreground">Global guidance on safe use of medicines.</div>
              </li>
              <li>
                <a href="https://www.poisonhelp.org/" target="_blank" rel="noreferrer" className="text-primary hover:underline">Poison Control (U.S.)</a>
                <div className="text-muted-foreground">If you suspect an overdose or poisoning, contact your local poison control center immediately.</div>
              </li>
            </ul>
          </CardContent>
        </Card>

    </div>
  );
};

export default ResultsDisplay;
