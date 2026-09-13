import { TrainingSession, InstitutionProfile, BrandingSettings, BackupSnapshot } from '../types/schedule';
import { INITIAL_SESSIONS, INITIAL_INSTITUTIONS, DEFAULT_BRANDING } from '../data/initialData';
import { USER_LOADED_SESSIONS } from '../data/userLoadedSessions';

const STORAGE_KEYS = {
  SESSIONS: 'biz_cronograma_sessions_v4',
  INSTITUTIONS: 'biz_cronograma_institutions_v4',
  BRANDING: 'biz_cronograma_branding_v3',
  SNAPSHOTS: 'biz_cronograma_snapshots_v1',
  EMERGENCY_UNDO: 'biz_cronograma_emergency_undo_v1'
};

const sanitizeSession = (s: any): TrainingSession => {
  return {
    ...s,
    daysOfWeek: Array.isArray(s.daysOfWeek) ? s.daysOfWeek : (s.dayOfWeek ? [s.dayOfWeek] : []),
    institution: s.institution || '',
    municipality: s.municipality || 'Uribia',
    modality: s.modality || 'Presencial',
    trainingType: s.trainingType || '',
    targetAudience: Array.isArray(s.targetAudience) ? s.targetAudience : (s.targetAudience ? [s.targetAudience] : ['Estudiantes']),
    datesScheduled: s.datesScheduled || {}
  };
};

export function loadSessions(): TrainingSession[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(sanitizeSession);
      }
    }

    // Migration from v2 if available: replace pending Jaipa & Yotojoroin with the approved sessions
    const savedV2 = localStorage.getItem('biz_cronograma_sessions_v2');
    if (savedV2) {
      const parsedV2 = JSON.parse(savedV2);
      if (Array.isArray(parsedV2) && parsedV2.length > 0) {
        // Keep any custom sessions the user added, but ensure Jaipa and Yotojoroin are the official ones
        const nonJaipaYoto = parsedV2.filter(
          (s: TrainingSession) =>
            !(s.institution || '').toLowerCase().includes('jaipa') &&
            !(s.institution || '').toLowerCase().includes('yotojoroin') &&
            s.id !== 'S37' &&
            s.id !== 'S38'
        );
        const newJaipaYoto = USER_LOADED_SESSIONS.filter(
          s =>
            (s.institution || '').toLowerCase().includes('jaipa') ||
            (s.institution || '').toLowerCase().includes('yotojoroin')
        );
        const merged = [...nonJaipaYoto, ...newJaipaYoto].map(sanitizeSession);
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(merged));
        return merged;
      }
    }
  } catch (err) {
    console.error('Error loading sessions from storage:', err);
  }
  // Default to the complete 45 sessions from the user's official coordination schedule
  return USER_LOADED_SESSIONS.map(sanitizeSession);
}

export function saveSessions(sessions: TrainingSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Error saving sessions to storage:', err);
  }
}

export function loadInstitutions(): InstitutionProfile[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.INSTITUTIONS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading institutions from storage:', err);
  }
  return INITIAL_INSTITUTIONS;
}

export function saveInstitutions(institutions: InstitutionProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INSTITUTIONS, JSON.stringify(institutions));
  } catch (err) {
    console.error('Error saving institutions to storage:', err);
  }
}

export function loadBranding(): BrandingSettings {
  try {
    let saved = localStorage.getItem(STORAGE_KEYS.BRANDING);
    if (!saved) {
      // Check v2 or v1 if exists
      saved = localStorage.getItem('biz_cronograma_branding_v2') || localStorage.getItem('biz_cronograma_branding_v1');
    }
    if (saved) {
      const parsed = JSON.parse(saved);
      let coordinatorName = parsed.coordinatorName;
      if (!coordinatorName || coordinatorName === 'Andrés Fernández') {
        coordinatorName = DEFAULT_BRANDING.coordinatorName;
      }
      let engineerName = parsed.engineerName;
      if (!engineerName || engineerName === 'Pedro') {
        engineerName = DEFAULT_BRANDING.engineerName;
      }
      let logo1Url = parsed.logo1Url;
      // Upgrade from old generic data URI or empty string to the official fixed server SVG
      if (!logo1Url || logo1Url.trim() === '' || logo1Url.startsWith('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"')) {
        logo1Url = DEFAULT_BRANDING.logo1Url;
      }
      let logo2Url = parsed.logo2Url;
      if (!logo2Url || logo2Url.trim() === '' || logo2Url.startsWith('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"')) {
        logo2Url = DEFAULT_BRANDING.logo2Url;
      }

      return {
        ...DEFAULT_BRANDING,
        ...parsed,
        coordinatorName,
        engineerName,
        logo1Url,
        logo2Url
      };
    }
  } catch (err) {
    console.error('Error loading branding from storage:', err);
  }
  return DEFAULT_BRANDING;
}

export function saveBranding(branding: BrandingSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BRANDING, JSON.stringify(branding));
  } catch (err) {
    console.error('Error saving branding to storage:', err);
  }
}

