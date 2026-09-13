import React, { useState, useEffect } from 'react';
import { 
  TrainingSession, 
  Municipality, 
  TargetAudience, 
  TrainingType, 
  Modality, 
  ScheduleStatus, 
  Frequency,
  InstitutionProfile
} from '../types/schedule';
import { X, Save, AlertTriangle, Clock, MapPin, Building2, BookOpen, Plus, Check } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: TrainingSession, newInstitution?: InstitutionProfile) => void;
  editingSession: TrainingSession | null;
  institutions: InstitutionProfile[];
  allSessions: TrainingSession[];
  initialDate?: string;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const DEFAULT_TRAINING_TYPES: string[] = [
  'Competencias Técnicas',
  'Habilidades Blandas',
  'Formación Docente',
  'Microlearning',
  'Transición Energética',
  'Inducción / Sensibilización'
];

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSession,
  institutions,
  allSessions,
  initialDate
}) => {
  const [formData, setFormData] = useState<Partial<TrainingSession>>({
    municipality: 'Uribia',
    institution: '',
    campus: '',
    academicShift: 'Mañana (6:00 a.m. - 12:00 m.)',
    targetAudience: 'Estudiantes',
    trainingType: 'Competencias Técnicas',
    modality: 'Presencial',
    status: 'APROBADO',
    daysOfWeek: ['Martes'],
    specificDate: '',
    startTime: '07:00 AM',
    endTime: '11:00 AM',
    durationHours: 4.0,
    frequency: 'Quincenal',
    responsible: 'The Biz Nation',
    gradeOrCycle: 'Grado 9°',
    observations: '',
    infrastructureNotes: ''
  });

  // Custom institution input toggle
  const [isCustomInst, setIsCustomInst] = useState(false);
  const [customInstName, setCustomInstName] = useState('');

  // Custom activity input toggle
  const [isCustomActivity, setIsCustomActivity] = useState(false);
  const [customActivityName, setCustomActivityName] = useState('');

  useEffect(() => {
    if (editingSession) {
      setFormData({ ...editingSession });
      setIsCustomInst(false);
      setCustomInstName('');
      // Check if training type is custom
      if (!DEFAULT_TRAINING_TYPES.includes(editingSession.trainingType)) {
        setIsCustomActivity(true);
        setCustomActivityName(editingSession.trainingType);
      } else {
        setIsCustomActivity(false);
        setCustomActivityName('');
      }
    } else {
      // Default new session
      const targetDate = initialDate || '2026-09-15';
      let derivedDay = 'Martes';
      if (targetDate) {
        const parts = targetDate.split('-');
        if (parts.length === 3) {
          const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          const dayIndex = d.getDay(); // 0 = Sun
          const mapDay = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
          derivedDay = mapDay[dayIndex] || 'Martes';
        }
      }

      setFormData({
        id: `sess-${Date.now()}`,
        itemNumber: allSessions.length + 1,
        specificDate: targetDate,
        municipality: 'Uribia',
        institution: 'Media Luna Jawou - Sede Petsuapa',
        campus: 'Sede Petsuapa',
        academicShift: 'Mañana (6:00 a.m. - 12:00 m.)',
        targetAudience: 'Estudiantes',
        trainingType: 'Competencias Técnicas',
        modality: 'Presencial',
        status: 'APROBADO',
        daysOfWeek: [derivedDay],
        datesScheduled: {
          september: [targetDate],
          october: [],
          november: []
        },
        startTime: '07:00 AM',
        endTime: '11:00 AM',
        durationHours: 4.0,
        frequency: 'Quincenal',
        responsible: 'The Biz Nation',
        gradeOrCycle: 'Grado 9°',
        observations: 'Sesión programada en cronograma general.',
        infrastructureNotes: ''
      });
      setIsCustomInst(false);
      setCustomInstName('');
      setIsCustomActivity(false);
      setCustomActivityName('');
    }
  }, [editingSession, isOpen, allSessions.length, initialDate]);

  if (!isOpen) return null;

  // Filter institutions by chosen municipality
  const availableInstitutions = institutions.filter(
    i => i.municipality === formData.municipality
  );

  const handleMunicipalityChange = (mun: Municipality) => {
    const insts = institutions.filter(i => i.municipality === mun);
    const defaultInst = insts[0]?.name || '';
    const defaultCampus = insts[0]?.campuses[0] || '';
    const defaultShift = insts[0]?.shifts[0] || 'Mañana (6:00 a.m. - 12:00 m.)';
    const notes = insts[0]?.infrastructure?.generalConditions || '';

    setFormData({
      ...formData,
      municipality: mun,
      institution: defaultInst,
      campus: defaultCampus,
      academicShift: defaultShift,
      infrastructureNotes: notes
    });
    setIsCustomInst(false);
    setCustomInstName('');
  };

  const handleInstitutionChange = (instName: string) => {
    const found = institutions.find(i => i.name === instName);
    setFormData({
      ...formData,
      institution: instName,
      campus: found?.campuses[0] || instName,
      academicShift: found?.shifts[0] || formData.academicShift,
      infrastructureNotes: found?.infrastructure?.generalConditions || ''
    });
  };

  const handleDateChange = (dateVal: string) => {
    let newDayOfWeek = formData.daysOfWeek;
    if (dateVal) {
      const parts = dateVal.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const dayIndex = d.getDay();
        const mapDay = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const matched = mapDay[dayIndex];
        if (matched) {
          newDayOfWeek = [matched];
        }
      }
    }
    setFormData({
      ...formData,
      specificDate: dateVal,
      daysOfWeek: newDayOfWeek
    });
  };

  const toggleDay = (day: string) => {
    const current = formData.daysOfWeek || [];
    if (current.includes(day)) {
      if (current.length > 1) {
        setFormData({ ...formData, daysOfWeek: current.filter(d => d !== day) });
      }
    } else {
      setFormData({ ...formData, daysOfWeek: [...current, day] });
    }
  };

  // Conflict preview: check if chosen day + Uribia + Presencial creates > 2 institutions
  const checkConflicts = () => {
    if (formData.municipality !== 'Uribia' || formData.modality !== 'Presencial' || formData.status === 'PDTE') {
      return null;
    }

    // Check by specific date first if defined
    if (formData.specificDate) {
      const existingOnDate = allSessions.filter(
        s =>
          s.id !== formData.id &&
          s.municipality === 'Uribia' &&
          s.modality === 'Presencial' &&
          s.status !== 'PDTE' &&
          s.specificDate === formData.specificDate
      );
      const uniqueInstsOnDate = new Set(existingOnDate.map(s => s.institution));
      const chosenInst = isCustomInst ? customInstName : formData.institution;
      if (chosenInst && !uniqueInstsOnDate.has(chosenInst)) {
        uniqueInstsOnDate.add(chosenInst);
      }
      if (uniqueInstsOnDate.size > 2) {
        return `⚠️ Atención de Capacidad: Para la fecha ${formData.specificDate} ya hay ${uniqueInstsOnDate.size} instituciones presenciales en Uribia. La regla operativa establece un MÁXIMO de 2 sedes por día. Se recomienda rotar a miércoles/jueves o la semana siguiente.`;
      }
    }

    // Check by days of week
    for (const day of formData.daysOfWeek || []) {
      const existing = allSessions.filter(
        s =>
          s.id !== formData.id &&
          s.municipality === 'Uribia' &&
          s.modality === 'Presencial' &&
          s.status !== 'PDTE' &&
          s.daysOfWeek.includes(day)
      );

      const uniqueInsts = new Set(existing.map(s => s.institution));
      const chosenInst = isCustomInst ? customInstName : formData.institution;
      if (chosenInst && !uniqueInsts.has(chosenInst)) {
        uniqueInsts.add(chosenInst);
      }

      if (uniqueInsts.size > 2) {
        return `⚠️ Atención de Capacidad: El día ${day} ya tiene ${uniqueInsts.size} instituciones presenciales programadas en Uribia. Máximo permitido: 2 sedes simultáneas.`;
      }
    }
    return null;
  };

  const conflictWarning = checkConflicts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalInstName = isCustomInst ? customInstName.trim() : (formData.institution || '').trim();
    if (!finalInstName) {
      alert('Por favor especifica el nombre de la institución.');
      return;
    }

    const finalActivity = isCustomActivity ? customActivityName.trim() : (formData.trainingType || '').trim();
    if (!finalActivity) {
      alert('Por favor especifica la actividad o tipo de formación.');
      return;
    }

    // If new custom institution, create a profile for it
    let newInstProfile: InstitutionProfile | undefined;
    if (isCustomInst) {
      newInstProfile = {
        id: `inst-custom-${Date.now()}`,
        name: finalInstName,
        shortName: finalInstName.length > 25 ? finalInstName.substring(0, 22) + '...' : finalInstName,
        municipality: formData.municipality as Municipality,
        campuses: [formData.campus || finalInstName],
        shifts: [formData.academicShift || 'Mañana (6:00 a.m. - 12:00 m.)'],
        infrastructure: {
          hasPower: true,
          hasInternet: true,
          hasScreensOrProjectors: true,
          hasComputersOrTablets: true,
          capacity: '30 personas',
          generalConditions: formData.infrastructureNotes || 'Nueva institución añadida.'
        },
        specialAlerts: []
      };
    }

    const fullSession: TrainingSession = {
      id: formData.id || `sess-${Date.now()}`,
      itemNumber: formData.itemNumber || allSessions.length + 1,
      specificDate: formData.specificDate || undefined,
      municipality: formData.municipality as Municipality,
      institution: finalInstName,
      campus: formData.campus || finalInstName,
      academicShift: formData.academicShift || 'Mañana',
      targetAudience: formData.targetAudience as TargetAudience,
      trainingType: finalActivity,
      modality: formData.modality as Modality,
      status: formData.status as ScheduleStatus,
      daysOfWeek: formData.daysOfWeek || ['Martes'],
      datesScheduled: formData.datesScheduled || {
        september: formData.specificDate ? [formData.specificDate] : ['Por definir'],
        october: [],
        november: []
      },
      startTime: formData.startTime || '07:00 AM',
      endTime: formData.endTime || '11:00 AM',
      durationHours: Number(formData.durationHours) || 3.0,
      frequency: formData.frequency as Frequency,
      responsible: formData.responsible || 'The Biz Nation',
      gradeOrCycle: formData.gradeOrCycle || 'Grado 9°',
      observations: formData.observations || '',
      infrastructureNotes: formData.infrastructureNotes || '',
      lastUpdated: new Date().toISOString()
    };

    onSave(fullSession, newInstProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-6 border border-slate-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold">
                {editingSession ? 'Modificar Sesión de Formación' : 'Programar Sesión de Formación'}
              </h3>
              <p className="text-xs text-slate-300">
                Añadir cualquier día, hora, institución y actividad en el cronograma
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Conflict Warning if present */}
          {conflictWarning && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>{conflictWarning}</div>
            </div>
          )}

          {/* Row: Specific Date & Municipality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fecha Específica en Calendario
              </label>
              <input
                type="date"
                value={formData.specificDate || ''}
                onChange={e => handleDateChange(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {formData.specificDate ? `Se programará para este día del mes` : 'Selecciona una fecha exacta o usa los días recurrentes'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Municipio / Territorio *
              </label>
              <select
                id="modal-select-municipality"
                value={formData.municipality}
                onChange={e => handleMunicipalityChange(e.target.value as Municipality)}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
              >
                <option value="Uribia">Uribia (Alta Guajira)</option>
                <option value="Riohacha">Riohacha (Distrito)</option>
                <option value="Manaure">Manaure</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Filtra las instituciones asignadas a este territorio
              </span>
            </div>
          </div>

          {/* Institution Selector or New Custom Institution */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Institución Educativa *
              </label>
              <button
                type="button"
                onClick={() => setIsCustomInst(!isCustomInst)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
              >
                {isCustomInst ? '← Elegir de la lista' : '+ Añadir institución nueva'}
              </button>
            </div>

            {isCustomInst ? (
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={customInstName}
                  onChange={e => setCustomInstName(e.target.value)}
                  placeholder="Escribe el nombre de la nueva institución (ej: Sede Aipir, IE José Antonio Galán...)"
                  className="w-full text-xs p-2.5 bg-white border-2 border-blue-500 rounded-lg focus:outline-none font-bold text-slate-900"
                />
                <span className="text-[10px] text-blue-700 mt-1 block">
                  Se creará y guardará en la lista de instituciones de {formData.municipality}.
                </span>
              </div>
            ) : (
              <select
                id="modal-select-institution"
                value={formData.institution}
                onChange={e => handleInstitutionChange(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                {availableInstitutions.map(inst => (
                  <option key={inst.id} value={inst.name}>
                    {inst.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Sede / Campus & Academic Shift */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sede Específica / Lugar
              </label>
              <input
                type="text"
                value={formData.campus || ''}
                onChange={e => setFormData({ ...formData, campus: e.target.value })}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Sede Puay, Petsuapa, Sede Dividivi..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jornada Académica
              </label>
              <input
                type="text"
                value={formData.academicShift || ''}
                onChange={e => setFormData({ ...formData, academicShift: e.target.value })}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Mañana (6:00 a 12:00), Vespertina (12:00 a 6:00), Sabatina..."
              />
            </div>
          </div>

          {/* Activity / Training Type (Select or Add New Activity) */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Actividad / Tipo de Formación *
              </label>
              <button
                type="button"
                onClick={() => setIsCustomActivity(!isCustomActivity)}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
              >
                {isCustomActivity ? '← Elegir actividad estándar' : '+ Añadir otra actividad'}
              </button>
            </div>

            {isCustomActivity ? (
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={customActivityName}
                  onChange={e => setCustomActivityName(e.target.value)}
                  placeholder="Escribe la actividad (ej: Taller de Robótica Solar, Liderazgo Wayúu, etc.)"
                  className="w-full text-xs p-2.5 bg-white border-2 border-indigo-500 rounded-lg focus:outline-none font-bold text-slate-900"
                />
              </div>
            ) : (
              <select
                value={formData.trainingType}
                onChange={e => setFormData({ ...formData, trainingType: e.target.value })}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                {DEFAULT_TRAINING_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            )}
          </div>

          {/* Audience & Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Audiencia Objetivo *
              </label>
              <select
                value={formData.targetAudience}
                onChange={e => setFormData({ ...formData, targetAudience: e.target.value as TargetAudience })}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Estudiantes">Estudiantes</option>
                <option value="Docentes">Docentes</option>
                <option value="Estudiantes y Docentes">Estudiantes y Docentes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Grado / Ciclo
              </label>
              <input
                type="text"
                value={formData.gradeOrCycle || ''}
                onChange={e => setFormData({ ...formData, gradeOrCycle: e.target.value })}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Estudiantes Ciclo 4 / Grado 9°, Ciclo 6, Docentes..."
              />
            </div>
          </div>

          {/* Modality, Status & Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Modalidad *
              </label>
              <select
                value={formData.modality}
                onChange={e => setFormData({ ...formData, modality: e.target.value as Modality })}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value="Presencial">🏛️ Presencial</option>
                <option value="Virtual">💻 Virtual</option>
                <option value="Microlearning">📱 Microlearning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estado / Concertación *
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as ScheduleStatus })}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
              >
                <option value="APROBADO">APROBADO / Concertado</option>
                <option value="POR CONCERTAR">POR CONCERTAR (Pendiente)</option>
                <option value="ROTATIVO">ROTATIVO</option>
                <option value="CANCELADO">CANCELADO / Receso</option>
                <option value="PDTE">PDTE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Frecuencia
              </label>
              <select
                value={formData.frequency}
                onChange={e => setFormData({ ...formData, frequency: e.target.value as Frequency })}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Quincenal">Quincenal (Cada 15 días)</option>
                <option value="Semanal">Semanal</option>
                <option value="3 veces/semana (continuo)">3 veces/semana (continuo)</option>
                <option value="Por Definir">Por Definir</option>
              </select>
            </div>
          </div>

          {/* Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hora Inicio *
              </label>
              <input
                type="text"
                value={formData.startTime || ''}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 07:00 AM o 2:30 PM"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hora Fin *
              </label>
              <input
                type="text"
                value={formData.endTime || ''}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 10:00 AM o 5:30 PM"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Duración (Horas)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="8"
                value={formData.durationHours || 3}
                onChange={e => setFormData({ ...formData, durationHours: parseFloat(e.target.value) || 3 })}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Days of Week Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Día(s) de la Semana
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DAYS.map(day => {
                const isSelected = formData.daysOfWeek?.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Infrastructure Notes & Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Condiciones de Infraestructura
              </label>
              <input
                type="text"
                value={formData.infrastructureNotes || ''}
                onChange={e => setFormData({ ...formData, infrastructureNotes: e.target.value })}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Container sin energía, paneles solares, pantalla..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Observaciones Logísticas
              </label>
              <input
                type="text"
                value={formData.observations || ''}
                onChange={e => setFormData({ ...formData, observations: e.target.value })}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Llegada puntual, material 100% impreso..."
              />
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Sesión en Cronograma</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
