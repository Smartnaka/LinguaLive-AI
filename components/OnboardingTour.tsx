import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Mic, Settings, MessageSquare, Sparkles } from 'lucide-react';

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const STEPS = [
  {
    title: "Welcome to LinguaLive",
    description: "Your personal AI language partner is ready to help you practice.",
    icon: <Sparkles className="w-10 h-10 text-[#00B84A]" />,
  },
  {
    title: "Customize Your Partner",
    description: "Use the settings panel to choose your target language and preferred voice persona.",
    icon: <Settings className="w-10 h-10 text-[#00B84A]" />,
  },
  {
    title: "Tap to Speak",
    description: "Press the microphone button to start. Speak naturally—the AI listens and responds instantly.",
    icon: <Mic className="w-10 h-10 text-[#00B84A]" />,
  },
  {
    title: "Follow Along",
    description: "Read the real-time transcript below to check spelling and grammar as you converse.",
    icon: <MessageSquare className="w-10 h-10 text-[#00B84A]" />,
  }
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        
        {/* Close/Skip Button */}
        <button 
          onClick={onSkip}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center pt-12 flex-1">
          <div className="w-24 h-24 rounded-full bg-[#E8F9F0] flex items-center justify-center mb-6 shadow-inner ring-4 ring-white shrink-0">
            {STEPS[currentStep].icon}
          </div>
          
          <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
            {STEPS[currentStep].title}
          </h3>
          
          <p className="text-[#6B7280] leading-relaxed min-h-[80px]">
            {STEPS[currentStep].description}
          </p>
        </div>

        {/* Footer / Controls */}
        <div className="p-6 bg-[#F8F9FA] border-t border-[#E5E7EB] flex items-center justify-between shrink-0">
          
          {/* Step Indicators */}
          <div className="flex gap-2">
            {STEPS.map((_, idx) => (
              <div 
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'bg-[#00B84A] w-6' : 'bg-[#D1D5DB]'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button 
                onClick={handleBack}
                className="px-4 py-2 rounded-xl text-[#6B7280] font-medium hover:bg-white hover:text-[#1A1A1A] transition-colors"
              >
                Back
              </button>
            )}
            <button 
              onClick={handleNext}
              className="px-6 py-2 rounded-xl bg-[#00B84A] text-white font-semibold hover:bg-[#009639] transition-all shadow-lg shadow-[#00B84A]/20 flex items-center gap-2"
            >
              {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;