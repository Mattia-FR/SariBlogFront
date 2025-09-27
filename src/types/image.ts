export type ImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  tabIndex?: number;
};
