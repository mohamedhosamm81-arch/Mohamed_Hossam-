import { useState, useEffect } from 'react';
import { X, Camera, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../types';
import Button from '../ui/Button';

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function ProfileEditModal({ onClose, onSaved }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({
    display_name: '',
    username: '',
    bio: '',
    avatar_url: '',
    location: '',
    teaching_skills: [],
    learning_skills: [],
    languages: [],
    is_available: true,
  });
  const [teachInput, setTeachInput] = useState('');
  const [learnInput, setLearnInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile(data as Profile);
          setAvatarPreview(data.avatar_url || '');
        } else {
          setProfile(prev => ({
            ...prev,
            display_name: user.email?.split('@')[0] || '',
            username: user.email?.split('@')[0].replace(/[^a-z0-9]/gi, '_').toLowerCase() || '',
          }));
        }
        setLoading(false);
      });
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const addSkill = (type: 'teaching_skills' | 'learning_skills' | 'languages', value: string, setter: (v: string) => void) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const current = profile[type] as string[] || [];
    if (!current.includes(trimmed)) {
      setProfile(prev => ({ ...prev, [type]: [...current, trimmed] }));
    }
    setter('');
  };

  const removeSkill = (type: 'teaching_skills' | 'learning_skills' | 'languages', index: number) => {
    const current = profile[type] as string[] || [];
    setProfile(prev => ({ ...prev, [type]: current.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    if (!user) return;
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      let avatarUrl = profile.avatar_url || '';

      // Upload avatar if changed
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const path = `${user.id}/avatar.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }

      const upsertData = {
        user_id: user.id,
        display_name: profile.display_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        avatar_url: avatarUrl,
        location: profile.location || '',
        teaching_skills: profile.teaching_skills || [],
        learning_skills: profile.learning_skills || [],
        skills_to_teach: profile.teaching_skills || [],
        skills_to_learn: profile.learning_skills || [],
        languages: profile.languages || [],
        is_available: profile.is_available ?? true,
        is_demo: false,
        updated_at: new Date().toISOString(),
      };

      // Check if profile exists
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error: updateErr } = await supabase
          .from('profiles')
          .update(upsertData)
          .eq('user_id', user.id);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from('profiles')
          .insert(upsertData);
        if (insertErr) throw insertErr;
      }

      setSuccess('Profile saved successfully!');
      setTimeout(() => {
        onSaved();
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <div className="relative bg-white rounded-3xl shadow-2xl p-8">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-900 px-6 pt-6 pb-8 text-center relative rounded-t-3xl">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-white mb-1">Edit My Profile</h2>
          <p className="text-slate-400 text-sm">Set up your skills and preferences</p>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Avatar */}
          <div className="flex justify-center">
            <label className="relative cursor-pointer group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 ring-4 ring-white shadow-lg">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Camera className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>
            <input
              type="text"
              value={profile.display_name || ''}
              onChange={e => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-slate-800"
              placeholder="Your name"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
            <input
              type="text"
              value={profile.username || ''}
              onChange={e => setProfile(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-slate-800"
              placeholder="your_username"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
            <textarea
              value={profile.bio || ''}
              onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-slate-800 resize-none"
              placeholder="Tell others about yourself..."
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
            <input
              type="text"
              value={profile.location || ''}
              onChange={e => setProfile(prev => ({ ...prev, location: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-slate-800"
              placeholder="City, Country"
            />
          </div>

          {/* Skills to Teach */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills I Teach</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={teachInput}
                onChange={e => setTeachInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill('teaching_skills', teachInput, setTeachInput))}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-slate-800"
                placeholder="Type a skill and press Enter"
              />
              <button
                onClick={() => addSkill('teaching_skills', teachInput, setTeachInput)}
                className="px-3 py-2 bg-teal-50 text-teal-600 rounded-xl text-sm font-medium hover:bg-teal-100 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.teaching_skills || []).map((skill, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-full text-xs font-medium">
                  {skill}
                  <button onClick={() => removeSkill('teaching_skills', i)} className="hover:text-teal-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Skills to Learn */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills I Want to Learn</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={learnInput}
                onChange={e => setLearnInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill('learning_skills', learnInput, setLearnInput))}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-slate-800"
                placeholder="Type a skill and press Enter"
              />
              <button
                onClick={() => addSkill('learning_skills', learnInput, setLearnInput)}
                className="px-3 py-2 bg-amber-50 text-amber-600 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.learning_skills || []).map((skill, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-medium">
                  {skill}
                  <button onClick={() => removeSkill('learning_skills', i)} className="hover:text-amber-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Languages</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={langInput}
                onChange={e => setLangInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill('languages', langInput, setLangInput))}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-slate-800"
                placeholder="Type a language and press Enter"
              />
              <button
                onClick={() => addSkill('languages', langInput, setLangInput)}
                className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.languages || []).map((lang, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-medium">
                  {lang}
                  <button onClick={() => removeSkill('languages', i)} className="hover:text-slate-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => setProfile(prev => ({ ...prev, is_available: !prev.is_available }))}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${profile.is_available ? 'bg-teal-500' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-0.5 transition-transform ${profile.is_available ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm text-slate-700 font-medium">Available for exchanges</span>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-teal-50 border border-teal-100 text-teal-700 text-sm px-4 py-3 rounded-xl">
              {success}
            </div>
          )}

          {/* Save */}
          <Button onClick={handleSave} loading={saving} className="w-full" size="lg">
            <Save className="w-4 h-4" />
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
