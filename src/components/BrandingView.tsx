import React, { useRef } from 'react';
import { BrandingSettings } from '../types/schedule';
import { LogoBadge } from './LogoBadge';
import { Upload, RotateCcw, Check, Sparkles, Building2, UserCheck } from 'lucide-react';

interface BrandingViewProps {
  branding: BrandingSettings;
  onUpdateBranding: (updated: BrandingSettings) => void;
  onResetBranding: () => void;
}

export const BrandingView: React.FC<BrandingViewProps> = ({
  branding,
  onUpdateBranding,
  onResetBranding
}) => {
  const logo1InputRef = useRef<HTMLInputElement>(null);
  const logo2InputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo1' | 'logo2') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (target === 'logo1') {
        onUpdateBranding({ ...branding, logo1Url: result });
      } else {
        onUpdateBranding({ ...branding, logo2Url: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearLogo = (target: 'logo1' | 'logo2') => {
    if (target === 'logo1') {
      onUpdateBranding({ ...branding, logo1Url: '' });
    } else {
      onUpdateBranding({ ...branding, logo2Url: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Introduction Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Personalización de Logos y Membrete Oficial
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Configura los logos <strong>logo_1</strong> (Programa / Aliado) y <strong>logo_2</strong> (The Biz Nation) que aparecerán en la barra de navegación, reportes impresos y exportaciones PDF.
            </p>
          </div>
        </div>
      </div>

      {/* Live Header Preview */}
      <div className="bg-slate-900 text-white p-5 rounded-xl shadow-md">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-2">
          Vista Previa del Membrete
        </span>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-800/80 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3">
            <LogoBadge type="logo1" customUrl={branding.logo1Url} size="lg" />
            <LogoBadge type="logo2" customUrl={branding.logo2Url} size="lg" />
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                {branding.organizationName}
              </span>
              <h3 className="text-base font-extrabold tracking-tight">{branding.programTitle}</h3>
              <p className="text-xs text-slate-300">{branding.programSubtitle}</p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400">
            <div>Coordinador: <strong className="text-white">{branding.coordinatorName}</strong></div>
            <div>Ing. de Sistemas: <strong className="text-white">{branding.engineerName}</strong></div>
          </div>
        </div>
      </div>

      {/* Logos Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LOGO 1: Programa / Aliado */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Logo 1 (Programa / Aliado)</span>
            </h3>
            <span className="text-[10px] text-slate-400">Vocación que Transforma</span>
          </div>

          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <LogoBadge type="logo1" customUrl={branding.logo1Url} size="lg" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-slate-800">
                {branding.logo1Url ? 'Logo personalizado cargado' : 'Emblema vectorial oficial activo'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                PNG, JPG o SVG (máx. 2MB). Se guarda localmente.
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="file"
              ref={logo1InputRef}
              accept="image/*"
              className="hidden"
              onChange={e => handleFileUpload(e, 'logo1')}
            />
            <button
              id="btn-upload-logo-1"
              type="button"
              onClick={() => logo1InputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Archivo Logo 1</span>
            </button>
            {branding.logo1Url && (
              <button
                type="button"
                onClick={() => handleClearLogo('logo1')}
                className="py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Restablecer
              </button>
            )}
          </div>
        </div>

        {/* LOGO 2: The Biz Nation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Logo 2 (The Biz Nation)</span>
            </h3>
            <span className="text-[10px] text-slate-400">Operador Educativo</span>
          </div>

          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <LogoBadge type="logo2" customUrl={branding.logo2Url} size="lg" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-slate-800">
                {branding.logo2Url ? 'Logo personalizado cargado' : 'Emblema The Biz Nation activo'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                PNG, JPG o SVG (máx. 2MB). Se guarda localmente.
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="file"
              ref={logo2InputRef}
              accept="image/*"
              className="hidden"
              onChange={e => handleFileUpload(e, 'logo2')}
            />
            <button
              id="btn-upload-logo-2"
              type="button"
              onClick={() => logo2InputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Archivo Logo 2</span>
            </button>
            {branding.logo2Url && (
              <button
                type="button"
                onClick={() => handleClearLogo('logo2')}
                className="py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Restablecer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Organization and Coordinator Details Form */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Datos Institucionales y Responsables
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Nombre de la Organización</label>
            <input
              type="text"
              value={branding.organizationName}
              onChange={e => onUpdateBranding({ ...branding, organizationName: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Título del Programa</label>
            <input
              type="text"
              value={branding.programTitle}
              onChange={e => onUpdateBranding({ ...branding, programTitle: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Subtítulo del Cronograma</label>
            <input
              type="text"
              value={branding.programSubtitle}
              onChange={e => onUpdateBranding({ ...branding, programSubtitle: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Nombre del Coordinador</label>
            <input
              type="text"
              value={branding.coordinatorName}
              onChange={e => onUpdateBranding({ ...branding, coordinatorName: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Cargo del Coordinador</label>
            <input
              type="text"
              value={branding.coordinatorRole}
              onChange={e => onUpdateBranding({ ...branding, coordinatorRole: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Ingeniero de Sistemas</label>
            <input
              type="text"
              value={branding.engineerName}
              onChange={e => onUpdateBranding({ ...branding, engineerName: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Cargo Técnico</label>
            <input
              type="text"
              value={branding.engineerRole}
              onChange={e => onUpdateBranding({ ...branding, engineerRole: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Device Sync & Share Section */}
        <div className="pt-4 border-t border-slate-200 mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              📲 Sincronizar con Otros Dispositivos (Celular / WhatsApp / Andrés)
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Cada navegador y celular almacena su información localmente. Para transferir tus logos cargados y nombres modificados a otro teléfono o compartirlo con el Coordinador <strong>{branding.coordinatorName}</strong>, utiliza cualquiera de estas dos opciones:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                try {
                  const payload = { branding };
                  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
                  const shareUrl = `${window.location.origin}${window.location.pathname}#config=${encoded}`;
                  navigator.clipboard.writeText(shareUrl);
                  alert('¡Enlace de sincronización copiado al portapapeles!\n\nEnvía este enlace por WhatsApp al otro dispositivo o al celular de Andrés. Al abrirlo, cargará automáticamente tus logos y nombres.');
                } catch (e) {
                  alert('Por favor copia la configuración mediante archivo JSON.');
                }
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-xs"
            >
              <span>🔗 Copiar Enlace con Mis Logos y Membrete</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const data = {
                  version: '1.0',
                  exportDate: new Date().toISOString(),
                  branding
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `CONFIGURACION_MEMBRETE_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
            >
              <span>📥 Descargar Archivo (.json)</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer">
              <span>📤 Cargar Archivo (.json)</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => {
                    try {
                      const parsed = JSON.parse(ev.target?.result as string);
                      if (parsed.branding) {
                        onUpdateBranding(parsed.branding);
                        alert('¡Membrete y logos cargados con éxito!');
                      } else {
                        alert('El archivo no contiene información de membrete válida.');
                      }
                    } catch (err) {
                      alert('Error al leer el archivo de respaldo.');
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </label>
          </div>
        </div>

        {/* Reset button */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onResetBranding}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Membrete Predeterminado</span>
          </button>
        </div>
      </div>
    </div>
  );
};
