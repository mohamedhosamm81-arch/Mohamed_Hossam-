import { ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

interface Props {
  onOpenAuth: (mode: 'signup') => void;
}

const benefits = [
  'Video-verified expert profiles',
  'No fees — pure knowledge exchange',
  'Match with 52,000+ global experts',
  'Rate & review system for trust',
];

export default function CTASection({ onOpenAuth }: Props) {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(20,184,166,0.15)_0%,_transparent_70%)]" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 mb-8">
          <span className="text-teal-300 text-sm font-medium">Join 52,000+ knowledge traders</span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
          Your expertise is someone's
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
            dream skill to learn.
          </span>
        </h2>

        <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Someone out there knows exactly what you want to learn — and wants exactly what you know.
          Mind2Mind makes that connection free and effortless.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-4">
              <CheckCircle className="w-5 h-5 text-teal-400" />
              <span className="text-white/80 text-xs text-center leading-snug">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => onOpenAuth('signup')} className="group">
            Start Trading Knowledge
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <button className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-medium text-white/90 border border-white/20 hover:bg-white/10 transition-all duration-200">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
