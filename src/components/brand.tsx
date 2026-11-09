import { brand } from '@/config/brand';
export function Symbol({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="30"
      height="32"
      viewBox="0 0 30 32"
      fill="none"
      aria-hidden="true"
    >
      <path d="M28 2H2v17h20v5H2v6h26V13H8V8h20V2Z" fill="currentColor" />
    </svg>
  );
}
export function Wordmark({ className = '' }: { className?: string }) {
  return <span className={`editorial-wordmark ${className}`}>{brand.name}</span>;
}