export function loadAutoSnapshots(): BackupSnapshot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SNAPSHOTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error loading snapshots:', err);
  }
  return [];
}

export function saveAutoSnapshot(
  sessions: TrainingSession[],
  institutions: InstitutionProfile[],
  branding: BrandingSettings,
  reason: string
): BackupSnapshot {
  const now = new Date();
  const readableDate = now.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const snapshot: BackupSnapshot = {
    id: `snap_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: now.toISOString(),
    readableDate,
    reason,
    sessionCount: sessions.length,
    data: {
      sessions: JSON.parse(JSON.stringify(sessions)),
      institutions: JSON.parse(JSON.stringify(institutions)),
      branding: JSON.parse(JSON.stringify(branding))
    }
  };

  try {
    const existing = loadAutoSnapshots();
    // Keep max 15 snapshots (most recent first)
    const updated = [snapshot, ...existing].slice(0, 15);
    localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving snapshot:', err);
  }

  return snapshot;
}

export function getEmergencyUndoSnapshot(): BackupSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMERGENCY_UNDO);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading emergency undo snapshot:', err);
  }
  return null;
}

export function setEmergencyUndoSnapshot(snapshot: BackupSnapshot | null): void {
  try {
    if (snapshot) {
      localStorage.setItem(STORAGE_KEYS.EMERGENCY_UNDO, JSON.stringify(snapshot));
    } else {
      localStorage.removeItem(STORAGE_KEYS.EMERGENCY_UNDO);
    }
  } catch (err) {
    console.error('Error setting emergency undo snapshot:', err);
  }
}

export function resetToDefaults(): {
  sessions: TrainingSession[];
  institutions: InstitutionProfile[];
  branding: BrandingSettings;
  emergencySnapshot?: BackupSnapshot;
} {
  let emergencySnapshot: BackupSnapshot | undefined;
  try {
    // 1. Check current saved state and create an automatic safety backup BEFORE resetting
    const currentSessions = loadSessions();
    const currentInstitutions = loadInstitutions();
    const currentBranding = loadBranding();

    if (currentSessions && currentSessions.length > 0) {
      emergencySnapshot = saveAutoSnapshot(
        currentSessions,
        currentInstitutions,
        currentBranding,
        'Copia automática de seguridad antes de restablecer matriz'
      );
      setEmergencyUndoSnapshot(emergencySnapshot);
    }

    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.INSTITUTIONS);
    localStorage.removeItem(STORAGE_KEYS.BRANDING);
  } catch (err) {
    console.error('Error resetting storage:', err);
  }
  return {
    sessions: USER_LOADED_SESSIONS,
    institutions: INITIAL_INSTITUTIONS,
    branding: DEFAULT_BRANDING,
    emergencySnapshot
  };
}

export function exportToCSV(sessions: TrainingSession[]): void {
  const headers = [
    'No.',
    'Zona / Municipio',
    'Institución / Grupo',
    'Sede',
    'Jornada Académica',
    'Audiencia',
    'Grado / Ciclo',
    'Tipo de Formación',
    'Modalidad',
    'Fase / Estado',
    'Día(s) de la Semana',
    'Fechas Septiembre',
    'Fechas Octubre',
    'Fechas Noviembre',
    'Hora Inicio',
    'Hora Fin',
    'Duración (h)',
    'Frecuencia',
    'Responsable',
    'Observaciones / Flexibilidad',
    'Condiciones de Infraestructura'
  ];

  const rows = sessions.map((s, idx) => [
    idx + 1,
    s.municipality,
    `"${s.institution.replace(/"/g, '""')}"`,
    `"${(s.campus || '').replace(/"/g, '""')}"`,
    `"${s.academicShift.replace(/"/g, '""')}"`,
    s.targetAudience,
    `"${(s.gradeOrCycle || '').replace(/"/g, '""')}"`,
    s.trainingType,
    s.modality,
    s.status,
    `"${s.daysOfWeek.join(', ')}"`,
    `"${(s.datesScheduled.september || []).join('; ')}"`,
    `"${(s.datesScheduled.october || []).join('; ')}"`,
    `"${(s.datesScheduled.november || []).join('; ')}"`,
    s.startTime,
    s.endTime,
    s.durationHours,
    s.frequency,
    s.responsible,
    `"${(s.observations || '').replace(/"/g, '""')}"`,
    `"${(s.infrastructureNotes || '').replace(/"/g, '""')}"`
  ]);

  // UTF-8 BOM for proper accented character display in Excel (ñ, tildes, etc.)
  const BOM = '\uFEFF';
  const csvContent = BOM + [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `CRONOGRAMA_FORMACIONES_VOCACION_TRANSFORMA_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportBackupJSON(
  sessions: TrainingSession[],
  institutions: InstitutionProfile[],
  branding: BrandingSettings
): void {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    sessions,
    institutions,
    branding
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `COPIA_SEGURIDAD_CRONOGRAMA_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export { exportToHTML } from './htmlExporter';


