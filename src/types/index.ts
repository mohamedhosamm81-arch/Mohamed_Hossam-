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
  verification_video_url?: string;
  teaching_skills: string[];
  learning_skills: string[];
  skills_to_teach?: string[];
  skills_to_learn?: string[];
  rating: number;
  review_count: number;
  exchange_count: number;
  response_rate: number;
  languages: string[];
  is_available: boolean;
  is_demo: boolean;
  member_since: string;
  created_at: string;
  updated_at?: string;
}

export interface Demo {
  id: string;
  user_id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: 'video' | 'pdf';
  visibility: 'public' | 'custom';
  allowed_users: string[];
  skill_name: string;
  created_at: string;
  updated_at?: string;
  // joined
  profiles?: Profile;
}

export interface KnowledgeDemo {
  id: string;
  profile_id: string;
  user_id?: string;
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

export interface Exchange {
  id: string;
  sender_id: string;
  receiver_id: string;
  skill_requested: string;
  skill_offered: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  rejection_reason: string;
  created_at: string;
  updated_at?: string;
  // joined profiles
  sender_profile?: Profile;
  receiver_profile?: Profile;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  created_at?: string;
}

export interface ProfileCategory {
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  is_expert: boolean;
}

export interface ExchangeRequest {
  id: string;
  requester_profile_id: string;
  provider_profile_id: string;
  requester_id?: string;
  provider_id?: string;
  requester_skill: string;
  provider_skill: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  notes?: string;
  scheduled_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  exchange_id: string;
  reviewer_id: string;
  reviewee_profile_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  helpful_count: number;
  created_at: string;
}

export interface DemoLike {
  id: string;
  demo_id: string;
  user_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant_id: string;
  participant_name: string;
  participant_avatar: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  exchange_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  exchange_notifications: boolean;
  review_notifications: boolean;
  message_notifications: boolean;
  language_preference: string;
  theme_preference: 'light' | 'dark' | 'auto';
  newsletter_subscribed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillEndorsement {
  id: string;
  endorser_id: string;
  endorsee_profile_id: string;
  skill_name: string;
  created_at: string;
}

export interface ExchangeMessage {
  id: string;
  exchange_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface ExchangeStats {
  id: string;
  profile_id: string;
  total_exchanges: number;
  completed_exchanges: number;
  pending_exchanges: number;
  average_rating: number;
  total_reviews: number;
  positive_reviews: number;
  negative_reviews: number;
  response_time_hours: number;
  created_at: string;
  updated_at: string;
}

export interface FeaturedProfile {
  id: string;
  profile_id: string;
  featured_reason: string;
  featured_until: string;
  display_order: number;
  created_at: string;
}

export interface UserActivityLog {
  id: string;
  user_id: string;
  action: string;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  posted_by: string;
  skill_required: string;
  budget?: number;
  deadline?: string;
  status: 'open' | 'in_progress' | 'completed';
  created_at: string;
}

export interface DashboardStats {
  total_exchanges: number;
  pending_exchanges: number;
  completed_exchanges: number;
  average_rating: number;
  total_reviews: number;
  demos_published: number;
  skills_taught: string[];
  skills_learning: string[];
  response_rate: number;
  new_notifications: number;
}

export interface AdminStats {
  total_users: number;
  total_exchanges: number;
  total_revenue: number;
  active_users_today: number;
  new_users_this_week: number;
  average_rating: number;
  most_popular_skills: string[];
  verified_users_count: number;
}

export type Page = 'home' | 'browse' | 'profile' | 'messages' | 'jobs' | 'exchanges';
