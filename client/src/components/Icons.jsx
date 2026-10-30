const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...base}><path d="M7 17 17 7M8 7h9v9" /></svg>
)
export const ArrowDown = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...base}><path d="M12 5v14M6 13l6 6 6-6" /></svg>
)
export const Download = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...base}><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></svg>
)
export const Camera = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...base}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
)
export const Star = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path d="M12 0c.8 7 5 11.2 12 12-7 .8-11.200 5-12 12-.8-7-5-11.200-12-12C7 11.200 11.200 7 12 0z" fill="currentColor" />
  </svg>
)
