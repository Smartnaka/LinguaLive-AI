import React from 'react';
import { Globe, ArrowRight, MessageSquare, Headphones, Github, Linkedin, ChevronDown, Star, Settings, Mic, Zap } from 'lucide-react';
import Logo from './Logo';

interface LandingPageProps {
  onStart: () => void;
}

const FAQS = [
  {
    question: "How does LinguaLive work?",
    answer: "LinguaLive connects you with an advanced AI partner powered by the latest Gemini models. You simply speak into your microphone, and the AI responds instantly, correcting your grammar and keeping the conversation flowing like a real human tutor."
  },
  {
    question: "Is it free to use?",
    answer: "Yes! LinguaLive is currently free to use during our public preview period. You can practice as much as you want without any subscription fees."
  },
  {
    question: "What languages can I learn?",
    answer: "We currently support 8 major languages: English, Spanish, French, German, Japanese, Mandarin Chinese, Italian, and Korean. We're constantly working on adding more!"
  },
  {
    question: "Do I need special equipment?",
    answer: "Just a device with a microphone and speakers (or headphones). We highly recommend using headphones to prevent audio feedback and ensure the clearest possible conversation experience."
  }
];

const TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    role: "Learning Spanish",
    content: "I've always been too shy to speak with real tutors. LinguaLive gave me the confidence to practice daily without fear of judgment.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    name: "David Chen",
    role: "Improving English",
    content: "The real-time corrections are a game changer. It's like having a patient teacher in your pocket 24/7. Highly recommend!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    name: "Elena Rossi",
    role: "Learning Japanese",
    content: "Used this to brush up on my Japanese before a trip to Tokyo. The polite speech patterns were explained perfectly.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
  }
];

