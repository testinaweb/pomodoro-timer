import { Settings, Language, ColorTheme } from '@/types/pomodoro';
import { t } from '@/i18n/translations';
import { X } from 'lucide-react';

interface SettingsPanelProps {
  settings: Settings;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (partial: Partial<Settings>) => void;
}

const LANGUAGES: { code: Language; key: 'english' | 'italian' | 'spanish' | 'hebrew' }[] = [
  { code: 'en', key: 'english' },
  { code: 'it', key: 'italian' },
  { code: 'es', key: 'spanish' },
  { code: 'he', key: 'hebrew' },
];

const COLOR_THEMES: { code: ColorTheme; key: 'lavender_dream' | 'ocean_breeze' | 'sunset_glow'; colors: [string, string] }[] = [
  { code: 'lavender', key: 'lavender_dream', colors: ['#B795E4', '#95DFF2'] },
  { code: 'ocean', key: 'ocean_breeze', colors: ['#7EC8E3', '#A8E6CF'] },
  { code: 'sunset', key: 'sunset_glow', colors: ['#F5A7B8', '#FFDDA1'] },
];

export function SettingsPanel({ settings, isOpen, onClose, onUpdate }: SettingsPanelProps) {
  const lang = settings.language;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg glass-strong rounded-t-3xl p-6 pb-10 animate-slide-up max-h-[80vh] overflow-y-auto">
        <div className="w-10 h-1 bg-[#444] rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#444]">{t('settings', lang)}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#444] hover:text-[#666] hover:bg-[#444]/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Pomodoro Duration */}
          <div className="flex flex-col gap-2">
            <label className="text-base text-[#444] font-medium">{t('pomodoro_duration', lang)}</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={settings.pomodoroDuration}
                onChange={e => onUpdate({ pomodoroDuration: Number(e.target.value) })}
                className="flex-1 h-1.5"
                style={{ accentColor: '#444' }}
              />
              <span className="text-base font-medium text-[#444] w-20 text-right">
                {settings.pomodoroDuration} {t('minutes', lang)}
              </span>
            </div>
          </div>

          {/* Break Duration */}
          <div className="flex flex-col gap-2">
            <label className="text-base text-[#444] font-medium">{t('break_duration', lang)}</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={settings.breakDuration}
                onChange={e => onUpdate({ breakDuration: Number(e.target.value) })}
                className="flex-1 h-1.5"
                style={{ accentColor: '#444' }}
              />
              <span className="text-base font-medium text-[#444] w-20 text-right">
                {settings.breakDuration} {t('minutes', lang)}
              </span>
            </div>
          </div>

          {/* Auto-start breaks */}
          <div className="flex items-center justify-between">
            <label className="text-base text-[#444] font-medium">{t('auto_start_breaks', lang)}</label>
            <button
              onClick={() => onUpdate({ autoStartBreaks: !settings.autoStartBreaks })}
              className={`w-14 h-8 rounded-full transition-all relative ${
                settings.autoStartBreaks ? 'bg-[#444]/40' : 'bg-[#444]/15'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-[#444] shadow transition-all ${
                  settings.autoStartBreaks ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Language */}
          <div className="flex flex-col gap-2">
            <label className="text-base text-[#444] font-medium">{t('language', lang)}</label>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map(({ code, key }) => (
                <button
                  key={code}
                  onClick={() => onUpdate({ language: code })}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    settings.language === code
                      ? 'glass-strong text-[#444] scale-105'
                      : 'text-[#444]/70 hover:text-[#444] hover:bg-[#444]/5'
                  }`}
                >
                  {t(key, lang)}
                </button>
              ))}
          </div>

          {/* Color Theme */}
          <div className="flex flex-col gap-2">
            <label className="text-base text-[#444] font-medium">{t('color_theme', lang)}</label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_THEMES.map(({ code, key, colors }) => (
                <button
                  key={code}
                  onClick={() => onUpdate({ colorTheme: code })}
                  className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                    settings.colorTheme === code
                      ? 'glass-strong text-[#444] scale-105'
                      : 'text-[#444]/70 hover:text-[#444] hover:bg-[#444]/5'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full border-2 border-[#444]/20"
                    style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
                  />
                  <span className="text-xs leading-tight text-center">{t(key, lang)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
