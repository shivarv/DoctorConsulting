interface BrandMarkProps {
  className?: string
}

/**
 * The KIN Wellness chevron.
 *
 * Two of the thirteen paths in src/assets/logo.svg — that file is a trace of
 * the full lockup, chevron above the words "KIN WELLNESS", and the header and
 * footer both already render that name as text beside this. The remaining
 * eleven paths are the letterforms, dropped here so the name is not shown
 * twice.
 *
 * Inline rather than an <img src={logo}>: the mark has to recolour with the
 * theme (index.css redefines --accent under prefers-color-scheme: dark), and a
 * referenced image cannot inherit currentColor. Being inline also means no
 * second request for something this small, and no flash of empty space beside
 * the wordmark while it loads.
 *
 * The viewBox is the chevron's bounding box — x 437-774, y 365-690 — squared
 * off around its centre and padded slightly, so the glyph fills the box it is
 * given instead of floating in the original 1254x1254 canvas, which is roughly
 * two-thirds empty.
 *
 * aria-hidden because every place this renders puts "KIN Wellness" in text
 * next to it; announcing it again would just be a duplicate.
 */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="433 355 345 345"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {/* The 0.1 scale and negated y are potrace's output convention, kept as
          emitted so these paths stay diffable against the original trace. */}
      <g transform="translate(0,1254) scale(0.1,-0.1)">
        <path
          d="
            M5573 8757 c-137 -139 -428 -438 -728 -747 -99 -102 -246 -252 -327 -335 l-148
            -150 0 -315 0 -315 52 55 c72 76 555 578 767 795 97 100 331 341 521 535 189 195
            398 409 462 475 65 67 118 124 118 128 0 3 -132 6 -294 6 l-293 0 -130 -132z
          "
        />
        <path
          d="
            M7096 8838 c-132 -135 -424 -437 -771 -798 -380 -395 -439 -456 -1110 -1143 -198
            -203 -360 -375 -360 -383 0 -7 121 -139 270 -291 148 -153 335 -346 415 -429 l145
            -151 303 -2 c194 -1 302 3 300 9 -1 5 -185 199 -408 431 -223 232 -405 425 -405
            429 0 10 101 119 266 286 l139 141 113 -116 c114 -117 264 -273 458 -476 58 -60
            235 -244 394 -407 l288 -298 305 0 305 0 -74 78 c-40 42 -213 221 -384 397 -527
            544 -801 829 -982 1022 l-122 130 36 39 c38 41 192 200 463 479 91 94 316 325 500
            515 184 190 385 397 447 461 62 63 113 118 113 122 0 4 -133 7 -296 7 l-297 0 -51
            -52z
          "
        />
      </g>
    </svg>
  )
}
