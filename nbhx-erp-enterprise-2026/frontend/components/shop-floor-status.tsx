'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface WorkCenter {
  id: string;
  name: string;
  status: 'RUNNING' | 'IDLE' | 'DOWN' | 'SETUP' | 'MAINTENANCE';
  currentOrder?: string;
  operator?: string;
  oee: number;
  progress: number;
}

const workCenters: WorkCenter[] = [
  {
    id: 'WC001',
    name: 'Inyectora #1',
    status: 'RUNNING',
    currentOrder: 'WO-2026-00124',
    operator: 'Juan Pérez',
    oee: 92.5,
    progress: 78,
  },
  {
    id: 'WC002',
    name: 'Inyectora #2',
    status: 'RUNNING',
    currentOrder: 'WO-2026-00125',
    operator: 'María García',
    oee: 88.3,
    progress: 65,
  },
  {
    id: 'WC003',
    name: 'Inyectora #3',
    status: 'SETUP',
    currentOrder: undefined,
    operator: 'Carlos López',
    oee: 0,
    progress: 0,
  },
  {
    id: 'WC004',
    name: 'Ensambladora #1',
    status: 'RUNNING',
    currentOrder: 'WO-2026-00126',
    operator: 'Ana Martínez',
    oee: 95.1,
    progress: 92,
  },
  {
    id: 'WC005',
    name: 'Ensambladora #2',
    status: 'DOWN',
    currentOrder: undefined,
    operator: undefined,
    oee: 0,
    progress: 0,
  },
];

const statusConfig = {
  RUNNING: { label: 'En Producción', color: 'bg-green-500', textColor: 'text-green-600' },
  IDLE: { label: 'Inactiva', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
  DOWN: { label: 'Fuera de Servicio', color: 'bg-red-500', textColor: 'text-red-600' },
  SETUP: { label: 'Preparación', color: 'bg-blue-500', textColor: 'text-blue-600' },
  MAINTENANCE: { label: 'Mantenimiento', color: 'bg-orange-500', textColor: 'text-orange-600' },
};

export function ShopFloorStatus() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Estado del Piso de Producción
        </CardTitle>
        <p className="text-sm text-slate-500">
          Monitoreo en tiempo real de centros de trabajo
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workCenters.map((wc) => {
            const status = statusConfig[wc.status];
            return (
              <div
                key={wc.id}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2.5 h-2.5 rounded-full', status.color)} />
                    <span className="font-medium">{wc.name}</span>
                  </div>
                  <Badge variant="outline" className={status.textColor}>
                    {status.label}
                  </Badge>
                </div>

                {wc.status === 'RUNNING' && (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-slate-500">Orden:</span>
                        <span className="ml-1 font-medium">{wc.currentOrder}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Operador:</span>
                        <span className="ml-1 font-medium">{wc.operator}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Progreso</span>
                        <span className="font-medium">{wc.progress}%</span>
                      </div>
                      <Progress value={wc.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-slate-500">OEE</span>
                      <span className="text-sm font-bold text-green-600">
                        {wc.oee}%
                      </span>
                    </div>
                  </>
                )}

                {wc.status === 'DOWN' && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <span className="font-medium">⚠️ Requiere atención</span>
                  </div>
                )}

                {wc.status === 'SETUP' && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <span className="font-medium">🔧 Configurando...</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold">3</p>
            <p className="text-xs text-slate-500">Activas</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mx-auto mb-1" />
            <p className="text-lg font-bold">0</p>
            <p className="text-xs text-slate-500">Inactivas</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-1" />
            <p className="text-lg font-bold">1</p>
            <p className="text-xs text-slate-500">Fuera</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold">1</p>
            <p className="text-xs text-slate-500">Setup</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
