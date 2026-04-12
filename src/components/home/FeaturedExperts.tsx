import { useEffect, useState } from 'react';
import { Star, MapPin, ArrowRight, Video, Repeat } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Profile, Page } from '../../types';
import Badge from '../ui/Badge';

interface Props {
  onNavigate: (page: Page, profileId?: string) => void;
}

const STATIC_EXPERTS: Profile[] = [
  {
    id: '1', user_id: undefined, display_name: 'Maya Chen', username: 'maya_chen',
    avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Full-stack developer with 8 years of experience. Passionate about React, TypeScript, and teaching others.',
    location: 'San Francisco, CA', video_verified: true,
    teaching_skills: ['React', 'TypeScript', 'Node.js'],
    learning_skills: ['Spanish', 'Watercolor', 'Guitar'],
    rating: 4.95, review_count: 47, exchange_count: 23, response_rate: 98,
    languages: ['English', 'Mandarin'], is_available: true, is_demo: true,
    member_since: new Date(Date.now() - 18 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: '',
  },
  {
    id: '2', user_id: undefined, display_name: 'Carlos Rivera', username: 'carlos_rivera',
    avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'UX designer and language tutor. I\'ve shipped products at top tech companies and speak 4 languages.',
    location: 'Barcelona, Spain', video_verified: true,
    teaching_skills: ['Spanish', 'UX Design', 'Figma'],
    learning_skills: ['Python', 'Machine Learning'],
    rating: 4.88, review_count: 34, exchange_count: 18, response_rate: 100,
    languages: ['Spanish', 'English', 'Portuguese'], is_available: true, is_demo: true,
    member_since: new Date(Date.now() - 14 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: '',
  },
  {
    id: '3', user_id: undefined, display_name: 'Aisha Patel', username: 'aisha_patel',
    avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Yoga instructor & mindfulness coach with 10+ years. Also an accomplished home chef specializing in Indian cuisine.',
    location: 'Mumbai, India', video_verified: true,
    teaching_skills: ['Yoga', 'Meditation', 'Indian Cooking'],
    learning_skills: ['Web Development', 'Video Editing'],
    rating: 4.97, review_count: 62, exchange_count: 31, response_rate: 99,
    languages: ['English', 'Hindi'], is_available: true, is_demo: true,
    member_since: new Date(Date.now() - 22 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: '',
  },
  {
    id: '4', user_id: undefined, display_name: 'James Okafor', username: 'james_okafor',
    avatar_url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Music producer and guitarist with 15 years in the industry. Produced tracks for major labels.',
    location: 'Lagos, Nigeria', video_verified: true,
    teaching_skills: ['Guitar', 'Music Production', 'Ableton'],
    learning_skills: ['Graphic Design', 'French'],
    rating: 4.92, review_count: 28, exchange_count: 15, response_rate: 97,
    languages: ['English', 'Yoruba'], is_available: false, is_demo: true,
    member_since: new Date(Date.now() - 10 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: '',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${n <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
        />
      ))}
      <span className="text-sm font-semibold text-slate-700 ml-1">{rating.toFixed(2)}</span>
    </div>
  );
}

export default function FeaturedExperts({ onNavigate }: Props) {
  const [experts, setExperts] = useState<Profile[]>([]);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .eq('is_demo', true)
      .order('exchange_count', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data && data.length > 0) setExperts(data as Profile[]);
        else setExperts(STATIC_EXPERTS);
      });
  }, []);

  const displayExperts = experts.length > 0 ? experts : STATIC_EXPERTS;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-white text-slate-600 border border-slate-200 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              Top Experts
            </div>
            <h2 className="text-4xl font-bold text-slate-900">Meet the Community</h2>
            <p className="text-slate-500 text-lg mt-2">Real people with verified expertise, ready to exchange.</p>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="hidden md:flex items-center gap-2 text-teal-600 font-medium hover:text-teal-700 transition-colors"
          >
            Browse All Experts <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayExperts.map((expert) => (
            <div
              key={expert.id}
              onClick={() => onNavigate('profile', expert.id)}
              className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="relative mb-4">
                <img
                  src={expert.avatar_url}
                  alt={expert.display_name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                />
                {expert.video_verified && (
                  <div className="absolute -bottom-1.5 -right-1.5 flex items-center gap-1 bg-teal-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                    <Video className="w-2.5 h-2.5" />
                    Verified
                  </div>
                )}
                {expert.is_available && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                )}
              </div>

              <div className="mb-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">
                  {expert.display_name}
                </h3>
                <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                  <MapPin className="w-3 h-3" />
                  {expert.location}
                </div>
              </div>

              <StarRating rating={expert.rating} />

              <p className="text-slate-500 text-xs leading-relaxed mt-3 mb-4 line-clamp-2">{expert.bio}</p>

              <div className="space-y-2 mb-4">
                <div>
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1">Teaches</div>
                  <div className="flex flex-wrap gap-1">
                    {expert.teaching_skills.slice(0, 2).map((skill, i) => (
                      <Badge key={i} color="teal" size="sm">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1">Wants to Learn</div>
                  <div className="flex flex-wrap gap-1">
                    {expert.learning_skills.slice(0, 2).map((skill, i) => (
                      <Badge key={i} color="amber" size="sm">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Repeat className="w-3 h-3" />
                  {expert.exchange_count} exchanges
                </div>
                <div>{expert.review_count} reviews</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
