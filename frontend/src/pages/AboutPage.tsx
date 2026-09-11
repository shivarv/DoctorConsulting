import { ApproachSection } from '../features/marketing/components/ApproachSection'
import { AyurvedaSection } from '../features/marketing/components/AyurvedaSection'
import { CareAreasSection } from '../features/marketing/components/CareAreasSection'
import { DietLifestyleSection } from '../features/marketing/components/DietLifestyleSection'
import { FinalCtaSection } from '../features/marketing/components/FinalCtaSection'
import { FreeGuideSection } from '../features/marketing/components/FreeGuideSection'
import { HeroSection } from '../features/marketing/components/HeroSection'
import { JournalSection } from '../features/marketing/components/JournalSection'
import { JourneySection } from '../features/marketing/components/JourneySection'
import { LifestyleSection } from '../features/marketing/components/LifestyleSection'
import { OnlineConsultationSection } from '../features/marketing/components/OnlineConsultationSection'
import { PersonalYogaSection } from '../features/marketing/components/PersonalYogaSection'
import { PractitionerSection } from '../features/marketing/components/PractitionerSection'
import { ProgramsSection } from '../features/marketing/components/ProgramsSection'
import { TestimonialsSection } from '../features/marketing/components/TestimonialsSection'
import { VideoLibrarySection } from '../features/marketing/components/VideoLibrarySection'
import { WellbeingSection } from '../features/marketing/components/WellbeingSection'

/**
 * The KIN Wellness landing page.
 *
 * Also the site's entry point — `/` redirects here in App.tsx — so this is
 * both "about us" and the front page. Every section is its own component
 * under features/marketing, for two reasons: seventeen sections inline would
 * be an 800-line file nobody edits confidently, and if Home and About are
 * later split into separate routes the split is a matter of moving lines in
 * this list rather than carving up a monolith.
 *
 * The order below is the page. Section ids are the anchor targets used by the
 * in-page CTAs and by the footer's quick links.
 */
export function AboutPage() {
  return (
    <main className="kin-page">
      <HeroSection />
      <WellbeingSection />
      <ApproachSection />
      <AyurvedaSection />
      <CareAreasSection />
      <DietLifestyleSection />
      <LifestyleSection />
      <PersonalYogaSection />
      <JourneySection />
      <ProgramsSection />
      <PractitionerSection />
      <OnlineConsultationSection />
      <JournalSection />
      <VideoLibrarySection />
      <FreeGuideSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </main>
  )
}
