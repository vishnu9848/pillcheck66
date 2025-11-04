'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import PillCheckLogo from '@/components/pill-check-logo';
import { ShieldAlert, Mail, ArrowRight } from 'lucide-react';
import React from 'react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleEmergency = () => {
    router.push('/checker');
  };

  const handleShowLogin = () => {
    setShowLoginForm(true);
  };

  const goToPublicCheck = () => router.push('/PublicCheck');
  const goToStudentDetail = () => router.push('/StudentDetail');
  const goToDoctorDetail = () => router.push('/DoctorDetail');

  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    console.log('Login attempt with:', values);
    // For now, we'll just navigate. Later, we can add real auth.
    router.push('/checker');
  };

   return (
     <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-4">
       <div className="max-w-2xl w-full space-y-8 text-center mb-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="hero-icon">
              <PillCheckLogo />
            </div>
          </div>

          <h1 className="hero-title text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight flex items-center justify-center">
            <span className="mr-1">Pill</span>
            <span>Check AI</span>
          </h1>

          {/* Icon row */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <img src="/icons/pill.svg" alt="pill" className="w-9 h-9" />
            <img src="/icons/stethoscope.svg" alt="stethoscope" className="w-9 h-9" />
            <img src="/icons/caduceus.svg" alt="caduceus" className="w-9 h-9" />
            <img src="/icons/syringe.svg" alt="syringe" className="w-9 h-9" />
          </div>

          {/* Rotating quotes */}
          <RotatingQuotes />
        </div>
       </div>
       <div className="max-w-md w-full">
         <Card className="shadow-lg">
          {!showLoginForm ? (
            <>
               <CardHeader className="text-center">
                 <CardDescription>Select how you'd like to proceed</CardDescription>
               </CardHeader>
              <CardContent className="space-y-6">
                <Button variant="outline" className="w-full text-lg py-4" onClick={handleShowLogin}>
                  <Mail className="mr-2 h-5 w-5" />
                  Sign in with Email
                </Button>
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    className="w-full text-lg py-6 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-md" 
                    onClick={goToPublicCheck}
                  >
                    Common People
                    <span className="block text-xs mt-1 font-normal opacity-90">Check medicine safety without login</span>
                  </Button>
                  <Button 
                    className="w-full text-lg py-6 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-md" 
                    onClick={goToStudentDetail}
                  >
                    Medical Students
                    <span className="block text-xs mt-1 font-normal opacity-90">Advanced analysis with learning aids</span>
                  </Button>
                  <Button 
                    className="w-full text-lg py-6 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-md" 
                    onClick={goToDoctorDetail}
                  >
                    Doctors
                    <span className="block text-xs mt-1 font-normal opacity-90">Clinical analysis and visualizations</span>
                  </Button>
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
                <div className="space-y-3">
                  <Button 
                    variant="destructive" 
                    className="w-full text-xl py-8 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg border-2 border-red-600/20" 
                    onClick={handleEmergency}
                  >
                    <div className="flex flex-col items-center w-full">
                      <div className="flex items-center">
                        <ShieldAlert className="mr-2 h-6 w-6" />
                        <span>Emergency Check</span>
                      </div>
                      <span className="text-sm mt-1 font-normal opacity-90">Already taken medicines? Check now</span>
                    </div>
                  </Button>
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 rounded-lg border border-red-200">
                    <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-700">
                      <strong>Important:</strong> Use this option if you have already taken medicines and need immediate assistance. This will prioritize checking for dangerous interactions. No login required.
                    </p>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)}>
                <CardHeader>
                  <CardTitle className="text-2xl">Sign In</CardTitle>
                  <CardDescription>Enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full text-lg py-6">
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                     <Button variant="link" size="sm" onClick={() => setShowLoginForm(false)}>
                        Back to options
                    </Button>
                </CardFooter>
              </form>
            </Form>
          )}
        </Card>
      </div>
    </div>
  );
}

function RotatingQuotes() {
  const quotes = [
    '"An ounce of prevention is worth a pound of cure." — Benjamin Franklin',
    '"The art of medicine consists of amusing the patient while nature cures the disease." — Voltaire',
    '"Listen to the patient, they are telling you the diagnosis." — Sir William Osler',
    '"Wherever the art of Medicine is loved, there is also a love of Humanity." — Hippocrates',
  ];
  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-4">
      <p className="text-sm md:text-base text-muted-foreground italic">{quotes[index]}</p>
      <div className="flex items-center justify-center gap-2 mt-2">
        {quotes.map((_, i) => (
          <span key={i} className={`w-2 h-2 rounded-full ${i === index ? 'bg-primary' : 'bg-muted/50'}`}></span>
        ))}
      </div>
    </div>
  );
}
