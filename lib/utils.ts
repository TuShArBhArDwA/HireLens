/**
 * Converts a Cloudinary upload URL to a browser-viewable inline URL.
 * Prevents forced file downloads by stripping the raw/auto resource type
 * and injecting the fl_attachment:false flag.
 */
export function getInlineUrl(url: string): string {
  if (!url) return url;
  return url
    .replace('/raw/upload/', '/image/upload/fl_attachment:false/')
    .replace('/auto/upload/', '/image/upload/fl_attachment:false/');
}
