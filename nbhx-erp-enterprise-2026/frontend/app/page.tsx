/**
 * ==========================================
 * NBHX ERP Enterprise 2026 - Login Page
 * ==========================================
 */

import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-nbhx-blue to-nbhx-blue-dark shadow-lg mb-4">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            NBHX ERP
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Enterprise 2026
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
            Sistema de Gestión para Manufactura
          </p>
        </div>

        {/* Formulario de Login */}
        <LoginForm />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>© 2026 NBHX Group. Todos los derechos reservados.</p>
          <p className="mt-1">Versión 2026.1.0</p>
        </div>
      </div>
    </div>
  );
}
