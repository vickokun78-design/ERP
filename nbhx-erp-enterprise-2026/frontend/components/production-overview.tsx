'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { MoreHorizontal, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const productionData = [
  { name: 'Lun', plan: 400, actual: 380, scrap: 20 },
  { name: 'Mar', plan: 450, actual: 430, scrap: 15 },
  { name: 'Mie', plan: 400, actual: 390, scrap: 10 },
  { name: 'Jue', plan: 500, actual: 480, scrap: 25 },
  { name: 'Vie', plan: 480, actual: 470, scrap: 12 },
  { name: 'Sab', plan: 300, actual: 290, scrap: 8 },
  { name: 'Dom', plan: 200, actual: 180, scrap: 5 },
];

const oeeTrendData = [
  { time: '06:00', oee: 82 },
  { time: '08:00', oee: 85 },
  { time: '10:00', oee: 88 },
  { time: '12:00', oee: 86 },
  { time: '14:00', oee: 90 },
  { time: '16:00', oee: 87 },
  { time: '18:00', oee: 89 },
];

export function ProductionOverview() {
  const [chartType, setChartType] = useState('bar');

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">
            Resumen de Producción
          </CardTitle>
          <p className="text-sm text-slate-500">
            Comparativo plan vs actual
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Últimos 7 días
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="production" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="production">Producción</TabsTrigger>
            <TabsTrigger value="oee">Tendencia OEE</TabsTrigger>
          </TabsList>

          <TabsContent value="production" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="plan"
                  name="Planificado"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="actual"
                  name="Real"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="scrap"
                  name="Scrap"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="oee" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={oeeTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'OEE']}
                />
                <Line
                  type="monotone"
                  dataKey="oee"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">2,620</p>
            <p className="text-xs text-slate-500">Planificado</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">2,520</p>
            <p className="text-xs text-slate-500">Producido</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">95</p>
            <p className="text-xs text-slate-500">Scrap</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
