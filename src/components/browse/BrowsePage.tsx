import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Video, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Profile, Page } from '../../types';
import ExpertCard from './ExpertCard';
import ExchangeModal from '../exchange/ExchangeModal';
import { useAuth } from '../../context/AuthContext';
import SmartSearchBar from '../search/SmartSearchBar';
import { generateArabAvatarUrl } from '../../lib/arab-data';

interface Props {
  onNavigate: (page: Page, id?: string) => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

const CATEGORIES = ['All', 'Technology', 'Design', 'Languages', 'Music', 'Fitness', 'Cooking', 'Business', 'Arts & Crafts'];

const STATIC_EXPERTS: Profile[] = [
  {
    id: '1', user_id: undefined, display_name: 'أحمد محمد', username: 'ahmad_mohammad',
    avatar_url: generateArabAvatarUrl('أحمد محمد'),
    bio: 'مهندس برمجيات بخبرة 8 سنوات. متخصص في React و TypeScript وتعليم الآخرين.',
    location: 'Cairo, Egypt', video_verified: true,
    teaching_skills: ['React', 'TypeScript', 'Node.js', 'System Design'],
    learning_skills: ['Arabic Design', 'Watercolor Painting', 'Guitar'],
    rating: 4.95, review_count: 47, exchange_count: 23, response_rate: 98,
    languages: ['Arabic', 'English'], is_available: true, is_demo: true,
    member_since: '', created_at: '',
  },
  {
    id: '2', user_id: undefined, display_name: 'فاطمة علي', username: 'fatima_ali',
    avatar_url: generateArabAvatarUrl('فاطمة علي'),
    bio: 'مصممة UX وتدرس اللغات. عملت مع أفضل الشركات التقنية وتتحدث 4 لغات.',
    location: 'Dubai, UAE', video_verified: true,
    teaching_skills: ['UI/UX Design', 'Figma', 'Web Design', 'Arabic Design'],
    learning_skills: ['Python', 'Machine Learning', 'Piano'],
    rating: 4.88, review_count: 34, exchange_count: 18, response_rate: 100,
    languages: ['Arabic', 'English', 'French'], is_available: true, is_demo: true,
    member_since: '', created_at: '',
  },
  {
    id: '3', user_id: undefined, display_name: 'محمود حسن', username: 'mahmoud_hassan',
    avatar_url: generateArabAvatarUrl('محمود حسن'),
    bio: 'مدرب اليوغا والتأمل بخبرة 10+ سنوات. طاهي متخصص في الطعام العربي.',
    location: 'Amman, Jordan', video_verified: true,
    teaching_skills: ['Yoga', 'Meditation', 'Arabic Cooking', 'Ayurveda'],
    learning_skills: ['Web Development', 'Video Editing', 'English Writing'],
    rating: 4.97, review_count: 62, exchange_count: 31, response_rate: 99,
    languages: ['Arabic', 'English'], is_available: true, is_demo: true,
    member_since: '', created_at: '',
  },
  {
    id: '4', user_id: undefined, display_name: 'نور إبراهيم', username: 'noor_ibrahim',
    avatar_url: generateArabAvatarUrl('نور إبراهيم'),
    bio: 'منتج موسيقى وعازف جيتار بخبرة 15 سنة. أنتج موسيقى لشركات عملاقة.',
    location: 'Riyadh, Saudi Arabia', video_verified: true,
    teaching_skills: ['Guitar', 'Music Production', 'Ableton Live', 'Music Theory'],
    learning_skills: ['Graphic Design', 'French Language', 'Fitness Training'],
    rating: 4.92, review_count: 28, exchange_count: 15, response_rate: 97,
    languages: ['Arabic', 'English'], is_available: false, is_demo: true,
    member_since: '', created_at: '',
  },
  {
    id: '5', user_id: undefined, display_name: 'Sophie Dubois', username: 'sophie_dubois',
    avatar_url: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Pastry chef turned food blogger. I believe food is the universal language. Teach me code, I\'ll teach you croissants.',
    location: 'Paris, France', video_verified: true,
    teaching_skills: ['French Language', 'French Cooking', 'Pastry Arts', 'Food Photography'],
    learning_skills: ['Python', 'Digital Marketing', 'Yoga'],
    rating: 4.85, review_count: 41, exchange_count: 20, response_rate: 95,
    languages: ['French', 'English'], is_available: true, is_demo: true,
    member_since: '', created_at: '',
  },
  {
    id: '6', user_id: undefined, display_name: 'Kenji Tanaka', username: 'kenji_tanaka',
    avatar_url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Fitness coach and martial arts instructor. 3x national champion. I exchange training for tech skills.',
    location: 'Tokyo, Japan', video_verified: true,
    teaching_skills: ['Fitness Training', 'Martial Arts', 'Nutrition', 'Japanese Language'],
    learning_skills: ['iOS Development', 'Graphic Design', 'Public Speaking'],
    rating: 4.90, review_count: 53, exchange_count: 27, response_rate: 100,
    languages: ['Japanese', 'English'], is_available: true, is_demo: true,
    member_since: '', created_at: '',
  },
  {
    id: '7', user_id: undefined, display_name: 'Priya Sharma', username: 'priya_sharma',
    avatar_url: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Growth marketer and startup founder. 2 exits, 1 failure, countless lessons. I trade marketing wisdom for design skills.',
    location: 'Bangalore, India', video_verified: true,
    teaching_skills: ['Digital Marketing', 'SEO', 'Growth Hacking', 'Startup Strategy'],
    learning_skills: ['UI Design', 'Video Production', 'German Language'],
    rating: 4.78, review_count: 19, exchange_count: 11, response_rate: 93,
    languages: ['English', 'Hindi'], is_available: true, is_demo: true,
    member_since: '', created_at: '',
  },
  {
    id: '8', user_id: undefined, display_name: 'Luca Rossi', username: 'luca_rossi',
    avatar_url: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Watercolor artist and illustrator. My work has been featured in galleries across Europe. I paint, you teach.',
    location: 'Rome, Italy', video_verified: false,
    teaching_skills: ['Watercolor Painting', 'Illustration', 'Drawing', 'Italian Language'],
    learning_skills: ['React', 'Photography', 'Business Development'],
    rating: 4.83, review_count: 22, exchange_count: 12, response_rate: 91,
    languages: ['Italian', 'English'], is_available: true, is_demo: true,
    member_since: '', created_at: '',
  },
];

export default function BrowsePage({ onNavigate, onOpenAuth }: Props) {
  const { user } = useAuth();
  const [experts, setExperts] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [exchangeTarget, setExchangeTarget] = useState<Profile | null>(null);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .order('exchange_count', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setExperts(data as Profile[]);
        else setExperts(STATIC_EXPERTS);
      });
  }, []);

  const displayExperts = (experts.length > 0 ? experts : STATIC_EXPERTS).filter(e => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      e.display_name.toLowerCase().includes(q) ||
      e.teaching_skills.some(s => s.toLowerCase().includes(q)) ||
      e.learning_skills.some(s => s.toLowerCase().includes(q)) ||
      e.location.toLowerCase().includes(q);
    const matchesCategory = activeCategory === 'All' ||
      e.teaching_skills.some(s => {
        const catMap: Record<string, string[]> = {
          Technology: ['React', 'TypeScript', 'Node.js', 'Python', 'iOS', 'Web Dev', 'System Design', 'Ableton'],
          Design: ['UX Design', 'Figma', 'Graphic Design', 'Illustration', 'Watercolor', 'Drawing', 'UI Design'],
          Languages: ['Spanish', 'French', 'Portuguese', 'Japanese', 'Italian', 'Hindi', 'Mandarin', 'German', 'English Writing'],
          Music: ['Guitar', 'Music Production', 'Music Theory', 'Piano', 'Vocals'],
          Fitness: ['Yoga', 'Fitness Training', 'Martial Arts', 'Nutrition'],
          Cooking: ['Indian Cooking', 'French Cooking', 'Pastry Arts', 'Food Photography', 'Cooking', 'Baking'],
          Business: ['Digital Marketing', 'SEO', 'Growth Hacking', 'Startup Strategy'],
          'Arts & Crafts': ['Watercolor Painting', 'Illustration', 'Drawing', 'Painting'],
        };
        return catMap[activeCategory]?.some(kw => s.includes(kw));
      });
    const matchesVerified = !verifiedOnly || e.video_verified;
    const matchesAvailable = !availableOnly || e.is_available;
    return matchesSearch && matchesCategory && matchesVerified && matchesAvailable;
  });

  const handleRequestExchange = (expert: Profile) => {
    if (!user) { onOpenAuth('signup'); return; }
    setExchangeTarget(expert);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-20 md:pb-0">
      <div className="bg-gradient-to-br from-slate-900 to-teal-900 py-12 md:py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3 text-center">Browse Experts</h1>
          <p className="text-slate-300 text-sm md:text-base lg:text-lg mb-6 md:mb-8 text-center">Find someone who teaches what you want — and wants what you teach.</p>
          <div className="max-w-2xl mx-auto">
            <SmartSearchBar
              onSearch={(filters) => {
                setSearch(filters.query);
              }}
              placeholder="Search skills, names, or locations..."
              showAdvanced={false}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors flex-shrink-0 ${
              showFilters ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

        {showFilters && (
          <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-6 flex flex-wrap gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`w-10 h-5 rounded-full transition-colors relative ${verifiedOnly ? 'bg-teal-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-0.5 transition-transform ${verifiedOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-slate-700 flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-teal-500" />
                Video Verified Only
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => setAvailableOnly(!availableOnly)}
                className={`w-10 h-5 rounded-full transition-colors relative ${availableOnly ? 'bg-teal-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-0.5 transition-transform ${availableOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-slate-700 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                Available Now
              </span>
            </label>
            {(verifiedOnly || availableOnly || activeCategory !== 'All' || search) && (
              <button
                onClick={() => { setVerifiedOnly(false); setAvailableOnly(false); setActiveCategory('All'); setSearch(''); }}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 ml-auto"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        )}

        <div className="text-sm text-slate-500 mb-6">
          Showing <strong className="text-slate-700">{displayExperts.length}</strong> experts
        </div>

        {displayExperts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-slate-400 text-lg mb-2">No experts match your search.</div>
            <div className="text-slate-400 text-sm">Try different keywords or remove filters.</div>
          </div>
        ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayExperts.map(expert => (
              <ExpertCard
                key={expert.id}
                expert={expert}
                onNavigate={onNavigate}
                onRequestExchange={handleRequestExchange}
              />
            ))}
          </div>
        )}
      </div>

      {exchangeTarget && (
        <ExchangeModal
          expert={exchangeTarget}
          onClose={() => setExchangeTarget(null)}
        />
      )}
    </div>
  );
}