const LANGUAGES_LIST = [
  { name: 'English', flag: '🇺🇸' },
  { name: 'Spanish', flag: '🇪🇸' },
  { name: 'French', flag: '🇫🇷' },
  { name: 'German', flag: '🇩🇪' },
  { name: 'Japanese', flag: '🇯🇵' },
  { name: 'Mandarin', flag: '🇨🇳' },
  { name: 'Italian', flag: '🇮🇹' },
  { name: 'Korean', flag: '🇰🇷' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  // Create a triple list for smooth infinite scrolling
  const MARQUEE_ITEMS = [...LANGUAGES_LIST, ...LANGUAGES_LIST, ...LANGUAGES_LIST];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#00B84A]/30 overflow-x-hidden text-[#1A1A1A]">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-[#D4F4E2]/60 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-[#FFF8F0]/80 rounded-full blur-[80px] md:blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-4 md:px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[#E8F9F0] rounded-xl flex items-center justify-center shadow-sm">
             <Logo className="w-5 h-5 md:w-6 md:h-6 text-[#00B84A]" />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight text-[#0F172A]">
            LinguaLive
          </span>
        </div>
        <button 
          onClick={onStart}
          className="px-4 md:px-6 py-2 md:py-2.5 bg-white hover:bg-gray-50 border border-[#E5E7EB] text-[#1A1A1A] rounded-full text-xs md:text-sm font-medium transition-all shadow-sm"
        >
          Launch App
        </button>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center pt-8 md:pt-10 pb-12 md:pb-16 max-w-5xl mx-auto px-4 md:px-6">
        
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 md:mb-8 text-[#0F172A] leading-[1.1] mt-6 md:mt-10">
          Fluent conversations <br />
          <span className="text-[#00B84A]">start here.</span>
        </h1>
        
        <p className="text-base md:text-xl text-[#6B7280] mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
          Immerse yourself in real-time language practice with an AI partner that listens, understands, and responds instantly with native-level fluency.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full justify-center mb-16 md:mb-20">
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-3 md:py-4 bg-[#00B84A] hover:bg-[#009639] text-white rounded-full text-base md:text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-[#00B84A]/25 w-full sm:w-auto"
          >
            Start Practicing
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={onStart} className="inline-flex items-center justify-center gap-3 px-8 py-3 md:py-4 bg-white hover:bg-gray-50 text-[#1A1A1A] border border-[#E5E7EB] rounded-full text-base md:text-lg font-semibold transition-all w-full sm:w-auto shadow-sm">
            Try Demo
          </button>
        </div>
      </main>

      {/* Infinite Language Marquee */}
      <div className="relative w-full bg-[#F8F9FA] border-y border-[#E5E7EB] overflow-hidden py-6 md:py-8 mb-16 md:mb-24">
        <div className="flex w-[200%] animate-scroll">
          {MARQUEE_ITEMS.map((lang, idx) => (
            <div key={idx} className="flex items-center gap-3 px-6 md:px-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default min-w-max">
              <span className="text-2xl md:text-3xl">{lang.flag}</span>
              <span className="text-base md:text-lg font-semibold text-[#0F172A]">{lang.name}</span>
            </div>
          ))}
        </div>
        {/* Gradients to fade edges */}
        <div className="absolute top-0 left-0 h-full w-12 md:w-20 bg-gradient-to-r from-[#F8F9FA] to-transparent z-10" />
        <div className="absolute top-0 right-0 h-full w-12 md:w-20 bg-gradient-to-l from-[#F8F9FA] to-transparent z-10" />
      </div>

      <div className="relative z-10 px-4 md:px-6 max-w-7xl mx-auto w-full">
        
        {/* How It Works Section */}
        <div className="mb-24 md:mb-32 text-center">
            <h2 className="text-xs md:text-sm font-bold tracking-widest text-[#00B84A] uppercase mb-3">Simple Process</h2>
            <h3 className="text-2xl md:text-4xl font-bold text-[#0F172A] mb-12 md:mb-16">Master a new language in 3 steps</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
                {/* Desktop connecting line */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-[#E5E7EB] -z-10" />

                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-2 border-[#E5E7EB] flex items-center justify-center mb-6 shadow-sm">
                        <Settings className="w-8 h-8 md:w-10 md:h-10 text-[#00B84A]" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-[#0F172A] mb-3">1. Customize</h4>
                    <p className="text-[#6B7280] leading-relaxed max-w-xs text-sm md:text-base">Choose your target language and select a voice persona that matches your vibe.</p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-2 border-[#E5E7EB] flex items-center justify-center mb-6 shadow-sm">
                        <Mic className="w-8 h-8 md:w-10 md:h-10 text-[#00B84A]" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-[#0F172A] mb-3">2. Speak</h4>
                    <p className="text-[#6B7280] leading-relaxed max-w-xs text-sm md:text-base">Talk naturally. No buttons to hold—just fluid, real-time conversation.</p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-2 border-[#E5E7EB] flex items-center justify-center mb-6 shadow-sm">
                        <Zap className="w-8 h-8 md:w-10 md:h-10 text-[#00B84A]" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-[#0F172A] mb-3">3. Improve</h4>
                    <p className="text-[#6B7280] leading-relaxed max-w-xs text-sm md:text-base">Get instant feedback and read the live transcript to spot errors.</p>
                </div>
            </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full text-left mb-24 md:mb-32">
           <FeatureCard 
             icon={<Headphones className="w-6 h-6 text-[#00B84A]" />}
             title="Native Audio"
             description="Experience ultra-low latency voice interactions that feel completely natural."
           />
           <FeatureCard 
             icon={<Globe className="w-6 h-6 text-[#00B84A]" />}
             title="8+ Languages"
             description="Master English, Spanish, French, Japanese, and more with culturally aware personas."
           />
           <FeatureCard 
             icon={<MessageSquare className="w-6 h-6 text-[#00B84A]" />}
             title="Live Transcript"
             description="Follow along with real-time text transcription to improve your reading and vocabulary."
           />
        </div>

        {/* Testimonials Section */}
        <div className="w-full mb-24 md:mb-32 text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-8 md:mb-12 text-center">Loved by Language Learners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
             {TESTIMONIALS.map((t, i) => (
               <div key={i} className="p-6 md:p-8 rounded-3xl bg-[#F8F9FA] border border-[#E5E7EB] flex flex-col hover:border-[#00B84A]/30 transition-colors">
                 <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                 </div>
                 <p className="text-[#6B7280] mb-6 leading-relaxed flex-1 italic text-sm md:text-base">"{t.content}"</p>
                 <div className="flex items-center gap-3">
                    <img 
                      src={t.image} 
                      alt={t.name} 
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                    />
                    <div>
                      <div className="text-[#0F172A] font-bold text-sm">{t.name}</div>
                      <div className="text-[#6B7280] text-xs">{t.role}</div>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="w-full max-w-3xl mx-auto mb-24 md:mb-32 text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-8 md:mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <details key={index} className="group border border-[#E5E7EB] rounded-2xl bg-white overflow-hidden transition-all hover:border-[#00B84A]/50 open:shadow-md open:border-[#00B84A]">
                <summary className="flex items-center justify-between p-4 md:p-6 cursor-pointer list-none text-[#0F172A] font-medium text-base md:text-lg select-none">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-[#00B84A] transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4" />
                </summary>
                <div className="px-4 md:px-6 pb-6 text-[#6B7280] leading-relaxed text-sm md:text-base">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Creator Section */}
        <div className="w-full pt-6 pb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-8 md:mb-12 text-center">Meet the Creator</h2>
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E5E7EB] shadow-sm max-w-md mx-auto hover:shadow-md transition-all">
            <div className="flex flex-col items-center text-center">
              <img 
                src="https://i.ibb.co/1Gr3Hc5d/IMG-20250618-124312-814-2.jpg"
                alt="Smart Naka"
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover mb-6 shadow-xl border-4 border-white ring-1 ring-gray-100"
              />
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Smart Naka</h3>
              <p className="text-[#00B84A] font-medium text-sm mb-4">Software Developer</p>
              <p className="text-[#6B7280] text-center mb-8 leading-relaxed text-sm">
                A skilled Software Developer passionate about building innovative web solutions. Dedicated to crafting clean, efficient code and delivering exceptional user experiences.
              </p>
              <div className="flex gap-4">
                 <a 
                   href="https://github.com/Smartnaka" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="p-2 rounded-full bg-[#F8F9FA] text-[#6B7280] hover:text-[#00B84A] hover:bg-[#E8F9F0] transition-colors"
                   aria-label="GitHub Profile"
                 >
                    <Github className="w-5 h-5" />
                 </a>
                 <a 
                   href="https://x.com/smartnakamoura" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="p-2 rounded-full bg-[#F8F9FA] text-[#6B7280] hover:text-[#00B84A] hover:bg-[#E8F9F0] transition-colors"
                   aria-label="X (Twitter) Profile"
                 >
                    {/* X Logo SVG */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                 </a>
                 <a 
                   href="https://www.linkedin.com/in/israel-adeoti" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="p-2 rounded-full bg-[#F8F9FA] text-[#6B7280] hover:text-[#00B84A] hover:bg-[#E8F9F0] transition-colors"
                   aria-label="LinkedIn Profile"
                 >
                    <Linkedin className="w-5 h-5" />
                 </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Final CTA Section */}
      <section className="relative w-full bg-[#0F172A] py-16 md:py-20 px-4 md:px-6 text-center overflow-hidden">
         <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#00B84A] rounded-full filter blur-[80px]" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-[80px]" />
         </div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">Ready to become fluent?</h2>
            <p className="text-gray-400 text-base md:text-lg mb-8 md:mb-10">Join thousands of learners improving their pronunciation and confidence today.</p>
            <button 
              onClick={onStart}
              className="px-8 md:px-10 py-3 md:py-4 bg-[#00B84A] hover:bg-[#009639] text-white rounded-full text-base md:text-lg font-bold transition-all hover:scale-105 shadow-xl shadow-[#00B84A]/20"
            >
              Start Your Free Session
            </button>
         </div>
      </section>
      
      <footer className="relative z-10 py-8 text-center text-[#6B7280] text-sm bg-white border-t border-gray-100">
        © {new Date().getFullYear()} LinguaLive AI. All rights reserved.
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#E5E7EB] hover:border-[#00B84A]/30 transition-all hover:shadow-lg hover:shadow-[#00B84A]/5 group">
    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#E8F9F0] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <h3 className="text-lg md:text-xl font-bold mb-3 text-[#0F172A]">{title}</h3>
    <p className="text-[#6B7280] leading-relaxed text-sm md:text-base">{description}</p>
  </div>
);

export default LandingPage;