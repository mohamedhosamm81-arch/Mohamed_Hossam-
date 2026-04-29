import { ArrowRight, Play, Shield, Zap } from 'lucide-react';
import Button from '../ui/Button';
import { Page } from '../../types';
import { generateArabAvatarUrl } from '../../lib/arab-data';

interface HeroProps {
  onNavigate: (page: Page) => void;
  onOpenAuth: (mode: 'signup') => void;
}

export default function HeroSection({ onNavigate, onOpenAuth }: HeroProps) {
  const floatingCards = [
    { name: 'فاطمة علي', teaching: 'React', learning: 'Arabic Design', avatar: generateArabAvatarUrl('فاطمة علي'), verified: true, delay: '' },
    { name: 'محمود حسن', teaching: 'UI/UX Design', learning: 'Python', avatar: generateArabAvatarUrl('محمود حسن'), verified: true, delay: 'animation-delay-300' },
    { name: 'نور إبراهيم', teaching: 'Yoga', learning: 'Web Dev', avatar: generateArabAvatarUrl('نور إبراهيم'), verified: true, delay: 'animation-delay-600' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(6,182,212,0.1)_0%,_transparent_60%)]" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 mb-8">
              <Zap className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-teal-300 text-sm font-medium">100% Free · No Money. Just Knowledge.</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
              Trade What
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                You Know.
              </span>
              <br />
              Learn What
              <br />
              You Need.
            </h1>

            <p className="text-slate-300 text-base md:text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">
              Mind2Mind connects experts for genuine skill exchange. Teach guitar, learn Arabic.
              Teach React, learn watercolor. Video-verified profiles ensure real expertise.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-10">
              <Button size="lg" onClick={() => onOpenAuth('signup')} className="group w-full sm:w-auto">
                Start Exchanging
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <button
                onClick={() => onNavigate('browse')}
                className="inline-flex items-center justify-center gap-2.5 px-6 md:px-7 py-3 md:py-3.5 rounded-xl text-sm md:text-base font-medium text-white/90 border border-white/20 hover:bg-white/10 transition-all duration-200 w-full sm:w-auto"
              >
                <Play className="w-4 h-4" />
                Watch Demos
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-400" />
                <span className="hidden sm:inline">Video-verified experts</span>
                <span className="sm:hidden">Verified experts</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
              <div className="hidden sm:block">No credit card needed</div>
              <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
              <div>Join free today</div>
            </div>
          </div>

          <div className="hidden lg:block relative mt-8 lg:mt-0">
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-full h-full bg-teal-500/5 rounded-3xl border border-teal-500/10" />
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
                <div className="text-center mb-6">
                  <div className="text-slate-400 text-xs md:text-sm mb-1">Active Exchanges Right Now</div>
                  <div className="text-3xl md:text-4xl font-bold text-white">2,847</div>
                  <div className="text-teal-400 text-xs md:text-sm mt-1">↑ 12% from last week</div>
                </div>

                {floatingCards.map((card, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="relative flex-shrink-0">
                      <img src={card.avatar} alt={card.name} className="w-12 h-12 rounded-xl object-cover" loading="lazy" />
                      {card.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-[8px]">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">{card.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-teal-400 text-xs bg-teal-500/10 px-2 py-0.5 rounded-full">Teaches {card.teaching}</span>
                        <span className="text-slate-500 text-xs">→</span>
                        <span className="text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded-full">Learns {card.learning}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  </div>
                ))}

                <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-4 text-center">
                  <div className="text-teal-300 text-sm font-medium">98,240+ skills shared</div>
                  <div className="text-slate-400 text-xs mt-1">across 180+ countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
          <path d="M0,80 C360,20 720,60 1080,20 C1260,0 1380,40 1440,40 L1440,80 Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
}
