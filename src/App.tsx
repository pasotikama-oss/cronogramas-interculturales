import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrainingSession, 
  InstitutionProfile, 
  BrandingSettings, 
  ConflictAlert,
  BackupSnapshot
} from './types/schedule';
import { 
  loadSessions, 
  saveSessions, 
  loadInstitutions, 
  saveInstitutions, 
  loadBranding, 
  saveBranding, 
  resetToDefaults, 
  exportToCSV,
  exportToHTML,
  saveAutoSnapshot,
  getEmergencyUndoSnapshot,
  setEmergencyUndoSnapshot
} from './utils/storage';
import { analyzeConflictsAndRules } from './utils/conflictChecker';
import { useOnlineStatus } from './hooks/useOnlineStatus';

// Components
import { Navbar, ActiveTab } from './components/Navbar';
import { TableView } from './components/TableView';
import { CalendarView } from './components/CalendarView';
import { InstitutionsView } from './components/InstitutionsView';
import { ValidatorView } from './components/ValidatorView';
import { BrandingView } from './components/BrandingView';
import { PrintView } from './components/PrintView';
import { ScheduleModal } from './components/ScheduleModal';
import { QuickAssignModal } from './components/QuickAssignModal';
import { BackupModal } from './components/BackupModal';
import { PedroGuideModal } from './components/PedroGuideModal';
import { LogoBadge } from './components/LogoBadge';
import { Heart, WifiOff, Wifi, AlertTriangle, RotateCcw, ShieldCheck } from 'lucide-react';

