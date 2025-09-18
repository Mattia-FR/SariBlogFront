export type Illustration = {
  id: number;
  title: string;
  image: string;
  alt_text: string;
  description?: string;
  created_at?: string;
};

export type IllustrationCardProps = {
  illustration: Illustration;
  isClickable?: boolean;
};

export type GalleryPreviewProps = {
  illustrations: Illustration[];
  title?: string;
};
