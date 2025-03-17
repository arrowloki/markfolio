
// This script runs in the context of web pages
// It can be used to extract metadata for bookmarks

document.addEventListener('DOMContentLoaded', () => {
  const pageMetadata = {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content || '',
    url: window.location.href,
    faviconUrl: `${window.location.origin}/favicon.ico`
  };
  
  // Send metadata to the extension
  chrome.runtime.sendMessage({
    action: 'captureMetadata',
    data: pageMetadata
  });
});
