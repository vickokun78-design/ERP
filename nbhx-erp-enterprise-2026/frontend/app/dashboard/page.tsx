/**
 * ==========================================
 * NBHX ERP Enterprise 2026 - Dashboard Principal
 * ==========================================
 */

'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { KPICards } from '@/components/kpi-cards';
import { ProductionOverview } from '@/components/production-overview';
import { ShopFloorStatus } from '@/components/shop-floor-status';
import { OEEDashboard } from '@/components/oee-dashboard';
import { AlertsPanel } from '@/components/alerts-panel';
import { QuickActions } from '@/components/quick-actions';

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState('today');

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard Principal
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Vista general de operaciones en tiempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
          >
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Este trimestre</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Production Overview - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ProductionOverview />
        </div>

        {/* Alerts Panel */}
        <div>
          <AlertsPanel />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Shop Floor Status */}
        <ShopFloorStatus />

        {/* OEE Dashboard */}
        <OEEDashboard />
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <QuickActions />
      </div>
    </DashboardLayout>
  );
}
