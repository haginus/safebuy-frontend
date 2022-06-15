export type Asset = {
  id?: string;
  type: 'link';
  link: string;
} | {
  id?: string;
  type: 'file';
  name: string;
  mimeType: string;
  content: string;
}