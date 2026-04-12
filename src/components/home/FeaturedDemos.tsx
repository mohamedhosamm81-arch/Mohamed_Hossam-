import { useEffect, useState } from 'react';
import { Play, Eye, Heart, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { KnowledgeDemo } from '../../types';
import { Page } from '../../types';

interface Props {
  onNavigate: (page: Page) => void;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export default function FeaturedDemos({ onNavigate }: Props) {
  const [demos, setDemos] = useState<(KnowledgeDemo & { profile?: { display_name: string; avatar_url: string; video_verified: boolean } })[]>([]);

  useEffect(() => {
    supabase
      .from('knowledge_demos')
      .select('*, profile:profiles(display_name, avatar_url, video_verified)')
      .eq('is_published', true)
      .order('views', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) setDemos(data as typeof demos);
      });
  }, []);

  const displayDemos = demos.length > 0 ? demos : staticDemos;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-600 border border-teal-100 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              Knowledge Demos
            </div>
            <h2 className="text-4xl font-bold text-slate-900">
              Prove Your Expertise
            </h2>
            <p className="text-slate-500 text-lg mt-2">Short videos that show — not just tell — what you can teach.</p>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="hidden md:flex items-center gap-2 text-teal-600 font-medium hover:text-teal-700 transition-colors"
          >
            See All Demos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayDemos.map((demo, i) => (
            <div
              key={i}
              className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => onNavigate('browse')}
            >
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={demo.thumbnail_url}
                  alt={demo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 text-teal-600 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <span className="bg-slate-900/80 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(demo.duration_seconds)}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-teal-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {demo.skill_name || demo.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
                  {demo.title}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={demo.profile?.avatar_url || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt={demo.profile?.display_name || 'Expert'}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-600 font-medium">{demo.profile?.display_name || 'Expert'}</span>
                      {demo.profile?.video_verified && (
                        <div className="w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center">
                          <span className="text-white text-[8px]">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatNum(demo.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {formatNum(demo.likes)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const staticDemos = [
  {
    id: '1',
    profile_id: '',
    title: 'Building a Real-Time Dashboard with React & WebSockets',
    description: '',
    video_url: '',
    thumbnail_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    skill_name: 'React',
    category: 'Technology',
    duration_seconds: 847,
    views: 3240,
    likes: 287,
    is_published: true,
    created_at: '',
    profile: { display_name: 'Maya Chen', avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100', video_verified: true },
  },
  {
    id: '2',
    profile_id: '',
    title: 'UX Research Methods That Actually Work',
    description: '',
    video_url: '',
    thumbnail_url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    skill_name: 'UX Design',
    category: 'Design',
    duration_seconds: 1203,
    views: 2180,
    likes: 194,
    is_published: true,
    created_at: '',
    profile: { display_name: 'Carlos Rivera', avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', video_verified: true },
  },
  {
    id: '3',
    profile_id: '',
    title: 'Morning Yoga Flow for Beginners: 20 Minutes to Transform Your Day',
    description: '',
    video_url: '',
    thumbnail_url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
    skill_name: 'Yoga',
    category: 'Fitness',
    duration_seconds: 1264,
    views: 5820,
    likes: 512,
    is_published: true,
    created_at: '',
    profile: { display_name: 'Aisha Patel', avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', video_verified: true },
  },
  {
    id: '4',
    profile_id: '',
    title: 'Guitar Chord Progressions: The Secret Language of Songs',
    description: '',
    video_url: '',
    thumbnail_url: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800',
    skill_name: 'Guitar',
    category: 'Music',
    duration_seconds: 965,
    views: 4100,
    likes: 378,
    is_published: true,
    created_at: '',
    profile: { display_name: 'James Okafor', avatar_url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100', video_verified: true },
  },
  {
    id: '5',
    profile_id: '',
    title: 'Perfect Croissants from Scratch: The Laminated Dough Method',
    description: '',
    video_url: '',
    thumbnail_url: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=800',
    skill_name: 'Pastry Arts',
    category: 'Cooking',
    duration_seconds: 1847,
    views: 7340,
    likes: 689,
    is_published: true,
    created_at: '',
    profile: { display_name: 'Sophie Dubois', avatar_url: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=100', video_verified: true },
  },
  {
    id: '6',
    profile_id: '',
    title: 'High-Intensity Interval Training: Science-Based Fat Loss',
    description: '',
    video_url: '',
    thumbnail_url: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800',
    skill_name: 'Fitness Training',
    category: 'Fitness',
    duration_seconds: 1134,
    views: 6210,
    likes: 543,
    is_published: true,
    created_at: '',
    profile: { display_name: 'Kenji Tanaka', avatar_url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100', video_verified: true },
  },
];
