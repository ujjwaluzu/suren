import { brand } from '@/config/brand';
import type { CSSProperties } from 'react';

const cream = '#f1ead6';
const electric = '#c6ff35';
const letters = [
  'M64 0H12L0 12V38L12 50H48V66H0V80H52L64 68V42L52 30H16V14H64Z',
  'M0 0H16V60L22 66H42L48 60V0H64V66L50 80H14L0 66Z',
  'M0 80V0H50L64 14V34L52 46L69 80H51L35 48H16V80ZM16 14V34H43L48 29V19L43 14Z',
  'M0 0H60V14H16V32H53V46H16V66H60V80H0Z',
  'M0 80V0H16L48 52V0H64V80H48L16 28V80Z',
];

function StructuralMark() {
  return (
    <g>
      <path fill={cream} d="M104 0H24L0 24V62L24 86H58L34 62H26V32L32 26H104Z" />
      <path fill={electric} d="M0 120H80L104 96V58L80 34H46L70 58H78V88L72 94H0Z" />
    </g>
  );
}

export function Symbol({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="30"
      height="32"
      viewBox="0 0 104 120"
      fill="none"
      aria-hidden="true"
    >
      {StructuralMark()}
    </svg>
  );
}
export function Wordmark({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      className={`brand-wordmark ${className}`}
      style={style}
      width="680"
      height="150"
      viewBox="0 0 680 150"
      fill="none"
      role="img"
      aria-label={brand.name}
    >
      <g transform="translate(12 15)">
        {StructuralMark()}
      </g>
      <g transform="translate(165 35) scale(1.23)" fill={cream} fillRule="evenodd">
        {letters.map((d, index) => (
          <path key={d} transform={`translate(${index * 83} 0)`} d={d} />
        ))}
      </g>
    </svg>
  );
}
