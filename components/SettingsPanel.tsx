import React from 'react';
import { LANGUAGES, VOICES } from '../constants';
import { Language, VoiceName } from '../types';

interface SettingsPanelProps {
  currentLanguage: Language;
  currentVoice: VoiceName;
  onLanguageChange: (lang: Language) => void;
  onVoiceChange: (voice: VoiceName) => void;
  disabled: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  currentLanguage,
  currentVoice,
  onLanguageChange,
  onVoiceChange,
  disabled
}) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <h2 className="text-lg font-bold mb-4 text-[#0F172A]">Session Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-2">Target Language</label>
          <select 
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            disabled={disabled}
            className="w-full bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-4 py-2 text-[#1A1A1A] focus:ring-2 focus:ring-[#00B84A] focus:border-transparent disabled:opacity-50 outline-none transition-shadow"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-2">Partner Voice</label>
          <select 
            value={currentVoice}
            onChange={(e) => onVoiceChange(e.target.value as VoiceName)}
            disabled={disabled}
            className="w-full bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-4 py-2 text-[#1A1A1A] focus:ring-2 focus:ring-[#00B84A] focus:border-transparent disabled:opacity-50 outline-none transition-shadow"
          >
            {VOICES.map(voice => (
              <option key={voice.value} value={voice.value}>{voice.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;