'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const oeeData = [
  { name: 'Disponibilidad', value: 95.2, color: '#3b82f6' },
  { name: 'Rendimiento', value: 91.8, color: '#10b981' },
  { name: 'Calidad', value: 99.1, color: '#f59e0b' },
];

const oeeTotal = 86.7;

const pieData = [
  { name: 'Valor Agregado', value: 86.7, color: '#10b981' },
  { name: 'Pérdidas', value: 13.3, color: '#ef4444' },
];

export function OEEDashboard() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          OEE - Efectividad Global
        </CardTitle>
        <p className="text-sm text-slate-500">
          Overall Equipment Effectiveness
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {/* OEE Total */}
          <div className="relative w-32 h-32 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{oeeTotal}%</span>
              <span className="text-xs text-slate-500">OEE</span>
            </div>
          </div>

          {/* Componentes OEE */}
          <div className="w-full space-y-4">
            {oeeData.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    {item.name}
                  </span>
                  <span className="font-medium" style={{ color: item.color }}>
                    {item.value}%
                  </span>
                </div>
                <Progress
                  value={item.value}
                  className="h-2"
                  style={{ backgroundColor: `${item.color}20` }}
                />
              </div>
            ))}
          </div>

          {/* Benchmark */}
          <div className="w-full mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Benchmark Mundial</span>
              <span className="text-sm font-medium">85%</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-slate-500">Nuestro OEE</span>
              <span className={`text-sm font-bold ${oeeTotal >= 85 ? 'text-green-600' : 'text-orange-600'}`}>
                {oeeTotal}%
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-slate-500">Diferencia</span>
              <span className={`text-sm font-bold ${oeeTotal >= 85 ? 'text-green-600' : 'text-red-600'}`}>
                {oeeTotal >= 85 ? '+' : ''}{(oeeTotal - 85).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
