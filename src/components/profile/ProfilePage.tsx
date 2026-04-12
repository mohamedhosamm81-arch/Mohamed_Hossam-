import { useState, useEffect } from 'react';
import { Star, MapPin, Video, Repeat, Globe, Clock, Play, Eye, Heart, ArrowLeft, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Profile, KnowledgeDemo, Page } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ExchangeModal from '../exchange/ExchangeModal';
import { useAuth } from '../../context/AuthContext';

interface Props {
  profileId?: string;
  onNavigate: (page: Page, id?: string) => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

const STATIC_PROFILE: Profile = {
  id: '1', user_id: undefined, display_name: 'Maya Chen', username: 'maya_chen',
  avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
  cover_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200',
  bio: 'Full-stack developer with 8 years of experience at top Silicon Valley companies. Passionate about React, TypeScript, and teaching others the joy of clean, maintainable code. I\'ve mentored 50+ developers and love making complex topics simple. Looking to expand my creative skills in return.',
  location: 'San Francisco, CA', video_verified: true,
  teaching_skills: ['React', 'TypeScript', 'Node.js', 'System Design', 'GraphQL'],
  learning_skills: ['Spanish', 'Watercolor Painting', 'Guitar', 'Photography'],
  rating: 4.95, review_count: 47, exchange_count: 23, response_rate: 98,
  languages: ['English', 'Mandarin'], is_available: true, is_demo: true,
  member_since: new Date(Date.now() - 18 * 30 * 24 * 60 * 60 * 1000).toISOString(),
  created_at: '',
};

const STATIC_DEMOS: KnowledgeDemo[] = [
  {
    id: '1', profile_id: '1', title: 'Building a Real-Time Dashboard with React & WebSockets',
    description: 'Watch me build a production-ready real-time dashboard from scratch. This demo covers component architecture, state management with hooks, WebSocket integration, and performance optimization. I explain my thought process throughout.',
    video_url: '', thumbnail_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    skill_name: 'React', category: 'Technology', duration_seconds: 847, views: 3240, likes: 287, is_published: true, created_at: '',
  },
  {
    id: '2', profile_id: '1', title: 'TypeScript Generics: From Confused to Confident',
    description: 'TypeScript generics confuse everyone at first. In this demo I break them down step by step with real-world examples you\'ll actually use.',
    video_url: '', thumbnail_url: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
    skill_name: 'TypeScript', category: 'Technology', duration_seconds: 623, views: 2180, likes: 194, is_published: true, created_at: '',
  },
  {
    id: '3', profile_id: '1', title: 'System Design Interview: Designing Twitter',
    description: 'I walk through how I would design Twitter\'s architecture in a real system design interview, covering scalability, databases, and trade-offs.',
    video_url: '', thumbnail_url: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
    skill_name: 'System Design', category: 'Technology', duration_seconds: 1520, views: 4100, likes: 378, is_published: true, created_at: '',
  },
];

const REVIEWS = [
  { name: 'Carlos R.', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', rating: 5, text: 'Maya is an exceptional teacher. She explained React hooks in a way that finally made sense to me. I taught her Spanish and she was equally committed.', date: '2 weeks ago' },
  { name: 'Sophie D.', avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=100', rating: 5, text: 'The exchange was perfect. I learned TypeScript basics that I\'d been struggling with for months, and she appreciated my cooking lessons.', date: '1 month ago' },
  { name: 'Kenji T.', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100', rating: 5, text: 'Highly responsive, patient, and incredibly knowledgeable. Genuinely the best exchange I\'ve had on Mind2Mind.', date: '2 months ago' },
];

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export default function ProfilePage({ profileId, onNavigate, onOpenAuth }: Props) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [demos, setDemos] = useState<KnowledgeDemo[]>([]);
  const [activeTab, setActiveTab] = useState<'demos' | 'reviews' | 'about'>('demos');
  const [exchangeOpen, setExchangeOpen] = useState(false);

  useEffect(() => {
    if (profileId) {
      Promise.all([
        supabase.from('profiles').select('*').eq('id', profileId).maybeSingle(),
        supabase.from('knowledge_demos').select('*').eq('profile_id', profileId).eq('is_published', true),
      ]).then(([{ data: p }, { data: d }]) => {
        if (p) setProfile(p as Profile);
        else setProfile(STATIC_PROFILE);
        if (d && d.length > 0) setDemos(d as KnowledgeDemo[]);
        else setDemos(STATIC_DEMOS);
      });
    } else {
      setProfile(STATIC_PROFILE);
      setDemos(STATIC_DEMOS);
    }
  }, [profileId]);

  const handleExchange = () => {
    if (!user) { onOpenAuth('signup'); return; }
    setExchangeOpen(true);
  };

  if (!profile) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const memberMonths = Math.round((Date.now() - new Date(profile.member_since).getTime()) / (30 * 24 * 60 * 60 * 1000));

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="relative h-48 sm:h-64 bg-gradient-to-br from-slate-700 to-teal-800 overflow-hidden">
        {profile.cover_url && (
          <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover opacity-40" />
        )}
        <button
          onClick={() => onNavigate('browse')}
          className="absolute top-4 left-4 flex items-center gap-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-xl text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative">
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-white shadow-lg"
              />
              {profile.video_verified && (
                <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-teal-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm">
                  <Video className="w-3 h-3" />
                  Video Verified
                </div>
              )}
            </div>

            <div className="flex-1 pt-2 sm:pt-10">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{profile.display_name}</h1>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <Globe className="w-4 h-4" />
                      {profile.languages.join(', ')}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {memberMonths} months on Mind2Mind
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} className={`w-4 h-4 ${n <= Math.round(profile.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-slate-800">{profile.rating.toFixed(2)}</span>
                    <span className="text-slate-500 text-sm">({profile.review_count} reviews)</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {profile.is_available && (
                    <Button onClick={handleExchange} size="md">
                      <MessageCircle className="w-4 h-4" />
                      Propose Exchange
                    </Button>
                  )}
                  {!profile.is_available && (
                    <div className="px-4 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-sm font-medium">
                      Currently Busy
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Exchanges', value: profile.exchange_count, icon: Repeat },
            { label: 'Reviews', value: profile.review_count, icon: Star },
            { label: 'Response Rate', value: `${profile.response_rate}%`, icon: MessageCircle },
            { label: 'Demos', value: demos.length, icon: Play },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex border-b border-slate-200 mb-8">
          {(['demos', 'reviews', 'about'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-teal-600 border-teal-600'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              {tab === 'demos' ? 'Knowledge Demos' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'demos' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {(demos.length > 0 ? demos : STATIC_DEMOS).map(demo => (
              <div key={demo.id} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer">
                <div className="relative aspect-video bg-slate-100">
                  <img src={demo.thumbnail_url} alt={demo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 text-teal-600 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-lg">{formatDuration(demo.duration_seconds)}</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">{demo.skill_name}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">{demo.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-3">{demo.description}</p>
                  <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNum(demo.views)}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNum(demo.likes)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4 mb-12">
            {REVIEWS.map((review, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold text-slate-900 text-sm">{review.name}</span>
                        <span className="text-slate-400 text-xs ml-2">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star key={n} className={`w-3.5 h-3.5 ${n <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{review.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-3">About</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{profile.bio}</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Skills I Teach</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.teaching_skills.map((skill, i) => (
                    <Badge key={i} color="teal">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Skills I Want to Learn</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.learning_skills.map((skill, i) => (
                    <Badge key={i} color="amber">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang, i) => (
                    <Badge key={i} color="slate">{lang}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {exchangeOpen && profile && (
        <ExchangeModal expert={profile} onClose={() => setExchangeOpen(false)} />
      )}
    </div>
  );
}
