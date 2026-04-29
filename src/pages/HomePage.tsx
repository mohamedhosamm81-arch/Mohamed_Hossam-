import HeroSection from '../components/home/HeroSection';
import StatsBar from '../components/home/StatsBar';
import HowItWorks from '../components/home/HowItWorks';
import SkillCategories from '../components/home/SkillCategories';
import FeaturedDemos from '../components/home/FeaturedDemos';
import FeaturedExperts from '../components/home/FeaturedExperts';
import RecommendedProfiles from '../components/recommendations/RecommendedProfiles';
import CTASection from '../components/home/CTASection';
import { Page } from '../types';

interface Props {
  onNavigate: (page: Page, id?: string) => void;
  onOpenAuth: (mode: 'signup') => void;
}

export default function HomePage({ onNavigate, onOpenAuth }: Props) {
  return (
    <>
      <HeroSection onNavigate={onNavigate} onOpenAuth={onOpenAuth} />
      <StatsBar />
      <HowItWorks />
      <SkillCategories onNavigate={onNavigate} />
      <FeaturedDemos onNavigate={onNavigate} />
      <RecommendedProfiles
        allProfiles={[]}
        onNavigate={onNavigate}
        onOpenAuth={onOpenAuth}
        title="Recommended Experts"
        limit={4}
      />
      <FeaturedExperts onNavigate={onNavigate} />
      <CTASection onOpenAuth={onOpenAuth} />
    </>
  );
}
