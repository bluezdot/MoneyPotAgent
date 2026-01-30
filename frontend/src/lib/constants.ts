// Brand color constants for MoneyPot
export const BRAND_COLOR = '#c8ff00'
export const BRAND_COLOR_HOVER = '#d4ff33'
export const BRAND_COLOR_RGB = '200, 255, 0'

// Helper for creating RGBA versions
export function brandColorOpacity(opacity: number): string {
  return `rgba(${BRAND_COLOR_RGB}, ${opacity})`
}
