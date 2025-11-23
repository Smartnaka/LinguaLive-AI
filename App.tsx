import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LiveSession from './components/LiveSession';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'session'>('landing');

  return (
    <>
      {view === 'landing' ? (
        <LandingPage onStart={() => setView('session')} />
      ) : (
        <LiveSession onExit={() => setView('landing')} />
      )}
    </>
  );
};

export default App;