export default function App() {
  const isOnline = useOnlineStatus();

  // App State with Persistence
  const [sessions, setSessions] = useState<TrainingSession[]>(() => loadSessions());
  const [institutions, setInstitutions] = useState<InstitutionProfile[]>(() => loadInstitutions());
  const [branding, setBranding] = useState<BrandingSettings>(() => loadBranding());

  // Emergency Undo State if someone accidentally resets
  const [undoBanner, setUndoBanner] = useState<{
    show: boolean;
    message: string;
    snapshot: BackupSnapshot;
  } | null>(() => {
    const existing = getEmergencyUndoSnapshot();
    if (existing) {
      return {
        show: true,
        message: 'Existe una copia de seguridad creada automáticamente antes del último restablecimiento.',
        snapshot: existing
      };
    }
    return null;
  });

  // Navigation State - Defaults to Calendar view as requested by user
  const [activeTab, setActiveTab] = useState<ActiveTab>('calendar');
  const [isPrintView, setIsPrintView] = useState<boolean>(false);

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
  const [initialDateForModal, setInitialDateForModal] = useState<string | undefined>(undefined);
  const [isQuickAssignModalOpen, setIsQuickAssignModalOpen] = useState<boolean>(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Check if opened with a shareable configuration link (#config=...)
  useEffect(() => {
    if (window.location.hash && window.location.hash.startsWith('#config=')) {
      try {
        const raw = window.location.hash.replace('#config=', '');
        const decoded = JSON.parse(decodeURIComponent(escape(atob(raw))));
        if (decoded.branding) {
          setBranding(prev => ({ ...prev, ...decoded.branding }));
          saveBranding(decoded.branding);
        }
        if (decoded.sessions && Array.isArray(decoded.sessions)) {
          setSessions(decoded.sessions);
          saveSessions(decoded.sessions);
        }
        alert('¡Configuración institucional y logos cargados exitosamente en este dispositivo!');
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (err) {
        console.error('Error importing config from URL:', err);
      }
    }
  }, []);

  // Auto-save sessions whenever they change
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  // Auto-save institutions
  useEffect(() => {
    saveInstitutions(institutions);
  }, [institutions]);

  // Auto-save branding
  useEffect(() => {
    saveBranding(branding);
  }, [branding]);

  // Periodic automatic milestone snapshots whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      const timer = setTimeout(() => {
        saveAutoSnapshot(sessions, institutions, branding, 'Auto-guardado periódico de seguridad');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sessions.length]);

  // Analyze conflicts & rules
  const alerts = useMemo<ConflictAlert[]>(() => {
    return analyzeConflictsAndRules(sessions);
  }, [sessions]);

  const highAlertCount = useMemo(() => {
    return alerts.filter(a => a.severity === 'high').length;
  }, [alerts]);

  const pendingSessions = useMemo(() => {
    return sessions.filter(s => s.status === 'PDTE');
  }, [sessions]);

  // Handlers for Session CRUD
  const handleOpenNewSession = (dateStr?: string) => {
    setEditingSession(null);
    setInitialDateForModal(dateStr);
    setIsScheduleModalOpen(true);
  };

  const handleEditSession = (session: TrainingSession) => {
    setEditingSession(session);
    setInitialDateForModal(session.specificDate);
    setIsScheduleModalOpen(true);
  };

  const handleDuplicateSession = (session: TrainingSession) => {
    const duplicated: TrainingSession = {
      ...session,
      id: `sess-${Date.now()}`,
      itemNumber: sessions.length + 1,
      institution: `${session.institution} (Copia)`,
      status: 'PDTE',
      observations: `${session.observations || ''} [Duplicado para nuevo grupo]`.trim()
    };
    setSessions(prev => [duplicated, ...prev]);
  };

  const handleDeleteSession = (id: string) => {
    const sessionToDelete = sessions.find(s => s.id === id);
    if (!sessionToDelete) return;

    if (confirm(`¿Estás seguro de suprimir la formación para "${sessionToDelete.institution}"?`)) {
      setSessions(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSaveSession = (savedSession: TrainingSession, newInstitution?: InstitutionProfile) => {
    if (newInstitution) {
      setInstitutions(prev => {
        if (prev.some(i => i.name.toLowerCase() === newInstitution.name.toLowerCase())) return prev;
        return [...prev, newInstitution];
      });
    }
    setSessions(prev => {
      const exists = prev.some(s => s.id === savedSession.id);
      if (exists) {
        return prev.map(s => (s.id === savedSession.id ? savedSession : s));
      } else {
        return [savedSession, ...prev];
      }
    });
  };

  const handleConfirmQuickAssignment = (updatedSession: TrainingSession) => {
    handleSaveSession(updatedSession);
  };

  const handleUpdateBranding = (updated: BrandingSettings) => {
    setBranding(updated);
  };

  const handleResetBranding = () => {
    const defaults = resetToDefaults();
    setBranding(defaults.branding);
  };

  const handleRestoreData = (data: {
    sessions?: TrainingSession[];
    institutions?: InstitutionProfile[];
    branding?: BrandingSettings;
  }) => {
    if (data.sessions) setSessions(data.sessions);
    if (data.institutions) setInstitutions(data.institutions);
    if (data.branding) setBranding(data.branding);
  };

  const handleResetAll = () => {
    const result = resetToDefaults();
    setSessions(result.sessions);
    setInstitutions(result.institutions);
    setBranding(result.branding);
    if (result.emergencySnapshot) {
      setUndoBanner({
        show: true,
        message: `Se restableció la matriz inicial a las 38 sesiones concertadas. Se guardó una copia de seguridad previa con ${result.emergencySnapshot.sessionCount} sesiones.`,
        snapshot: result.emergencySnapshot
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Offline Notification if disconnected */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs font-semibold px-4 py-1 text-center flex items-center justify-center gap-1.5 shadow-xs print:hidden">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Estás en modo sin conexión (Offline). Todos los cambios se están guardando de forma segura en tu dispositivo.</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        branding={branding}
        activeTab={activeTab}
        setActiveTab={tab => {
          setIsPrintView(false);
          setActiveTab(tab);
        }}
        isOnline={isOnline}
        onOpenNewSession={handleOpenNewSession}
        onPrint={() => setIsPrintView(true)}
        onExportCSV={() => exportToCSV(sessions)}
        onExportHTML={() => exportToHTML(sessions, branding, institutions)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        conflictCount={highAlertCount}
        pendingCount={pendingSessions.length}
      />

      {/* Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
        {/* Emergency Undo Notification Banner */}
        {undoBanner?.show && (
          <div className="bg-amber-400 text-slate-950 px-4 py-3 rounded-2xl shadow-lg border-2 border-amber-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-medium text-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-slate-950 text-amber-400 rounded-lg shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold block text-sm">¿Restableciste por error o accidente?</span>
                <span className="text-slate-900 font-semibold">{undoBanner.message}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => {
                  handleRestoreData(undoBanner.snapshot.data);
                  setEmergencyUndoSnapshot(null);
                  setUndoBanner(null);
                }}
                className="bg-slate-950 hover:bg-slate-900 text-amber-300 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Deshacer y Recuperar Mis Datos ({undoBanner.snapshot.sessionCount} sesiones)</span>
              </button>
              <button
                onClick={() => {
                  setEmergencyUndoSnapshot(null);
                  setUndoBanner(null);
                }}
                className="text-slate-800 hover:text-black px-2 py-1 text-xs font-bold"
                title="Descartar aviso"
              >
                Descartar
              </button>
            </div>
          </div>
        )}
        {isPrintView ? (
          <PrintView
            sessions={sessions}
            branding={branding}
            onBack={() => setIsPrintView(false)}
            onExportHTML={() => exportToHTML(sessions, branding)}
          />
        ) : (
          <>
            {activeTab === 'table' && (
              <TableView
                sessions={sessions}
                onEditSession={handleEditSession}
                onDuplicateSession={handleDuplicateSession}
                onDeleteSession={handleDeleteSession}
                onOpenQuickAssign={() => setIsQuickAssignModalOpen(true)}
                onOpenNewSession={handleOpenNewSession}
                onExportHTML={() => exportToHTML(sessions, branding)}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                sessions={sessions}
                onEditSession={handleEditSession}
                onAddSessionForDate={(dateStr) => handleOpenNewSession(dateStr)}
                onDeleteSession={handleDeleteSession}
                onDuplicateSession={handleDuplicateSession}
                onExportCSV={() => exportToCSV(sessions)}
                onExportHTML={() => exportToHTML(sessions, branding)}
                onPrint={() => setIsPrintView(true)}
              />
            )}

            {activeTab === 'institutions' && (
              <InstitutionsView
                institutions={institutions}
              />
            )}

            {activeTab === 'validator' && (
              <ValidatorView
                sessions={sessions}
                alerts={alerts}
                onOpenQuickAssign={() => setIsQuickAssignModalOpen(true)}
                onEditSession={handleEditSession}
              />
            )}

            {activeTab === 'branding' && (
              <BrandingView
                branding={branding}
                onUpdateBranding={handleUpdateBranding}
                onResetBranding={handleResetBranding}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LogoBadge type="logo1" customUrl={branding.logo1Url} size="sm" />
            <LogoBadge type="logo2" customUrl={branding.logo2Url} size="sm" />
            <span className="font-semibold text-slate-700">{branding.programTitle}</span>
            <span>•</span>
            <span>{branding.organizationName}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>
              Desarrollado para el Coord. <strong>{branding.coordinatorName}</strong> por Ing. <strong>{branding.engineerName}</strong>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              PWA Offline 100%
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSave={handleSaveSession}
        editingSession={editingSession}
        institutions={institutions}
        allSessions={sessions}
        initialDate={initialDateForModal}
      />

      <QuickAssignModal
        isOpen={isQuickAssignModalOpen}
        onClose={() => setIsQuickAssignModalOpen(false)}
        pendingSessions={pendingSessions}
        allSessions={sessions}
        onConfirmAssignment={handleConfirmQuickAssignment}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        sessions={sessions}
        institutions={institutions}
        branding={branding}
        onRestoreData={handleRestoreData}
        onResetAll={handleResetAll}
      />

      <PedroGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
