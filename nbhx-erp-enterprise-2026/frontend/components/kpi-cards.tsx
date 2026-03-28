'use client';

import { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Factory,
  AlertTriangle,
  Clock,
  CheckCircle,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber, formatPercentage } from '@/lib/utils';

interface KPIData {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'orange' | 'red';
}

const mockKPIData: KPIData[] = [
  {
    title: 'Órdenes Activas',
    value: 24,
    change: 12.5,
    changeLabel: 'vs ayer',
    icon: Factory,
    color: 'blue',
  },
  {
    title: 'OEE Promedio',
    value: '87.3%',
    change: 3.2,
    changeLabel: 'vs semana pasada',
    icon: BarChart3,
    color: 'green',
  },
  {
    title: 'Piezas Producidas',
    value: '12,458',
    change: 8.7,
    changeLabel: 'vs ayer',
    icon: Package,
    color: 'blue',
  },
  {
    title: 'Scrap Rate',
    value: '2.1%',
    change: -0.5,
    changeLabel: 'vs mes pasado',
    icon: AlertTriangle,
    color: 'orange',
  },
  {
    title: 'Tiempo de Respuesta',
    value: '4.2h',
    change: -15.3,
    changeLabel: 'vs promedio',
    icon: Clock,
    color: 'green',
  },
  {
    title: 'Calidad OK',
    value: '98.7%',
    change: 0.3,
    changeLabel: 'vs objetivo',
    icon: CheckCircle,
    color: 'green',
  },
];

const colorClasses = {
  blue: 'bg-blue-500/10 text-blue-600',
  green: 'bg-green-500/10 text-green-600',
  orange: 'bg-orange-500/10 text-orange-600',
  red: 'bg-red-500/10 text-red-600',
};

export function KPICards() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-slate-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {mockKPIData.map((kpi, index) => (
        <Card
          key={index}
          className="hover:shadow-md transition-shadow animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {kpi.title}
                </p>
                <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {kpi.change > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      kpi.change > 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {kpi.change > 0 ? '+' : ''}
                    {kpi.change}%
                  </span>
                  <span className="text-xs text-slate-400">{kpi.changeLabel}</span>
                </div>
              </div>
              <div
                className={`p-2 rounded-lg ${colorClasses[kpi.color]}`}
              >
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
