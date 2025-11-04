'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, ArrowRight } from 'lucide-react';
import type { UserInfo } from '@/lib/types';

const formSchema = z.object({
  age: z.coerce.number().min(1, { message: 'Age is required.' }).max(120, { message: 'Please enter a valid age.' }),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Please select a gender.' }),
});

interface UserInfoFormProps {
  onSubmit: (data: UserInfo) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit }) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            age: '' as any,
            gender: undefined,
        },
    });

        const [micActive, setMicActive] = React.useState(false);
        const [timer, setTimer] = React.useState(10);
        const timerRef = React.useRef<NodeJS.Timeout | null>(null);

        const [genderMicActive, setGenderMicActive] = React.useState(false);
        const [genderTimer, setGenderTimer] = React.useState(10);
        const genderTimerRef = React.useRef<NodeJS.Timeout | null>(null);

            // Speech recognition for gender selection with timer
            const handleGenderMicClick = () => {
                if (!('webkitSpeechRecognition' in window)) {
                    alert('Speech recognition is not supported in this browser.');
                    return;
                }
                setGenderMicActive(true);
                setGenderTimer(10);
                const recognition = new (window as any).webkitSpeechRecognition();
                recognition.lang = 'en-US';
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;
                let speechRecognized = false;

                // Countdown timer
                genderTimerRef.current = setInterval(() => {
                    setGenderTimer(prev => {
                        if (prev <= 1) {
                            clearInterval(genderTimerRef.current!);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                const timeoutId = setTimeout(() => {
                    if (!speechRecognized) {
                        recognition.stop();
                        setGenderMicActive(false);
                        clearInterval(genderTimerRef.current!);
                        alert('No speech is recognized');
                    }
                }, 10000); // 10 seconds

                recognition.onresult = (event: any) => {
                    speechRecognized = true;
                    clearTimeout(timeoutId);
                    clearInterval(genderTimerRef.current!);
                    setGenderMicActive(false);
                    setGenderTimer(10);
                    const transcript = event.results[0][0].transcript.toLowerCase();
                    // Match gender from transcript
                    if (transcript.includes('male')) {
                        form.setValue('gender', 'Male');
                    } else if (transcript.includes('female')) {
                        form.setValue('gender', 'Female');
                    } else if (transcript.includes('other')) {
                        form.setValue('gender', 'Other');
                    } else {
                        alert('Could not recognize gender. Please try again.');
                    }
                };
                recognition.onerror = (event: any) => {
                    clearTimeout(timeoutId);
                    clearInterval(genderTimerRef.current!);
                    setGenderMicActive(false);
                    setGenderTimer(10);
                    alert('Speech recognition error: ' + event.error);
                };
                recognition.start();
            };

            // Speech recognition for age input with timer
            const handleMicClick = () => {
    // Speech recognition for gender selection with timer
    const handleGenderMicClick = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }
        setGenderMicActive(true);
        setGenderTimer(10);
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        let speechRecognized = false;

        // Countdown timer
        genderTimerRef.current = setInterval(() => {
            setGenderTimer(prev => {
                if (prev <= 1) {
                    clearInterval(genderTimerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const timeoutId = setTimeout(() => {
            if (!speechRecognized) {
                recognition.stop();
                setGenderMicActive(false);
                clearInterval(genderTimerRef.current!);
                alert('No speech is recognized');
            }
        }, 10000); // 10 seconds

        recognition.onresult = (event: any) => {
            speechRecognized = true;
            clearTimeout(timeoutId);
            clearInterval(genderTimerRef.current!);
            setGenderMicActive(false);
            setGenderTimer(10);
            const transcript = event.results[0][0].transcript.toLowerCase();
            // Match gender from transcript
            if (transcript.includes('male')) {
                form.setValue('gender', 'Male');
            } else if (transcript.includes('female')) {
                form.setValue('gender', 'Female');
            } else if (transcript.includes('other')) {
                form.setValue('gender', 'Other');
            } else {
                alert('Could not recognize gender. Please try again.');
            }
        };
        recognition.onerror = (event: any) => {
            clearTimeout(timeoutId);
            clearInterval(genderTimerRef.current!);
            setGenderMicActive(false);
            setGenderTimer(10);
            alert('Speech recognition error: ' + event.error);
        };
        recognition.start();
    };
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
            // Extract number from transcript
            const ageMatch = transcript.match(/\d+/);
            if (ageMatch) {
                form.setValue('age', Number(ageMatch[0]));
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

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <User className="text-primary"/>
                        <span>Tell Us About Yourself</span>
                    </CardTitle>
                    <CardDescription>
                        This information helps us provide more accurate and personalized results.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <Input type="number" placeholder="e.g., 35" {...field} />
                                        <button
                                            type="button"
                                            aria-label="Speak your age"
                                            onClick={handleMicClick}
                                            className={`p-2 rounded-full border border-gray-300 hover:bg-gray-100 ${micActive ? 'bg-blue-100 border-blue-400' : ''}`}
                                            disabled={micActive}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v3m0 0a6 6 0 0 0 6-6v-3a6 6 0 0 0-12 0v3a6 6 0 0 0 6 6zm0-9v6" /></svg>
                                        </button>
                                        {micActive && (
                                            <span className="text-sm text-blue-600 font-semibold ml-2">Listening... {timer}s</span>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <div className="flex items-center gap-2">
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <button
                                        type="button"
                                        aria-label="Speak your gender"
                                        onClick={handleGenderMicClick}
                                        className={`p-2 rounded-full border border-gray-300 hover:bg-gray-100 ${genderMicActive ? 'bg-blue-100 border-blue-400' : ''}`}
                                        disabled={genderMicActive}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v3m0 0a6 6 0 0 0 6-6v-3a6 6 0 0 0-12 0v3a6 6 0 0 0 6 6zm0-9v6" /></svg>
                                    </button>
                                    {genderMicActive && (
                                        <span className="text-sm text-blue-600 font-semibold ml-2">Listening... {genderTimer}s</span>
                                    )}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full text-lg py-6">
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
};

export default UserInfoForm;
