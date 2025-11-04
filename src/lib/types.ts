import { CheckDrugInteractionsOutput } from "@/ai/flows/check-drug-interactions";
import { IdentifySideEffectsOutput } from "@/ai/flows/identify-side-effects";

export interface UserInfo {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

export interface AnalysisResult {
    interactions: CheckDrugInteractionsOutput;
    sideEffects: IdentifySideEffectsOutput;
    taken: boolean;
}
