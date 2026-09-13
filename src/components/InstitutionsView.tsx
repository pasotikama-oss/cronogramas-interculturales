import React, { useState } from 'react';
import { InstitutionProfile, Municipality } from '../types/schedule';
import { 
  Building2, 
  MapPin, 
  Zap, 
  ZapOff, 
  Wifi, 
  WifiOff, 
  Tv, 
  Monitor, 
  Users, 
  AlertTriangle, 
  Info, 
  Search,
  Sun
} from 'lucide-react';

interface InstitutionsViewProps {
  institutions: InstitutionProfile[];
  onSelectInstitution?: (institution: InstitutionProfile) => void;
}

export const InstitutionsView: React.FC<InstitutionsViewProps> = ({ institutions }) => {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = institutions.filter(inst => {
    const matchesMun = selectedMunicipality === 'all' || inst.municipality === selectedMunicipality;
    const matchesSearch =
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.infrastructure.generalConditions.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMun && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header and filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">Directorio de Sedes Educativas e Infraestructura</h2>
            <p className="text-xs text-slate-500">Condiciones de conectividad, equipamiento y particularidades de las 12 sedes</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar sede..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {['all', 'Uribia', 'Riohacha', 'Manaure'].map(mun => (
              <button
                key={mun}
                onClick={() => setSelectedMunicipality(mun)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  selectedMunicipality === mun
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mun === 'all' ? 'Todas (12)' : mun}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(inst => {
          const { infrastructure, specialAlerts } = inst;

          return (
            <div
              key={inst.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        inst.municipality === 'Uribia'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : inst.municipality === 'Riohacha'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                          : 'bg-teal-50 text-teal-800 border-teal-200'
                      }`}
                    >
                      <MapPin className="w-2.5 h-2.5" />
                      {inst.municipality}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                      {inst.name}
                    </h3>
                  </div>
                </div>

                {/* Shifts */}
                <div className="mt-2 text-[11px] text-slate-600 font-medium">
                  <span className="text-slate-400">Jornada: </span>
                  {inst.shifts.join(', ')}
                </div>

                {/* Tech & Infrastructure Badges */}
                <div className="grid grid-cols-2 gap-1.5 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                  {/* Power */}
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
                      infrastructure.hasPower
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-red-50 text-red-800 font-bold'
                    }`}
                  >
                    {infrastructure.hasPower ? (
                      infrastructure.hasSolarPanels ? (
                        <>
                          <Sun className="w-3.5 h-3.5 text-amber-600" />
                          <span>Paneles Solares</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Energía Red</span>
                        </>
                      )
                    ) : (
                      <>
                        <ZapOff className="w-3.5 h-3.5 text-red-600" />
                        <span>Sin Energía (Cargar)</span>
                      </>
                    )}
                  </div>

                  {/* Internet */}
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
                      infrastructure.hasInternet
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {infrastructure.hasInternet ? (
                      <>
                        <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Internet OK</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sin Internet / Baja</span>
                      </>
                    )}
                  </div>

                  {/* Screen / Projector */}
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
                      infrastructure.hasScreensOrProjectors
                        ? 'bg-blue-50 text-blue-800'
                        : 'bg-amber-50 text-amber-800 font-medium'
                    }`}
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>{infrastructure.hasScreensOrProjectors ? 'Pantalla/TV' : 'Sin Pantalla'}</span>
                  </div>

                  {/* Computers */}
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
                      infrastructure.hasComputersOrTablets
                        ? 'bg-indigo-50 text-indigo-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>{infrastructure.hasComputersOrTablets ? 'Sala Digital' : 'Sin Equipos'}</span>
                  </div>
                </div>

                {/* Capacity & Notes */}
                <div className="mt-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="font-semibold text-slate-700 text-[11px] mb-0.5">
                    Capacidad: <span className="font-normal text-slate-600">{infrastructure.capacity}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{infrastructure.generalConditions}</p>
                </div>
              </div>

              {/* Special alerts / events */}
              {specialAlerts.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                  {specialAlerts.map((alert, aIdx) => (
                    <div
                      key={aIdx}
                      className={`p-2 rounded-lg text-xs flex items-start gap-2 ${
                        alert.level === 'critical'
                          ? 'bg-red-50 text-red-900 border border-red-200'
                          : alert.level === 'warning'
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : 'bg-blue-50 text-blue-900 border border-blue-200'
                      }`}
                    >
                      {alert.level === 'critical' ? (
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      ) : alert.level === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-[11px]">{alert.title}</div>
                        <div className="text-[10px] opacity-90 mt-0.5">{alert.description}</div>
                        <div className="text-[10px] font-semibold mt-1">🗓️ {alert.dates}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
