import React from 'react';
import { X, Calendar, User, Sparkles } from 'lucide-react';
import { SessionData } from '../types';
import { LANGUAGES } from '../constants';

interface SessionHistoryModalProps {
  session: SessionData | null;
  onClose: () => void;
}

const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({ session, onClose }) => {
  if (!session) return null;

  const langInfo = LANGUAGES.find(l => l.value === session.language);
  const date = new Date(session.timestamp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{langInfo?.label.split(' ')[0]}</span>
              <h2 className="text-xl font-bold text-gray-900">{session.language} Session</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {date.toLocaleDateString()} at {date.toLocaleTimeString()}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Transcript Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8F9FA]">
          {session.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-[#00B84A] text-white' : 'bg-blue-600 text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-[#00B84A] text-white rounded-2xl rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-100 text-center text-xs text-gray-400">
            {session.messages.length} messages in this session
        </div>

      </div>
    </div>
  );
};

export default SessionHistoryModal;