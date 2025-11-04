'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload, Pill, Stethoscope, User, Pencil, Loader2, Tag, HelpCircle } from 'lucide-react';
import { extractMedicinesFromImage } from '@/ai/flows/extract-medicines-from-image';
import { useToast } from '@/hooks/use-toast';
import { UserInfo, AnalysisResult } from '@/lib/types';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface MedicineInputProps {
  medicines: string[];
  setMedicines: React.Dispatch<React.SetStateAction<string[]>>;
  onAnalyze: (taken: boolean) => void;
  isLoading: boolean;
  userInfo: UserInfo;
  onResetInfo: () => void;
  analysisResult: AnalysisResult | null;
}

const MedicineInput: React.FC<MedicineInputProps> = ({ medicines, setMedicines, onAnalyze, isLoading, userInfo, onResetInfo, analysisResult }) => {
  const [newMedicine, setNewMedicine] = useState('');
  const [micActive, setMicActive] = useState(false);
  const [timer, setTimer] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Speech recognition for medicine input with timer
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    setMicActive(true);
    setTimer(10);
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    let speechRecognized = false;

    // Countdown timer
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timeoutId = setTimeout(() => {
      if (!speechRecognized) {
        recognition.stop();
        setMicActive(false);
        clearInterval(timerRef.current!);
        alert('No speech is recognized');
      }
    }, 10000); // 10 seconds

    recognition.onresult = (event: any) => {
      speechRecognized = true;
      clearTimeout(timeoutId);
      clearInterval(timerRef.current!);
      setMicActive(false);
      setTimer(10);
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        setMedicines([...medicines, transcript.trim()]);
        setNewMedicine('');
      }
    };
    recognition.onerror = (event: any) => {
      clearTimeout(timeoutId);
      clearInterval(timerRef.current!);
      setMicActive(false);
      setTimer(10);
      alert('Speech recognition error: ' + event.error);
    };
    recognition.start();
  };
  const [isUploading, setIsUploading] = useState(false);
  const [showTakenDialog, setShowTakenDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAddMedicine = () => {
    if (newMedicine.trim()) {
      setMedicines([...medicines, newMedicine.trim()]);
      setNewMedicine('');
    }
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const photoDataUri = reader.result as string;
          const result = await extractMedicinesFromImage({ photoDataUri });
          if (result.medicineNames && result.medicineNames.length > 0) {
            setMedicines(prev => [...new Set([...prev, ...result.medicineNames])]);
            toast({
              title: 'Medicines Extracted',
              description: `${result.medicineNames.join(', ')} added to your list.`,
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Extraction Failed',
              description: 'Could not identify any medicine names from the image. Please try another image or enter manually.',
            });
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Image upload failed:', error);
        toast({
          variant: 'destructive',
          title: 'Upload Error',
          description: 'Failed to process the image. Please try again.',
        });
      } finally {
        setIsUploading(false);
        // Reset file input
        if(fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };
  
  const handleCheckSafetyClick = () => {
    if (medicines.length > 0) {
      setShowTakenDialog(true);
    }
  }

  const handleDialogSubmit = (taken: boolean) => {
    setShowTakenDialog(false);
    onAnalyze(taken);
  }

  if (analysisResult) {
    return null;
  }

  return (
    <>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
              <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                      <Pill className="text-primary" />
                      <span>Add Your Medicines</span>
                  </CardTitle>
                  <CardDescription>Enter medicine names manually or upload a picture of the box.</CardDescription>
              </div>
               <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="flex items-center gap-2 p-2">
                      <User className="h-4 w-4" />
                      <span>{userInfo.age} years, {userInfo.gender}</span>
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={onResetInfo} className="flex items-center gap-1">
                      <Pencil className="h-3 w-3"/> Edit Info
                  </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              placeholder="e.g., Paracetamol 500mg"
              value={newMedicine}
              onChange={(e) => setNewMedicine(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddMedicine()}
              disabled={isLoading || isUploading}
            />
            <Button onClick={handleAddMedicine} disabled={isLoading || isUploading || !newMedicine.trim()}>Add</Button>
            <button
              type="button"
              aria-label="Speak your medicine name"
              onClick={handleMicClick}
              className={`p-2 rounded-full border border-gray-300 hover:bg-gray-100 ${micActive ? 'bg-blue-100 border-blue-400' : ''}`}
              disabled={micActive || isLoading || isUploading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v3m0 0a6 6 0 0 0 6-6v-3a6 6 0 0 0-12 0v3a6 6 0 0 0 6 6zm0-9v6" /></svg>
            </button>
            {micActive && (
              <span className="text-sm text-blue-600 font-semibold ml-2">Listening... {timer}s</span>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Your Medicines:</h3>
            {medicines.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {medicines.map((med, index) => (
                  <li key={index} className="flex items-center gap-2 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm font-medium">
                    <Tag className="h-4 w-4 text-primary" />
                    <span>{med}</span>
                    <button onClick={() => handleRemoveMedicine(index)} disabled={isLoading || isUploading} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No medicines added yet.</p>
            )}
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              disabled={isLoading || isUploading}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Medicine Box Photo
                </>
              )}
            </Button>
             <p className="text-xs text-muted-foreground mt-2 text-center">We'll use AI to read the name from the photo.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full text-lg py-6"
            onClick={handleCheckSafetyClick}
            disabled={isLoading || isUploading || medicines.length === 0}
          >
            <Stethoscope className="mr-2 h-5 w-5" />
            Check Safety
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showTakenDialog} onOpenChange={setShowTakenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <HelpCircle className="text-primary"/>
                One Quick Question
            </AlertDialogTitle>
            <AlertDialogDescription>
              Have you already taken these medicines? This helps us give you the most relevant advice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleDialogSubmit(false)}>No, I haven't</Button>
            <Button onClick={() => handleDialogSubmit(true)}>Yes, I have</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MedicineInput;
