'use client';

import {
  Plus,
  FileText,
  ClipboardList,
  Package,
  Wrench,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const quickActions = [
  {
    label: 'Nueva Orden',
    icon: Plus,
    href: '/production/work-orders/new',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    label: 'Reportar Scrap',
    icon: ClipboardList,
    href: '/production/scrap-report',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    label: 'Ajuste Inventario',
    icon: Package,
    href: '/inventory/adjustment',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    label: 'NCR Calidad',
    icon: FileText,
    href: '/quality/ncr/new',
    color: 'bg-red-500 hover:bg-red-600',
  },
  {
    label: 'Solicitud Mantto',
    icon: Wrench,
    href: '/maintenance/request',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    label: 'Reporte Asistencia',
    icon: Users,
    href: '/hr/attendance',
    color: 'bg-cyan-500 hover:bg-cyan-600',
  },
  {
    label: 'Reportes BI',
    icon: BarChart3,
    href: '/analytics/reports',
    color: 'bg-indigo-500 hover:bg-indigo-600',
  },
  {
    label: 'Configuración',
    icon: Settings,
    href: '/admin/settings',
    color: 'bg-slate-500 hover:bg-slate-600',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center gap-2 p-4 hover:border-nbhx-blue hover:bg-nbhx-blue/5 transition-colors"
              >
                <div className={`p-2 rounded-lg text-white ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-center">
                  {action.label}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
