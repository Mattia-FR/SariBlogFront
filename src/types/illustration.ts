export type Illustration = {
  id: number;
  title: string;
  image: string;
  alt_text: string;
};

export type IllustrationCardProps = {
  illustration: Illustration;
};

export type GalleryPreviewProps = {
  illustrations: Illustration[];
  title?: string;
};
