const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/**
 * "2026-09-03" -> "3 Sep". Parsed by splitting rather than `new Date`, which
 * reads a bare ISO date as UTC midnight and can shift the day by one.
 */
export function formatDayLabel(iso: string): string {
  const [, month, day] = iso.split('-')
  return `${Number(day)} ${MONTHS[Number(month) - 1]}`
}
