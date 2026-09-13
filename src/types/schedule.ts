export type Municipality = 'Manaure' | 'Riohacha' | 'Uribia';

export type TargetAudience = 'Estudiantes' | 'Docentes' | 'Estudiantes y Docentes';

export type TrainingType = 
  | 'Competencias Técnicas' 
  | 'Habilidades Blandas' 
  | 'Microlearning' 
  | 'Inducción / Sensibilización'
  | 'Transición Energética'
  | 'Formación Docente'
  | string;

export type Modality = 'Presencial' | 'Virtual' | 'Microlearning';

export type ScheduleStatus = 
  | 'APROBADO' 
  | 'PDTE' 
  | 'EN_REVISION' 
  | 'COMPLETADO' 
  | 'POR CONCERTAR' 
  | 'ROTATIVO' 
  | 'CANCELADO';

export type Frequency = 
  | 'Quincenal' 
  | 'Semanal' 
  | '3 veces/semana (continuo)' 
  | 'Mensual' 
  | 'Por Definir'
  | string;

export interface TrainingSession {
  id: string;
  itemNumber: number;
  municipality: Municipality;
  institution: string;
  campus?: string; // Sede
  academicShift: string; // Jornada de referencia (e.g., Mañana 6:00 a 12:00, Tarde 12:00 a 6:00, Sabatina)
  targetAudience: TargetAudience;
  trainingType: TrainingType;
  modality: Modality;
  status: ScheduleStatus;
  daysOfWeek: string[]; // e.g. ['Martes'], ['Lunes', 'Miércoles', 'Viernes'], ['Jueves']
  datesScheduled: {
    september?: string[];
    october?: string[];
    november?: string[];
  };
  specificDate?: string; // e.g. '2026-09-15'
  startTime: string; // '07:00 AM'
  endTime: string;   // '11:00 AM'
  durationHours: number; // e.g. 4.0, 2.0, 0.3
  frequency: Frequency;
  responsible: string; // e.g. 'The Biz Nation'
  gradeOrCycle?: string; // e.g. 'Grado 9°', 'Grados 10° y 11°', 'Ciclo 4', 'Ciclo 6'
  observations: string;
  infrastructureNotes?: string;
  lastUpdated?: string;
}

export interface InstitutionProfile {
  id: string;
  name: string;
  shortName: string;
  municipality: Municipality;
  campuses: string[];
  shifts: string[];
  infrastructure: {
    hasPower: boolean;
    hasInternet: boolean;
    hasSolarPanels?: boolean;
    hasScreensOrProjectors: boolean;
    hasComputersOrTablets: boolean;
    capacity: string;
    generalConditions: string;
  };
  specialAlerts: {
    title: string;
    dates: string;
    description: string;
    level: 'warning' | 'info' | 'critical';
  }[];
}

export interface BrandingSettings {
  logo1Url: string; // Client / Program logo (Vocación que Transforma)
  logo1Name: string;
  logo2Url: string; // The Biz Nation logo
  logo2Name: string;
  programTitle: string;
  programSubtitle: string;
  organizationName: string;
  coordinatorName: string;
  coordinatorRole: string;
  engineerName: string;
  engineerRole: string;
  reportNotes: string;
}

export interface ConflictAlert {
  id: string;
  municipality: Municipality;
  dayOfWeek: string;
  severity: 'high' | 'medium' | 'info';
  title: string;
  description: string;
  affectedSessions: TrainingSession[];
  suggestedAction?: string;
}

export interface BackupSnapshot {
  id: string;
  timestamp: string;
  readableDate: string;
  reason: string;
  sessionCount: number;
  data: {
    sessions: TrainingSession[];
    institutions: InstitutionProfile[];
    branding: BrandingSettings;
  };
}
