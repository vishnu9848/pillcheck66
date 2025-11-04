'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AnalysisCharts from '@/components/analysis-charts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function DoctorDetailPage() {
  const [license, setLicense] = useState('');
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<{
    summary: string;
    mechanism: string;
    analogy: string;
    keyPoints: string[];
    visuals?: string;
  } | null>(null);
  const [micActive, setMicActive] = useState(false);
  const [timer, setTimer] = useState(10);

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

    let intervalId = window.setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timeoutId = window.setTimeout(() => {
      if (!speechRecognized) {
        recognition.stop();
        setMicActive(false);
        clearInterval(intervalId);
        alert('No speech is recognized');
      }
    }, 10000);

    recognition.onresult = (event: any) => {
      speechRecognized = true;
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      setMicActive(false);
      setTimer(10);
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
    };

    recognition.onerror = (event: any) => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      setMicActive(false);
      setTimer(10);
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please enable microphone permissions in your browser.');
      } else {
        alert('Speech recognition error: ' + event.error);
      }
    };

    recognition.onend = () => {
      setMicActive(false);
      setTimer(10);
      clearInterval(intervalId);
    };

    recognition.start();
  };

  const verifyLicense = () => {
    setVerifying(true);
    // Simple mock verification: license must be alphanumeric 6-12 chars
    setTimeout(() => {
      const ok = /^[A-Za-z0-9]{6,12}$/.test(license.trim());
      setVerified(ok);
      setVerifying(false);
      if (!ok) alert('License verification failed. Please enter a valid license ID (6-12 alphanumeric).');
    }, 700);
  };

  const askAdvanced = async () => {
    if (!question.trim()) return;
    setAnswer({ summary: 'Loading...', mechanism: '', analogy: '', keyPoints: [] });
    try {
      const res = await fetch('/api/ai/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (data && data.summary) setAnswer(data);
      else if (data.error) setAnswer({ summary: data.error, mechanism: '', analogy: '', keyPoints: [] });
      else setAnswer({ summary: 'No answer', mechanism: '', analogy: '', keyPoints: [] });
    } catch (err) {
      setAnswer({ summary: 'Request failed', mechanism: '', analogy: '', keyPoints: [] });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-4">
      <div className="max-w-3xl w-full">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Doctor Portal</CardTitle>
            <CardDescription>Verify your license to access advanced clinical visualizations and AI-assisted insights.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="block text-sm font-medium">License Number</label>
              <div className="flex gap-2 mt-2">
                <Input value={license} onChange={(e) => setLicense(e.target.value)} placeholder="e.g., ABC12345" />
                <Button onClick={verifyLicense} disabled={verifying}>{verifying ? 'Verifying...' : 'Verify'}</Button>
              </div>
              {verified && <p className="mt-2 text-sm text-green-600">License verified — access granted.</p>}
            </div>

            {verified ? (
              <>
                <h4 className="font-semibold mb-2">Advanced Visualizations</h4>
                <div className="bg-card rounded p-4 mb-4">
                  {/* Charts based on last interaction check */}
                  <AnalysisCharts />
                </div>

                <p className="mb-2">Ask the AI for advanced clinical explanations (keeps Gemini integration server-side).</p>
                <div className="flex items-start gap-2">
                  <Textarea placeholder="Ask an advanced question" value={question} onChange={(e) => setQuestion(e.target.value)} />
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={handleMicClick}
                      disabled={micActive}
                      aria-label="Speak your question"
                      className={`p-2 rounded-full border border-gray-300 hover:bg-gray-100 ${micActive ? 'bg-blue-100 border-blue-400' : ''}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v3m0 0a6 6 0 0 0 6-6v-3a6 6 0 0 0-12 0v3a6 6 0 0 0 6 6zm0-9v6" /></svg>
                    </button>
                    {micActive && (
                      <span className="text-sm text-blue-600 font-semibold mt-2">Listening... {timer}s</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button onClick={askAdvanced}>Ask AI</Button>
                  <Button variant="ghost" onClick={() => { setQuestion(''); setAnswer(null); }}>Clear</Button>
                </div>
                {answer && (
                  <div className="mt-4">
                    <h5 className="font-semibold">AI Response</h5>
                    <div className="bg-card p-4 rounded">
                      <h6 className="font-semibold">Summary</h6>
                      <p className="mb-2">{answer.summary}</p>

                      <h6 className="font-semibold">Mechanism / Details</h6>
                      {answer.mechanism.split('\n\n').map((p, i) => (
                        <p key={i} className="mb-2">{p}</p>
                      ))}

                      <h6 className="font-semibold">Analogy</h6>
                      <blockquote className="border-l-4 pl-3 italic text-muted-foreground">{answer.analogy}</blockquote>

                      {answer.keyPoints && answer.keyPoints.length > 0 && (
                        <>
                          <h6 className="font-semibold mt-3">Key Points</h6>
                          <ul className="list-disc list-inside mt-1">
                            {answer.keyPoints.map((kp, idx) => (
                              <li key={idx}>{kp}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      {answer.visuals && (
                        <>
                          <h6 className="font-semibold mt-3">Suggested Visual</h6>
                          <p className="text-sm text-muted-foreground">{answer.visuals}</p>
                        </>
                      )}
                      <div className="mt-4">
                        <h6 className="font-semibold">Further reading & guidelines</h6>
                        <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                          <li><a className="text-primary hover:underline" href="https://www.ncbi.nlm.nih.gov/" target="_blank" rel="noreferrer">PubMed / NCBI — Research articles</a></li>
                          <li><a className="text-primary hover:underline" href="https://www.fda.gov/drugs" target="_blank" rel="noreferrer">FDA — Drug safety and labels</a></li>
                          <li><a className="text-primary hover:underline" href="https://www.who.int/" target="_blank" rel="noreferrer">WHO — Clinical guidance</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Please verify your license to access doctor-level features.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
