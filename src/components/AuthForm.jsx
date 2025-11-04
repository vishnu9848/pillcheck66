'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export default function AuthForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Public');
  const [doctorId, setDoctorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      // Optionally update displayName
      try { await updateProfile(userCred.user, { displayName: name }); } catch (e) { /* ignore */ }

      const userDoc = doc(db, 'users', uid);
      await setDoc(userDoc, {
        name: name || '',
        email: email,
        role: role,
        doctorId: role === 'Doctor' ? (doctorId || '') : '',
        verifiedDoctor: false,
      });

      // Redirect based on role
      if (role === 'Student') router.push('/StudentDetail');
      else if (role === 'Doctor') router.push('/DoctorDetail');
      else router.push('/PublicCheck');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium">Full name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" />
      </div>

      <div>
        <label className="block text-sm font-medium">Role</label>
        <Select onValueChange={(v) => setRole(v)} defaultValue={role}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="Public">Public</SelectItem>
            <SelectItem value="Student">Student</SelectItem>
            <SelectItem value="Doctor">Doctor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {role === 'Doctor' && (
        <div>
          <label className="block text-sm font-medium">License number</label>
          <Input value={doctorId} onChange={(e) => setDoctorId(e.target.value)} placeholder="Enter license ID" />
        </div>
      )}

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign up'}</Button>
      </div>
    </form>
  );
}
