export type About = {
  id: number;
  content: string;
  image: string | null;
  updated_at: string;
};

export type AboutPreviewProps = {
  about: About;
};
