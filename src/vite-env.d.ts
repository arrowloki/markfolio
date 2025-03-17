
/// <reference types="vite/client" />

// Chrome extension types
interface Chrome {
  bookmarks: {
    create: (bookmark: { parentId?: string, title: string, url: string }, callback?: (result: any) => void) => void;
    getTree: (callback: (bookmarkTreeNodes: chrome.bookmarks.BookmarkTreeNode[]) => void) => void;
    onCreated: {
      addListener: (callback: (id: string, bookmark: chrome.bookmarks.BookmarkTreeNode) => void) => void;
    };
    onRemoved: {
      addListener: (callback: (id: string, removeInfo: any) => void) => void;
    };
    onChanged: {
      addListener: (callback: (id: string, changeInfo: any) => void) => void;
    };
  };
  runtime: {
    lastError?: { message: string };
    id?: string;
    sendMessage: (message: any, responseCallback?: (response: any) => void) => void;
    onMessage: {
      addListener: (callback: (request: any, sender: any, sendResponse: any) => void) => void;
    };
  };
  tabs: {
    onUpdated: {
      addListener: (callback: (tabId: number, changeInfo: any, tab: any) => void) => void;
    };
  };
}

declare namespace chrome {
  namespace bookmarks {
    interface BookmarkTreeNode {
      id: string;
      parentId?: string;
      index?: number;
      url?: string;
      title: string;
      dateAdded?: number;
      dateGroupModified?: number;
      children?: BookmarkTreeNode[];
    }
  }
}

interface Window {
  chrome?: Chrome;
}

declare const chrome: Chrome;

