/**
 * Converts a Cloudinary URL to use the raw resource type.
 * This ensures the URL serves actual file bytes that Google Docs Viewer can render.
 * Handles URLs that may have been stored with /image/upload/ or /auto/upload/.
 */
export function getRawUrl(url: string): string {
  if (!url) return url;
  return url
    .replace('/image/upload/', '/raw/upload/')
    .replace('/auto/upload/', '/raw/upload/');
}

/**
 * Wraps a file URL in Google Docs Viewer for inline PDF viewing.
 */
export function getViewerUrl(url: string): string {
  if (!url) return url;
  const rawUrl = getRawUrl(url);
  return `https://docs.google.com/gview?url=${encodeURIComponent(rawUrl)}&embedded=true`;
}
