interface SectionHeadingProps {
  /** The small uppercase label above the title, e.g. "OUR APPROACH". */
  eyebrow?: string
  title: string
}

/**
 * The eyebrow-plus-title pair every section opens with.
 *
 * Body copy is deliberately not a prop: sections carry anywhere from one
 * paragraph to a paragraph, a list and a refrain, and threading that through
 * as props would be more awkward than writing it in each section.
 */
export function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <>
      {eyebrow && <span className="kin-eyebrow">{eyebrow}</span>}
      <h2 className="kin-heading">{title}</h2>
    </>
  )
}
