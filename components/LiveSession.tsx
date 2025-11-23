import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, MessageSquare, Activity, AlertCircle, ArrowLeft, User, Sparkles, Settings2, X, Clock, Settings } from 'lucide-react';
import { useGeminiLive } from '../hooks/useGeminiLive';
import AudioVisualizer from './AudioVisualizer';
import SettingsPanel from './SettingsPanel';
import HistoryPanel from './HistoryPanel';
import SessionHistoryModal from './SessionHistoryModal';
import OnboardingTour from './OnboardingTour';
import { Language, VoiceName, LiveConfig, SessionData } from '../types';
import { LANGUAGES } from '../constants';

interface LiveSessionProps {
    onExit: () => void;
}

type SidebarTab = 'settings' | 'history';

const LiveSession: React.FC<LiveSessionProps> = ({ onExit }) => {
  const [config, setConfig] = useState<LiveConfig>({
    language: Language.ENGLISH,
    voice: VoiceName.KORE
  });
  const [showTour, setShowTour] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>('settings');
  const [history, setHistory] = useState<SessionData[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  
  const { 
    connect, 
    disconnect, 
    connectionState, 
    messages, 
    volume,
    isAiSpeaking
  } = useGeminiLive({ config });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('linguaLive_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Deserialize dates
        const fixed = parsed.map((s: any) => ({
          ...s,
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
        setHistory(fixed);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    const hasSeenTour = localStorage.getItem('linguaLive_hasSeenTour');
    if (!hasSeenTour) {
        setShowTour(true);
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const saveCurrentSession = () => {
    if (messages.length === 0) return;

    const newSession: SessionData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      language: config.language,
      messages: [...messages]
    };

    const newHistory = [newSession, ...history];
    setHistory(newHistory);
    localStorage.setItem('linguaLive_history', JSON.stringify(newHistory));
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = history.filter(s => s.id !== id);
    setHistory(newHistory);
    localStorage.setItem('linguaLive_history', JSON.stringify(newHistory));
  };

  const handleToggleConnection = () => {
    if (connectionState === 'connected' || connectionState === 'connecting') {
      disconnect();
      saveCurrentSession();
    } else {
      // If we are reconnecting after an error or disconnect, save previous context if any
      if (connectionState !== 'connected' && messages.length > 0) {
        saveCurrentSession();
      }
      connect();
    }
  };

  const handleExit = () => {
      if (messages.length > 0) {
        saveCurrentSession();
      }
      disconnect();
      onExit();
  };

  const handleTourComplete = () => {
      localStorage.setItem('linguaLive_hasSeenTour', 'true');
      setShowTour(false);
  };

  const currentLangLabel = LANGUAGES.find(l => l.value === config.language)?.label;

  const TabButton = ({ id, label, icon: Icon }: { id: SidebarTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
        activeTab === id 
        ? 'bg-white text-[#00B84A] shadow-sm' 
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="h-[100dvh] bg-[#FFFFFF] flex flex-col md:flex-row overflow-hidden relative font-sans">
      
      {showTour && (
          <OnboardingTour 
            onComplete={handleTourComplete} 
            onSkip={handleTourComplete} 
          />
      )}

      {selectedSession && (
        <SessionHistoryModal 
          session={selectedSession} 
          onClose={() => setSelectedSession(null)} 
        />
      )}

      {/* Mobile Header (Visible on small screens) */}
      <header className="md:hidden h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 z-30 shrink-0">
         <div className="flex items-center gap-3">
            <button 
                onClick={handleExit}
                className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-[#6B7280] transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#00B84A]" />
                <span className="font-bold text-[#0F172A]">LinguaLive</span>
            </div>
         </div>
         <button 
            onClick={() => setIsMobileSettingsOpen(true)}
            className="p-2 -mr-2 rounded-lg hover:bg-gray-100 text-[#6B7280] transition-colors"
         >
            <Settings2 className="w-5 h-5" />
         </button>
      </header>

      {/* Mobile Settings/History Drawer (Overlay) */}
      {isMobileSettingsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
                onClick={() => setIsMobileSettingsOpen(false)}
            />
            <div className="relative w-[85%] max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#0F172A]">Menu</h2>
                    <button onClick={() => setIsMobileSettingsOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="bg-gray-100 p-1 rounded-xl flex">
                  <TabButton id="settings" label="Settings" icon={Settings} />
                  <TabButton id="history" label="History" icon={Clock} />
                </div>

                <div className="flex-1 overflow-y-auto">
                  {activeTab === 'settings' ? (
                    <div className="space-y-6">
                      <SettingsPanel 
                        currentLanguage={config.language}
                        currentVoice={config.voice}
                        onLanguageChange={(lang) => setConfig(prev => ({ ...prev, language: lang }))}
                        onVoiceChange={(voice) => setConfig(prev => ({ ...prev, voice: voice }))}
                        disabled={connectionState !== 'disconnected' && connectionState !== 'error'}
                      />
                       <div className="p-4 rounded-lg bg-[#E8F9F0] border border-[#D4F4E2]">
                          <h3 className="text-[#009639] font-semibold mb-2 flex items-center gap-2 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          Tips
                          </h3>
                          <ul className="text-xs text-[#009639]/80 space-y-2 list-disc pl-4">
                          <li>Use headphones for clarity.</li>
                          <li>Speak clearly.</li>
                          </ul>
                      </div>
                    </div>
                  ) : (
                    <HistoryPanel 
                      history={history} 
                      onSelectSession={setSelectedSession}
                      onDeleteSession={deleteSession}
                    />
                  )}
                </div>
            </div>
        </div>
      )}

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex w-80 lg:w-96 bg-[#F8F9FA] border-r border-[#E5E7EB] p-6 flex-col gap-6 z-20 h-full">
        <div className="flex items-center gap-4 shrink-0">
            <button 
                onClick={handleExit}
                className="p-2 rounded-lg hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
                title="Back to Home"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-[#00B84A]">
                <Activity className="w-6 h-6" />
                <h1 className="text-xl font-bold text-[#0F172A]">
                    LinguaLive
                </h1>
            </div>
        </div>
        
        <div className="bg-gray-200/50 p-1 rounded-xl flex shrink-0">
          <TabButton id="settings" label="Settings" icon={Settings} />
          <TabButton id="history" label="History" icon={Clock} />
        </div>

        <div className="flex-1 overflow-y-auto -mr-2 pr-2">
          {activeTab === 'settings' ? (
            <div className="space-y-6">
              <p className="text-[#6B7280] text-sm">
                Select a language and voice, then start speaking to practice in real-time.
              </p>
              <SettingsPanel 
                currentLanguage={config.language}
                currentVoice={config.voice}
                onLanguageChange={(lang) => setConfig(prev => ({ ...prev, language: lang }))}
                onVoiceChange={(voice) => setConfig(prev => ({ ...prev, voice: voice }))}
                disabled={connectionState !== 'disconnected' && connectionState !== 'error'}
              />
               <div className="p-4 rounded-lg bg-[#E8F9F0] border border-[#D4F4E2]">
                  <h3 className="text-[#009639] font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Tips
                  </h3>
                  <ul className="text-xs text-[#009639]/80 space-y-2 list-disc pl-4">
                    <li>Use headphones for best audio quality.</li>
                    <li>Speak clearly into your microphone.</li>
                    <li>The AI will correct your mistakes gently.</li>
                  </ul>
               </div>
            </div>
          ) : (
            <HistoryPanel 
              history={history} 
              onSelectSession={setSelectedSession}
              onDeleteSession={deleteSession}
            />
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-white">
        
        {/* Status Header */}
        <header className="h-14 md:h-16 border-b border-[#E5E7EB] flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur shrink-0 z-10">
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-colors duration-500 ${
                    connectionState === 'connected' ? 'bg-[#00B84A] shadow-[0_0_8px_rgba(0,184,74,0.6)]' : 
                    connectionState === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
                    connectionState === 'error' ? 'bg-red-500' : 'bg-gray-300'
                }`} />
                <span className={`text-xs md:text-sm font-medium ${connectionState === 'error' ? 'text-red-600' : 'text-[#1A1A1A]'}`}>
                    {connectionState === 'connected' ? `Connected (${currentLangLabel})` : 
                     connectionState === 'connecting' ? 'Connecting...' : 
                     connectionState === 'error' ? 'Connection Failed' : 'Ready to Connect'}
                </span>
            </div>
            
            {connectionState === 'connected' && (
                <div className={`text-[10px] md:text-xs px-2 py-1 rounded-full border ${isAiSpeaking ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-green-200 bg-green-50 text-green-600'} transition-all duration-300`}>
                    {isAiSpeaking ? 'AI Speaking' : 'Listening...'}
                </div>
            )}
        </header>

        {/* Visualizer Area + Floating Button Container */}
        <div className="flex-1 flex flex-col items-center justify-center relative p-4 min-h-0 w-full">
            {/* Background Effect */}
            <div className={`absolute inset-0 transition-opacity duration-1000 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] 
                ${isAiSpeaking ? 'from-blue-50/50 via-white to-white' : 'from-[#E8F9F0] via-white to-white'}`} 
            />
            
            <div className="flex flex-col items-center justify-center w-full h-full relative">
                <AudioVisualizer 
                    volume={volume} 
                    isActive={connectionState === 'connected'} 
                    isAiSpeaking={isAiSpeaking}
                />
                
                <div className="absolute top-[60%] md:top-[65%] w-full text-center px-4 pointer-events-none">
                    {connectionState === 'disconnected' && (
                        <p className="text-[#6B7280] text-base md:text-lg animate-in fade-in duration-700">
                            Tap the microphone to start
                        </p>
                    )}
                     {connectionState === 'connecting' && (
                        <p className="text-[#00B84A] text-base md:text-lg animate-pulse font-medium">
                            Establishing connection...
                        </p>
                    )}
                    {connectionState === 'error' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                             <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-100 mb-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>Connection interrupted</span>
                             </div>
                            <p className="text-[#6B7280] text-sm">
                                Tap the button below to retry
                            </p>
                        </div>
                    )}
                </div>

                {/* Floating Action Button - Positioned absolutely within the flex container to sit above chat */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 transform transition-all hover:scale-105 active:scale-95 z-20">
                    <button
                        onClick={handleToggleConnection}
                        disabled={connectionState === 'connecting'}
                        className={`
                            relative group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xl transition-all duration-300
                            ${connectionState === 'connected' 
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' 
                                : connectionState === 'error'
                                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                                : 'bg-[#00B84A] hover:bg-[#009639] shadow-[#00B84A]/30'}
                            disabled:opacity-70 disabled:cursor-not-allowed
                        `}
                    >
                        {connectionState === 'connected' ? (
                            <MicOff className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        ) : connectionState === 'error' ? (
                            <div className="relative">
                                <Mic className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-amber-500"></div>
                            </div>
                        ) : (
                            <Mic className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        )}
                        
                        {/* Ping animation ring */}
                        {connectionState === 'connected' && (
                            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* Chat/Transcript Overlay */}
        <div className="h-[35vh] md:h-72 border-t border-[#E5E7EB] bg-[#F8F9FA]/90 backdrop-blur flex flex-col shrink-0">
             <div className="px-4 md:px-6 py-2 md:py-3 border-b border-[#E5E7EB] flex items-center gap-2 shrink-0 bg-[#F8F9FA]">
                 <MessageSquare className="w-4 h-4 text-[#6B7280]" />
                 <span className="text-xs md:text-sm font-semibold text-[#1A1A1A]">Live Transcript</span>
             </div>
             <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 scrollbar-hide scroll-smooth"
             >
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[#6B7280] text-xs md:text-sm italic text-center px-4">
                        Transcript will appear here once you start speaking...
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`flex gap-2 md:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Avatar */}
                            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 ${
                                msg.role === 'user' ? 'bg-[#00B84A] text-white' : 'bg-blue-600 text-white'
                            }`}>
                                {msg.role === 'user' ? <User className="w-3 h-3 md:w-5 md:h-5" /> : <Sparkles className="w-3 h-3 md:w-5 md:h-5" />}
                            </div>

                            {/* Bubble */}
                            <div className={`flex flex-col max-w-[85%] md:max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-3 py-2 md:px-4 md:py-2.5 text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-[#00B84A] text-white rounded-2xl rounded-tr-none' 
                                    : 'bg-white border border-[#E5E7EB] text-[#1A1A1A] rounded-2xl rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 px-1">
                                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    ))
                )}
             </div>
        </div>

      </main>
    </div>
  );
};

export default LiveSession;