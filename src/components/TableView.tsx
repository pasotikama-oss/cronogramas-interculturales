import React, { useState, useMemo } from 'react';
import { 
  TrainingSession, 
  Municipality, 
  TargetAudience, 
  Modality, 
  ScheduleStatus 
} from '../types/schedule';
import { 
  Search, 
  Filter, 
  Edit3, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  MapPin,
  Calendar,
  Layers,
  ArrowUpDown,
  FileCode
} from 'lucide-react';

interface TableViewProps {
  sessions: TrainingSession[];
  onEditSession: (session: TrainingSession) => void;
  onDuplicateSession: (session: TrainingSession) => void;
  onDeleteSession: (id: string) => void;
  onOpenQuickAssign: (institutionName?: string) => void;
  onOpenNewSession: () => void;
  onExportHTML?: () => void;
}

export const TableView: React.FC<TableViewProps> = ({
  sessions,
  onEditSession,
  onDuplicateSession,
  onDeleteSession,
  onOpenQuickAssign,
  onOpenNewSession,
  onExportHTML
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'itemNumber' | 'municipality' | 'institution' | 'status'>('itemNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filtered and sorted sessions
  const filteredSessions = useMemo(() => {
    return sessions
      .filter(s => {
        const matchesSearch =
          s.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (s.campus || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.trainingType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.observations.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.daysOfWeek.join(' ').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesMunicipality =
          selectedMunicipality === 'all' || s.municipality === selectedMunicipality;

        const matchesAudience =
          selectedAudience === 'all' || s.targetAudience === selectedAudience;

        const matchesModality =
          selectedModality === 'all' || s.modality === selectedModality;

        const matchesStatus =
          selectedStatus === 'all' || s.status === selectedStatus;

        return (
          matchesSearch &&
          matchesMunicipality &&
          matchesAudience &&
          matchesModality &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        let valA: string | number = a[sortBy] ?? '';
        let valB: string | number = b[sortBy] ?? '';

        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? valA.localeCompare(valB as string)
            : (valB as string).localeCompare(valA);
        }
        return sortOrder === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      });
  }, [sessions, searchTerm, selectedMunicipality, selectedAudience, selectedModality, selectedStatus, sortBy, sortOrder]);

  // Key stats
  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const approved = sessions.filter(s => s.status === 'APROBADO').length;
    const pending = sessions.filter(s => s.status === 'PDTE').length;
    const totalHours = sessions.reduce((acc, curr) => acc + (curr.durationHours || 0), 0);
    const uribiaCount = sessions.filter(s => s.municipality === 'Uribia').length;
    const riohachaCount = sessions.filter(s => s.municipality === 'Riohacha').length;
    const manaureCount = sessions.filter(s => s.municipality === 'Manaure').length;

    return { totalSessions, approved, pending, totalHours, uribiaCount, riohachaCount, manaureCount };
  }, [sessions]);

  // Check if Jaipa and Yotojoroin have pending entries
  const pendingUribia = sessions.filter(s => s.municipality === 'Uribia' && s.status === 'PDTE');

  const handleSort = (field: 'itemNumber' | 'municipality' | 'institution' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Notice Banner: Pending spaces for Uribia (Jaipa & Yotojoroin) */}
      {pendingUribia.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3.5 sm:p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  Espacios Reservados para Coordinación Uribia (Jaipa y Yotojoroin)
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  Hay {pendingUribia.length} sesiones en estado <strong>PDTE</strong> guardadas con su espacio listo para acomodar en cuanto se concreten las llamadas del fin de semana.
                </p>
              </div>
            </div>
            <button
              id="btn-quick-assign-pending"
              onClick={() => onOpenQuickAssign()}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Asignar Días Pendientes</span>
            </button>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Sesiones</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{stats.totalSessions}</div>
          <span className="text-[10px] text-slate-400">En cronograma general</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-emerald-100 bg-emerald-50/20 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">Aprobadas</span>
          <div className="text-xl font-extrabold text-emerald-700 mt-1 flex items-center gap-1">
            {stats.approved}
            <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
          </div>
          <span className="text-[10px] text-emerald-600">Listas para ejecución</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-amber-200 bg-amber-50/30 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide">Por Definir (PDTE)</span>
          <div className="text-xl font-extrabold text-amber-700 mt-1 flex items-center gap-1">
            {stats.pending}
            <Clock className="w-4 h-4 text-amber-500 inline" />
          </div>
          <span className="text-[10px] text-amber-700">Espacios listos</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-blue-100 bg-blue-50/20 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wide">Uribia (7 Sedes)</span>
          <div className="text-xl font-extrabold text-blue-900 mt-1">{stats.uribiaCount} <span className="text-xs font-normal text-slate-500">sesiones</span></div>
          <span className="text-[10px] text-blue-600">Regla máx 2/día</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-indigo-100 bg-indigo-50/20 shadow-xs">
          <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wide">Riohacha (4 Sedes)</span>
          <div className="text-xl font-extrabold text-indigo-900 mt-1">{stats.riohachaCount} <span className="text-xs font-normal text-slate-500">sesiones</span></div>
          <span className="text-[10px] text-indigo-600">Sabatina y vespertina</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-teal-100 bg-teal-50/20 shadow-xs">
          <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wide">Manaure (El Pájaro)</span>
          <div className="text-xl font-extrabold text-teal-900 mt-1">{stats.manaureCount} <span className="text-xs font-normal text-slate-500">sesiones</span></div>
          <span className="text-[10px] text-teal-600">Costa y rural</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-search-sessions"
              type="text"
              placeholder="Buscar por institución, grado, día, tema, o condiciones..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
              Mostrando <strong>{filteredSessions.length}</strong> de {sessions.length} registros
            </div>
            {onExportHTML && (
              <button
                id="btn-table-export-html"
                onClick={onExportHTML}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                title="Descargar el cronograma en un archivo HTML independiente para abrir en cualquier celular o PC"
              >
                <FileCode className="w-3.5 h-3.5 text-blue-600" />
                <span>Descargar en HTML</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Municipio / Zona
            </label>
            <select
              id="select-filter-municipality"
              value={selectedMunicipality}
              onChange={e => setSelectedMunicipality(e.target.value)}
              className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Todos los Municipios</option>
              <option value="Uribia">Uribia (7 Instituciones)</option>
              <option value="Riohacha">Riohacha (4 Instituciones)</option>
              <option value="Manaure">Manaure (El Pájaro)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Audiencia
            </label>
            <select
              id="select-filter-audience"
              value={selectedAudience}
              onChange={e => setSelectedAudience(e.target.value)}
              className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Todas las Audiencias</option>
              <option value="Estudiantes">Estudiantes (9°, 10°, 11°, Ciclos)</option>
              <option value="Docentes">Docentes</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Modalidad
            </label>
            <select
              id="select-filter-modality"
              value={selectedModality}
              onChange={e => setSelectedModality(e.target.value)}
              className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Todas las Modalidades</option>
              <option value="Presencial">Presencial (En sede o casco)</option>
              <option value="Virtual">Virtual (Sincrónica)</option>
              <option value="Microlearning">Microlearning (Cápsulas autónomas)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Estado / Fase
            </label>
            <select
              id="select-filter-status"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Todos los Estados</option>
              <option value="APROBADO">APROBADO</option>
              <option value="PDTE">PDTE (Pendiente)</option>
              <option value="EN_REVISION">En Revisión</option>
            </select>
          </div>
        </div>
      </div>

      {/* Master Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider select-none">
              <tr>
                <th
                  onClick={() => handleSort('itemNumber')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-800 w-12 text-center"
                >
                  <span className="flex items-center justify-center gap-1">
                    No.
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('municipality')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-800 w-28"
                >
                  <span className="flex items-center gap-1">
                    Zona / Municipio
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('institution')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-800 min-w-[180px]"
                >
                  <span className="flex items-center gap-1">
                    Institución / Sede
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th className="py-3 px-3 min-w-[120px]">Jornada & Audiencia</th>
                <th className="py-3 px-3 min-w-[150px]">Formación & Modalidad</th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-800 text-center w-24"
                >
                  <span className="flex items-center justify-center gap-1">
                    Estado
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th className="py-3 px-3 min-w-[130px]">Día(s) Programado(s)</th>
                <th className="py-3 px-3 min-w-[110px]">Horario (Duración)</th>
                <th className="py-3 px-3 min-w-[90px]">Frecuencia</th>
                <th className="py-3 px-3 min-w-[200px]">Observaciones & Condiciones</th>
                <th className="py-3 px-3 text-center w-28 print:hidden">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold">No se encontraron sesiones con estos filtros</p>
                    <p className="text-xs text-slate-400 mt-1">Prueba limpiando la búsqueda o cambiando los filtros seleccionados</p>
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session, idx) => {
                  const isPending = session.status === 'PDTE';
                  const isUribia = session.municipality === 'Uribia';
                  const isPresencial = session.modality === 'Presencial';

                  return (
                    <tr
                      key={session.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isPending ? 'bg-amber-50/30' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                      }`}
                    >
                      {/* Item number */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-600">
                        {session.itemNumber || idx + 1}
                      </td>

                      {/* Municipality */}
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                            session.municipality === 'Uribia'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : session.municipality === 'Riohacha'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                              : 'bg-teal-50 text-teal-800 border-teal-200'
                          }`}
                        >
                          <MapPin className="w-2.5 h-2.5 shrink-0" />
                          {session.municipality}
                        </span>
                      </td>

                      {/* Institution & Campus */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 leading-tight">
                          {session.institution}
                        </div>
                        {session.campus && session.campus !== session.institution && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <span className="font-medium text-slate-400">Sede:</span> {session.campus}
                          </div>
                        )}
                        {session.infrastructureNotes && (
                          <div className="text-[10px] text-amber-700 bg-amber-50/80 px-1.5 py-0.5 rounded border border-amber-200/60 mt-1 inline-block">
                            ⚡ {session.infrastructureNotes}
                          </div>
                        )}
                      </td>

                      {/* Academic shift & Audience */}
                      <td className="py-2.5 px-3">
                        <div className="text-slate-800 text-xs font-medium">
                          {session.academicShift}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            session.targetAudience === 'Docentes'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {session.targetAudience}
                          </span>
                          {session.gradeOrCycle && (
                            <span className="text-[10px] text-slate-500 font-normal">
                              ({session.gradeOrCycle})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Training type & Modality */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-800">
                          {session.trainingType}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                              session.modality === 'Presencial'
                                ? 'bg-orange-50 text-orange-800 border-orange-200'
                                : session.modality === 'Virtual'
                                ? 'bg-sky-50 text-sky-800 border-sky-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {session.modality}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {session.responsible}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs ${
                            session.status === 'APROBADO'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : session.status === 'PDTE'
                              ? 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse'
                              : session.status === 'COMPLETADO'
                              ? 'bg-slate-100 text-slate-800 border-slate-300'
                              : 'bg-blue-100 text-blue-800 border-blue-300'
                          }`}
                        >
                          {session.status === 'APROBADO' && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                          {session.status === 'PDTE' && <Clock className="w-3 h-3 text-amber-700" />}
                          {session.status}
                        </span>
                      </td>

                      {/* Days of week & Scheduled dates */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 flex flex-wrap gap-1">
                          {session.daysOfWeek.map(d => (
                            <span
                              key={d}
                              className={`px-1.5 py-0.5 text-[10px] rounded font-semibold ${
                                isPending
                                  ? 'bg-slate-200 text-slate-700'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                        {/* Dates info */}
                        {session.datesScheduled && (session.datesScheduled.september || session.datesScheduled.october) && (
                          <div className="text-[10px] text-slate-500 mt-1 leading-tight line-clamp-2" title="Fechas quincenales exactas">
                            {session.datesScheduled.september && session.datesScheduled.september.length > 0 && (
                              <span>Sep: {session.datesScheduled.september.slice(0, 2).join(', ')}...</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Hours and Duration */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">
                          {session.startTime} - {session.endTime}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {session.durationHours} hrs por sesión
                        </div>
                      </td>

                      {/* Frequency */}
                      <td className="py-2.5 px-3">
                        <span className="text-xs text-slate-700 font-medium">
                          {session.frequency}
                        </span>
                      </td>

                      {/* Observations & Infrastructure */}
                      <td className="py-2.5 px-3 text-slate-600 text-[11px] leading-relaxed">
                        <p>{session.observations}</p>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            id={`btn-edit-${session.id}`}
                            onClick={() => onEditSession(session)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition"
                            title="Modificar sesión"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`btn-duplicate-${session.id}`}
                            onClick={() => onDuplicateSession(session)}
                            className="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition"
                            title="Duplicar sesión"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`btn-delete-${session.id}`}
                            onClick={() => onDeleteSession(session.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition"
                            title="Suprimir sesión"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
