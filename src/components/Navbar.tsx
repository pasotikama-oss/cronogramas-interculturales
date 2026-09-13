import React from 'react';
import { 
  Printer, 
  Download, 
  Plus, 
  FileSpreadsheet, 
  CalendarDays, 
  Building2, 
  ShieldAlert, 
  Settings, 
  Wifi, 
  WifiOff, 
  HelpCircle,
  HardDriveDownload,
  Share2,
  FileCode
} from 'lucide-react';
import { BrandingSettings } from '../types/schedule';
import { LogoBadge } from './LogoBadge';
import { usePWAInstall } from '../hooks/usePWAInstall';

export type ActiveTab = 'table' | 'calendar' | 'institutions' | 'validator' | 'branding';

interface NavbarProps {
  branding: BrandingSettings;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOnline: boolean;
  onOpenNewSession: () => void;
  onPrint: () => void;
  onExportCSV: () => void;
  onExportHTML: () => void;
  onOpenBackup: () => void;
  onOpenGuide: () => void;
  conflictCount: number;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  branding,
  activeTab,
  setActiveTab,
  isOnline,
  onOpenNewSession,
  onPrint,
  onExportCSV,
  onExportHTML,
  onOpenBackup,
  onOpenGuide,
  conflictCount,
  pendingCount
}) => {
  const { isInstallable, install } = usePWAInstall();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
      {/* Top Bar with Logos, Titles, Offline status and actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Logo 1, Titles, Logo 2 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <LogoBadge type="logo1" customUrl={branding.logo1Url} size="md" />
              <LogoBadge type="logo2" customUrl={branding.logo2Url} size="md" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {branding.organizationName}
                </span>
                {/* Offline Status Badge */}
                {isOnline ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Wifi className="w-3 h-3 text-emerald-500" />
                    En línea
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 animate-pulse">
                    <WifiOff className="w-3 h-3 text-amber-600" />
                    Modo Offline (Activo sin señal)
                  </span>
                )}
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
                {branding.programTitle}
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {branding.programSubtitle} • Coord. {branding.coordinatorName}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* PWA Install Button if available */}
            {isInstallable && (
              <button
                id="btn-pwa-install"
                onClick={install}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition"
                title="Instalar como app en tu computadora o celular para usar siempre sin internet"
              >
                <HardDriveDownload className="w-3.5 h-3.5 text-blue-400" />
                <span>Instalar App</span>
              </button>
            )}

            {/* Guide for Pedro */}
            <button
              id="btn-open-pedro-guide"
              onClick={onOpenGuide}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              title="Guía y presentación de Pedro para el Coordinador Andrés"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Guía Ing. Pedro</span>
            </button>

            {/* Print button */}
            <button
              id="btn-print-schedule"
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg shadow-xs transition"
              title="Abrir vista de impresión y reporte oficial en PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-700" />
              <span>Imprimir / PDF</span>
            </button>

            {/* Export CSV */}
            <button
              id="btn-export-csv"
              onClick={onExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
              title="Descargar tabla completa en formato Excel compatible (CSV con tildes)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Descargar Excel</span>
              <span className="md:hidden">Excel</span>
            </button>

            {/* Export HTML */}
            <button
              id="btn-export-html"
              onClick={onExportHTML}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
              title="Descargar cronograma como página web autónoma (.html) para abrir en cualquier celular o PC sin internet ni servidor"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">Descargar en HTML</span>
              <span className="md:hidden">HTML</span>
            </button>

            {/* Backup JSON */}
            <button
              id="btn-open-backup"
              onClick={onOpenBackup}
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
              title="Copia de seguridad y restaurar"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* New Session Button */}
            <button
              id="btn-add-new-session"
              onClick={onOpenNewSession}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Nueva Sesión</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-1 pt-3 border-t border-slate-100 mt-2">
          <button
            id="tab-btn-table"
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold whitespace-nowrap rounded-t-lg transition border-b-2 ${
              activeTab === 'table'
                ? 'text-blue-700 border-blue-600 bg-blue-50/70'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Matriz Oficial (Excel)</span>
          </button>

          <button
            id="tab-btn-calendar"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold whitespace-nowrap rounded-t-lg transition border-b-2 ${
              activeTab === 'calendar'
                ? 'text-blue-700 border-blue-600 bg-blue-50/70'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Calendario & Días</span>
          </button>

          <button
            id="tab-btn-institutions"
            onClick={() => setActiveTab('institutions')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold whitespace-nowrap rounded-t-lg transition border-b-2 ${
              activeTab === 'institutions'
                ? 'text-blue-700 border-blue-600 bg-blue-50/70'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Instituciones & Logística (12)</span>
          </button>

          <button
            id="tab-btn-validator"
            onClick={() => setActiveTab('validator')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold whitespace-nowrap rounded-t-lg transition border-b-2 ${
              activeTab === 'validator'
                ? 'text-blue-700 border-blue-600 bg-blue-50/70'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Reglas Uribia & Cruces</span>
            {conflictCount > 0 ? (
              <span className="ml-1 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {conflictCount}
              </span>
            ) : pendingCount > 0 ? (
              <span className="ml-1 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingCount} PDTE
              </span>
            ) : (
              <span className="ml-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                OK
              </span>
            )}
          </button>

          <button
            id="tab-btn-branding"
            onClick={() => setActiveTab('branding')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold whitespace-nowrap rounded-t-lg transition border-b-2 ${
              activeTab === 'branding'
                ? 'text-blue-700 border-blue-600 bg-blue-50/70'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Personalizar Logos & Membrete</span>
          </button>
        </div>
      </div>
    </header>
  );
};
