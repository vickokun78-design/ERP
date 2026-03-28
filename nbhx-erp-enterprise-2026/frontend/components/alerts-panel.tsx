'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Clock,
  Bell,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'error',
    title: 'Máquina Fuera de Servicio',
    message: 'Ensambladora #2 requiere mantenimiento urgente',
    timestamp: '10 min ago',
    acknowledged: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Stock Bajo',
    message: 'Material MP-00123 por debajo del mínimo',
    timestamp: '25 min ago',
    acknowledged: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Orden Completada',
    message: 'WO-2026-00120 completada exitosamente',
    timestamp: '1 hora ago',
    acknowledged: true,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Calidad en Límite',
    message: 'Scrap rate cercano al límite en línea 3',
    timestamp: '2 horas ago',
    acknowledged: false,
  },
];

const alertConfig = {
  error: {
    icon: AlertTriangle,
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    iconColor: 'text-yellow-500',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-500',
  },
};

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const acknowledgeAlert = (id: string) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { ...a, acknowledged: true } : a
    ));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Alertas
            </CardTitle>
            <p className="text-sm text-slate-500">
              Notificaciones del sistema
            </p>
          </div>
          {unacknowledgedCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unacknowledgedCount} nuevas
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>No hay alertas pendientes</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const config = alertConfig[alert.type];
              const Icon = config.icon;
              
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'p-3 rounded-lg border transition-all',
                    config.bgColor,
                    config.borderColor,
                    alert.acknowledged && 'opacity-60'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={cn('w-5 h-5 mt-0.5', config.iconColor)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <div className="flex items-center gap-1">
                          {!alert.acknowledged && (
                            <button
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="p-1 hover:bg-white/50 rounded"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            </button>
                          )}
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="p-1 hover:bg-white/50 rounded"
                          >
                            <X className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {alerts.length > 0 && (
          <Button variant="outline" className="w-full mt-3" size="sm">
            Ver todas las alertas
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
