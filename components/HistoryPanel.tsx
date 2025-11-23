import React from 'react';
import { Trash2, MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import { SessionData } from '../types';
import { LANGUAGES } from '../constants';

interface HistoryPanelProps {
  history: SessionData[];
  onSelectSession: (session: SessionData) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectSession, onDeleteSession }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-white rounded-xl border border-dashed border-gray-200">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
          <MessageSquare className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-gray-900 font-medium">No history yet</p>
        <p className="text-gray-500 text-sm mt-1">Complete a conversation to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((session) => {
        const langInfo = LANGUAGES.find(l => l.value === session.language);
        const date = new Date(session.timestamp);
        
        return (
          <div 
            key={session.id}
            onClick={() => onSelectSession(session)}
            className="group relative bg-white p-4 rounded-xl border border-gray-200 hover:border-[#00B84A] hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{langInfo?.label.split(' ')[0]}</span>
                <span className="font-semibold text-gray-900">{session.language}</span>
              </div>
              <button
                onClick={(e) => onDeleteSession(session.id, e)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Delete session"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {date.toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {session.messages.length} messages
              </div>
            </div>

            <ChevronRight className="absolute right-4 bottom-4 w-4 h-4 text-gray-300 group-hover:text-[#00B84A] transition-colors" />
          </div>
        );
      })}
    </div>
  );
};

export default HistoryPanel;