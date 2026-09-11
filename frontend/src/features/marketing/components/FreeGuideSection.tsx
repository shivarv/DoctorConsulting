import { SectionHeading } from './SectionHeading'

export function FreeGuideSection() {
  return (
    <section className="kin-section kin-section--tinted" id="free-guide">
      <div className="kin-guide">
        <SectionHeading eyebrow="Free wellness resource" title="Start your KIN journey." />
        <p className="kin-lead">
          Download our free KIN Daily Wellness Guide and discover simple practices for
          food, sleep, movement, stress and everyday wellbeing.
        </p>

        {/* Text, not a button. There is no guide file and no email capture yet,
            so anything clickable here would either 404 or do nothing — worse
            than plainly not offering it. Swap this span for a <Link> or an <a
            download> once the PDF and its form exist. */}
        <span className="kin-guide__cta">Get the free guide</span>
      </div>
    </section>
  )
}
