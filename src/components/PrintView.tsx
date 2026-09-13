import React, { useState } from 'react';
import { TrainingSession, BrandingSettings, Municipality } from '../types/schedule';
import { LogoBadge } from './LogoBadge';
import { Printer, ArrowLeft, Download, CheckCircle2, Clock, MapPin, FileCode } from 'lucide-react';

interface PrintViewProps {
  sessions: TrainingSession[];
  branding: BrandingSettings;
  onBack: () => void;
  onExportHTML?: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({ sessions, branding, onBack, onExportHTML }) => {
  const [filterMun, setFilterMun] = useState<string>('all');
  const [onlyApproved, setOnlyApproved] = useState<boolean>(false);

  const filteredSessions = sessions.filter(s => {
    const matchesMun = filterMun === 'all' || s.municipality === filterMun;
    const matchesApproved = !onlyApproved || s.status === 'APROBADO';
    return matchesMun && matchesApproved;
  });

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-4">
      {/* Control Bar (Hidden on actual Print) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Matriz</span>
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Vista de Impresión y Reporte Oficial PDF</h2>
            <p className="text-xs text-slate-500">Diseñado en formato horizontal (Landscape) de alta legibilidad para el coordinador y directivos</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Municipality filter for print */}
          <select
            value={filterMun}
            onChange={e => setFilterMun(e.target.value)}
            className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
          >
            <option value="all">Todas las Zonas (12 Sedes)</option>
            <option value="Uribia">Solo Uribia</option>
            <option value="Riohacha">Solo Riohacha</option>
            <option value="Manaure">Solo Manaure</option>
          </select>

          <label className="flex items-center gap-1.5 text-xs text-slate-700 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={onlyApproved}
              onChange={e => setOnlyApproved(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>Solo Aprobados</span>
          </label>

          {onExportHTML && (
            <button
              id="btn-printview-export-html"
              onClick={onExportHTML}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-sm transition active:scale-95"
              title="Descargar archivo HTML independiente para abrir en cualquier navegador o compartir"
            >
              <FileCode className="w-4 h-4 text-blue-600" />
              <span>Descargar en HTML</span>
            </button>
          )}

          <button
            id="btn-trigger-print"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar en PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (Standard A4 / Letter Landscape styling) */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0">
        {/* Printable Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo 1 */}
            <div className="w-20 shrink-0">
              <LogoBadge type="logo1" customUrl={branding.logo1Url} size="lg" />
            </div>

            {/* Title Block */}
            <div className="text-center flex-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {branding.organizationName}
              </span>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-950 uppercase tracking-tight">
                {branding.programTitle}
              </h1>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                {branding.programSubtitle}
              </p>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-center gap-4">
                <span><strong>Zona:</strong> {filterMun === 'all' ? 'Uribia, Riohacha y Manaure' : filterMun}</span>
                <span>•</span>
                <span><strong>Fecha de Emisión:</strong> {currentDate}</span>
                <span>•</span>
                <span><strong>Coordinador:</strong> {branding.coordinatorName}</span>
              </div>
            </div>

            {/* Logo 2 */}
            <div className="w-20 shrink-0 flex justify-end">
              <LogoBadge type="logo2" customUrl={branding.logo2Url} size="lg" />
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
              <th className="p-1.5 border-r border-slate-300 text-center w-8">#</th>
              <th className="p-1.5 border-r border-slate-300 w-20">Municipio</th>
              <th className="p-1.5 border-r border-slate-300 min-w-[140px]">Institución / Sede</th>
              <th className="p-1.5 border-r border-slate-300 w-24">Jornada</th>
              <th className="p-1.5 border-r border-slate-300 w-28">Audiencia / Tipo</th>
              <th className="p-1.5 border-r border-slate-300 w-20 text-center">Modalidad</th>
              <th className="p-1.5 border-r border-slate-300 w-16 text-center">Estado</th>
              <th className="p-1.5 border-r border-slate-300 w-24">Día(s)</th>
              <th className="p-1.5 border-r border-slate-300 w-24">Horario</th>
              <th className="p-1.5 border-r border-slate-300 w-16">Frecuencia</th>
              <th className="p-1.5 min-w-[160px]">Observaciones & Logística</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredSessions.map((session, idx) => (
              <tr key={session.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                <td className="p-1.5 border-r border-slate-200 text-center font-bold text-slate-600">
                  {idx + 1}
                </td>
                <td className="p-1.5 border-r border-slate-200 font-semibold">
                  {session.municipality}
                </td>
                <td className="p-1.5 border-r border-slate-200">
                  <div className="font-bold text-slate-900 leading-tight">{session.institution}</div>
                  {session.campus && session.campus !== session.institution && (
                    <div className="text-[10px] text-slate-500">Sede: {session.campus}</div>
                  )}
                </td>
                <td className="p-1.5 border-r border-slate-200 text-slate-700">
                  {session.academicShift}
                </td>
                <td className="p-1.5 border-r border-slate-200">
                  <div className="font-semibold text-slate-800">{session.targetAudience}</div>
                  <div className="text-[10px] text-slate-500">{session.trainingType}</div>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-center font-semibold">
                  {session.modality}
                </td>
                <td className="p-1.5 border-r border-slate-200 text-center">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                    session.status === 'APROBADO'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {session.status}
                  </span>
                </td>
                <td className="p-1.5 border-r border-slate-200 font-medium">
                  {session.daysOfWeek.join(', ')}
                </td>
                <td className="p-1.5 border-r border-slate-200 font-semibold">
                  {session.startTime} - {session.endTime}
                  <div className="text-[9px] text-slate-500 font-normal">({session.durationHours}h)</div>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-slate-700">
                  {session.frequency}
                </td>
                <td className="p-1.5 text-slate-600 text-[10px] leading-tight">
                  <p>{session.observations}</p>
                  {session.infrastructureNotes && (
                    <p className="text-amber-800 font-medium mt-0.5">Nota: {session.infrastructureNotes}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Special Notes & Infrastructure Reminder for Fieldwork */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-600 space-y-1">
          <div className="font-bold text-slate-800 text-[11px]">Notas Operativas de Terreno:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <strong>• Uribia (Tope de Simultaneidad):</strong> Máximo 2 instituciones por día para formaciones presenciales. Alternancia quincenal rigurosa.
            </div>
            <div>
              <strong>• Guarerapu #3:</strong> Container sin fluido eléctrico; llevar baterías cargadas. Pausa cultural 13 al 26 de octubre.
            </div>
            <div>
              <strong>• Denzil Sabatinos:</strong> Jornada de fines de semana para Ciclos 4 y 6 en condición de vulnerabilidad; garantizar material impreso.
            </div>
            <div>
              <strong>• Chonkay:</strong> Intervención articulada a los periodos académicos de Ética y Competencias Ciudadanas.
            </div>
          </div>
        </div>

        {/* Formal Signature Blocks for Coordinator and Facilitator */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-12">
          <div className="text-center">
            <div className="w-56 mx-auto border-b border-slate-800 mb-2"></div>
            <div className="font-bold text-xs text-slate-900">{branding.coordinatorName}</div>
            <div className="text-[10px] text-slate-500">{branding.coordinatorRole}</div>
            <div className="text-[10px] text-slate-400">{branding.organizationName}</div>
          </div>

          <div className="text-center">
            <div className="w-56 mx-auto border-b border-slate-800 mb-2"></div>
            <div className="font-bold text-xs text-slate-900">Facilitador / Orientador de Campo</div>
            <div className="text-[10px] text-slate-500">Equipo de Formación Territorial - Guajira</div>
            <div className="text-[10px] text-slate-400">Programa Vocación que Transforma</div>
          </div>
        </div>
      </div>
    </div>
  );
};
