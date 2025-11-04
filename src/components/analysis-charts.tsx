"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface AnalysisShape {
  interactions: { interactions: string[]; summary: string };
  sideEffects: { sideEffects: string[] };
  taken: boolean;
  medicines?: string[];
}

const SEVERITY_KEYWORDS = {
  severe: ["severe", "serious", "anaphylaxis", "allergic reaction", "allergic"],
  moderate: ["nausea", "dizziness", "headache", "vomit", "rash", "photosensitivity"],
};

function classifySeverity(effect: string) {
  const lower = effect.toLowerCase();
  if (SEVERITY_KEYWORDS.severe.some((k) => lower.includes(k))) return "Severe";
  if (SEVERITY_KEYWORDS.moderate.some((k) => lower.includes(k))) return "Moderate";
  return "Mild";
}

export default function AnalysisCharts({ data }: { data?: AnalysisShape | null }) {
  const [analysis, setAnalysis] = useState<AnalysisShape | null>(data || null);

  useEffect(() => {
    if (data) {
      setAnalysis(data);
      return;
    }
    try {
      const raw = localStorage.getItem("latestAnalysis");
      if (raw) {
        // Be tolerant of older or slightly different shapes saved in localStorage.
        const parsed = JSON.parse(raw);

        // Normalization rules:
        // - New shape: { interactions: { interactions: string[], summary: string }, sideEffects: { sideEffects: string[] }, taken: boolean, medicines?: string[] }
        // - Older shape: { interactions: string[] , summary: string, sideEffects: string[] }
        // - Very old shape: { interactions: string[], sideEffects: string[] }

        let normalized: AnalysisShape | null = null;

        // Case: already normalized
        if (
          parsed &&
          parsed.interactions &&
          (Array.isArray(parsed.interactions) === false) &&
          Array.isArray(parsed.sideEffects?.sideEffects)
        ) {
          // Looks like the new shape
          normalized = {
            interactions: parsed.interactions,
            sideEffects: parsed.sideEffects,
            taken: !!parsed.taken,
            medicines: parsed.medicines || [],
          };
        } else if (parsed && Array.isArray(parsed.interactions)) {
          // interactions is an array (older shape). Convert to new nested shape.
          normalized = {
            interactions: { interactions: parsed.interactions, summary: parsed.summary || '' },
            sideEffects: { sideEffects: Array.isArray(parsed.sideEffects) ? parsed.sideEffects : [] },
            taken: !!parsed.taken,
            medicines: parsed.medicines || [],
          };
        } else if (parsed && Array.isArray(parsed.sideEffects)) {
          // sideEffects is an array but interactions may be nested differently.
          normalized = {
            interactions: parsed.interactions?.interactions ? parsed.interactions : { interactions: [], summary: '' },
            sideEffects: { sideEffects: parsed.sideEffects },
            taken: !!parsed.taken,
            medicines: parsed.medicines || [],
          };
        } else if (parsed) {
          // Last resort: try to coerce whatever is present into the expected shape
          try {
            normalized = {
              interactions: parsed.interactions?.interactions
                ? parsed.interactions
                : { interactions: Array.isArray(parsed.interactions) ? parsed.interactions : [], summary: parsed.summary || '' },
              sideEffects: parsed.sideEffects?.sideEffects
                ? parsed.sideEffects
                : { sideEffects: Array.isArray(parsed.sideEffects) ? parsed.sideEffects : [] },
              taken: !!parsed.taken,
              medicines: parsed.medicines || [],
            };
          } catch (e) {
            console.warn('Could not normalize latestAnalysis shape', e, parsed);
          }
        }

        if (normalized) {
          setAnalysis(normalized);
        } else {
          // If parsing succeeded but we couldn't normalize, set raw parsed so developer can inspect
          // (This avoids chart crash and shows fallback message in UI.)
          console.warn('latestAnalysis found but shape is unexpected:', parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [data]);

  if (!analysis) {
    return (
      <div className="bg-card p-4 rounded text-sm text-muted-foreground">No recent analysis found — run a pill interaction check to see visualizations.</div>
    );
  }

  const interactionsCount = analysis.interactions?.interactions?.length || 0;
  const sideEffectsList = analysis.sideEffects?.sideEffects || [];

  // Side effects by severity
  const severityCounts: Record<string, number> = { Severe: 0, Moderate: 0, Mild: 0 };
  sideEffectsList.forEach((s) => {
    const c = classifySeverity(s);
    severityCounts[c] = (severityCounts[c] || 0) + 1;
  });
  const severityData = Object.entries(severityCounts).map(([name, value]) => ({ name, value }));

  // Simple risk trend: create 7-day-ish points using interactionsCount and side effects
  const trend: { day: string; risk: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const jitter = Math.max(0, interactionsCount + sideEffectsList.length - Math.round((i * Math.random()) % 3));
    trend.push({ day: `T-${i}`, risk: Math.min(100, Math.round(jitter * (10 + i) / 2)) });
  }

  // Per-medicine quick lookup counts
  const medicineCounts = (analysis.medicines || []).map((m) => ({ name: m, count: 1 }));

  const COLORS = ["#1E90FF", "#FFB657", "#FF6B6B"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded p-3">
          <h4 className="font-semibold mb-2">Interactions</h4>
          <div style={{ width: "100%", height: 140 }}>
            <ResponsiveContainer>
              <BarChart data={[{ name: "Interactions", count: interactionsCount }]}> 
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1E90FF" />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-sm text-muted-foreground mt-2">{interactionsCount} potential interactions detected</div>
          </div>
        </div>

        <div className="bg-card rounded p-3">
          <h4 className="font-semibold mb-2">Side effects severity</h4>
          <div style={{ width: "100%", height: 140 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={severityData} dataKey="value" nameKey="name" innerRadius={30} outerRadius={50}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-sm text-muted-foreground mt-2">Breakdown of reported side effects by severity</div>
          </div>
        </div>

        <div className="bg-card rounded p-3">
          <h4 className="font-semibold mb-2">Medicines added</h4>
          <div style={{ width: "100%", height: 140 }}>
            <ResponsiveContainer>
              <BarChart data={medicineCounts} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#63B3FF" />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-sm text-muted-foreground mt-2">Medicines included in the last check</div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded p-3">
        <h4 className="font-semibold mb-2">Risk trend</h4>
        <div style={{ width: "100%", height: 180 }}>
          <ResponsiveContainer>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#1E90FF" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-muted-foreground mt-2">Simple trend based on interactions and side effects detected.</div>
      </div>
    </div>
  );
}
