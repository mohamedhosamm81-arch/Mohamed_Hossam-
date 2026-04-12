export interface Profile {
  id: string;
  user_id?: string;
  display_name: string;
  username: string;
  avatar_url: string;
  cover_url?: string;
  bio: string;
  location: string;
  video_verified: boolean;
  teaching_skills: string[];
  learning_skills: string[];
  rating: number;
  review_count: number;
  exchange_count: number;
  response_rate: number;
  languages: string[];
  is_available: boolean;
  is_demo: boolean;
  member_since: string;
  created_at: string;
}

export interface KnowledgeDemo {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  skill_name: string;
  category: string;
  duration_seconds: number;
  views: number;
  likes: number;
  is_published: boolean;
  created_at: string;
  profile?: Profile;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface ExchangeRequest {
  id: string;
  requester_profile_id: string;
  provider_profile_id: string;
  requester_skill: string;
  provider_skill: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  created_at: string;
}

export type Page = 'home' | 'browse' | 'profile';
