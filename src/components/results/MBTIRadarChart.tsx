"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

interface MBTIRadarChartProps {
  percentages: Record<string, number>;
  color?: string;
}

export function MBTIRadarChart({ percentages, color = "#6C63FF" }: MBTIRadarChartProps) {
  const { locale } = useLanguage();

  const data = [
    { subject: locale === "ar" ? "ا.ب"   : "E",  value: percentages.E ?? 50 },
    { subject: locale === "ar" ? "حسّي"  : "S",  value: percentages.S ?? 50 },
    { subject: locale === "ar" ? "تفكير" : "T",  value: percentages.T ?? 50 },
    { subject: locale === "ar" ? "حكم"   : "J",  value: percentages.J ?? 50 },
    { subject: locale === "ar" ? "ا.ط"   : "I",  value: percentages.I ?? 50 },
    { subject: locale === "ar" ? "حدسي"  : "N",  value: percentages.N ?? 50 },
    { subject: locale === "ar" ? "مشاعر" : "F",  value: percentages.F ?? 50 },
    { subject: locale === "ar" ? "إدراك" : "P",  value: percentages.P ?? 50 },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} margin={{ top: 8, right: 28, bottom: 8, left: 28 }}>
        <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 12, fontWeight: 700, fill: "var(--text-muted)" }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: "var(--text-muted)" }}
          tickCount={3}
          axisLine={false}
        />
        <Tooltip
          formatter={(v) => [`${Number(v)}%`, ""]}
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            fontSize: "12px",
          }}
        />
        <Radar
          dataKey="value"
          stroke={color}
          fill={color}
          fillOpacity={0.18}
          strokeWidth={2.5}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
