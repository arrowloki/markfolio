import { Bookmark, Collection, Tag, AnalyticsData } from './types';

// Mock data - this will be replaced with Chrome API in the actual extension
const mockBookmarks: Bookmark[] = [
  {
    id: '1',
    title: 'GitHub: Where the world builds software',
    url: 'https://github.com',
    favicon: 'https://github.githubassets.com/favicons/favicon.svg',
    description: 'GitHub is where over 65 million developers shape the future of software.',
    tags: ['dev', 'code', 'git'],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    lastVisited: new Date(Date.now() - 86400000 * 2).toISOString(),
    collectionId: '1',
    isArchived: false,
    isReadLater: false,
    visitCount: 42
  },
  {
    id: '2',
    title: 'Stack Overflow - Where Developers Learn, Share, & Build Careers',
    url: 'https://stackoverflow.com',
    favicon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
    description: 'Stack Overflow is the largest, most trusted online community for developers to learn and share their knowledge.',
    tags: ['dev', 'qa', 'community'],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    lastVisited: new Date(Date.now() - 86400000 * 1).toISOString(),
    collectionId: '1',
    isArchived: false,
    isReadLater: false,
    visitCount: 37
  },
  {
    id: '3',
    title: 'Medium – Where good ideas find you',
    url: 'https://medium.com',
    favicon: 'https://miro.medium.com/v2/1*m-R_BkNf1Qjr1YbyOIJY2w.png',
    description: 'Medium is an open platform where readers find dynamic thinking, and where expert and undiscovered voices can share their writing.',
    tags: ['reading', 'articles', 'blog'],
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    lastVisited: null,
    collectionId: null,
    isArchived: false,
    isReadLater: true,
    visitCount: 8
  },
  {
    id: '4',
    title: 'Netflix - Watch TV Shows & Movies Online',
    url: 'https://netflix.com',
    favicon: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico',
    description: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries.',
    tags: ['entertainment', 'streaming', 'movies'],
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    lastVisited: new Date(Date.now() - 86400000 * 3).toISOString(),
    collectionId: '2',
    isArchived: false,
    isReadLater: false,
    visitCount: 23
  },
  {
    id: '5',
    title: 'Spotify - Music for everyone',
    url: 'https://spotify.com',
    favicon: 'https://www.scdn.co/i/_global/favicon.png',
    description: 'Spotify is a digital music service that gives you access to millions of songs.',
    tags: ['music', 'entertainment', 'streaming'],
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    lastVisited: new Date(Date.now() - 86400000 * 4).toISOString(),
    collectionId: '2',
    isArchived: false,
    isReadLater: false,
    visitCount: 19
  },
  {
    id: '6',
    title: 'The New York Times - Breaking News',
    url: 'https://nytimes.com',
    favicon: 'https://www.nytimes.com/vi-assets/static-assets/favicon-4bf96cb6a1093748bf5b3c429accb9b4.ico',
    description: 'Live news, investigations, opinion, photos and video by the journalists of The New York Times from more than 150 countries around the world.',
    tags: ['news', 'articles', 'reading'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    lastVisited: null,
    collectionId: null,
    isArchived: false,
    isReadLater: true,
    visitCount: 3
  }
];

const mockCollections: Collection[] = [
  {
    id: '1',
    name: 'Development',
    description: 'Coding and development resources',
    icon: 'Code',
    color: 'blue',
    bookmarkCount: 2,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: '2',
    name: 'Entertainment',
    description: 'Movies, music and fun',
    icon: 'Film',
    color: 'purple',
    bookmarkCount: 2,
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString()
  },
  {
    id: '3',
    name: 'Work',
    description: 'Professional resources',
    icon: 'Briefcase',
    color: 'green',
    bookmarkCount: 0,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
  }
];

// Check if we're running in a Chrome extension context
const isExtension = (): boolean => {
  return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
};

// Get all bookmarks
export const getBookmarks = (): Promise<Bookmark[]> | Bookmark[] => {
  if (!isExtension()) {
    return [...mockBookmarks];
  }
  
  return new Promise((resolve) => {
    if (chrome && chrome.bookmarks) {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        const bookmarks: Bookmark[] = [];
        
        // Recursive function to flatten bookmark tree
        const processNode = (node: chrome.bookmarks.BookmarkTreeNode) => {
          // Only process nodes with URLs (actual bookmarks, not folders)
          if (node.url) {
            bookmarks.push({
              id: node.id,
              title: node.title || extractDomain(node.url),
              url: node.url,
              favicon: `https://www.google.com/s2/favicons?domain=${node.url}&sz=128`,
              description: '', // Chrome API doesn't provide descriptions
              tags: [], // Chrome API doesn't have tags, could infer from folder structure
              createdAt: node.dateAdded ? new Date(node.dateAdded).toISOString() : new Date().toISOString(),
              lastVisited: null, // Chrome API doesn't track this
              collectionId: node.parentId || null,
              isArchived: false,
              isReadLater: false,
              visitCount: 0
            });
          }
          
          // Process children recursively
          if (node.children) {
            node.children.forEach(processNode);
          }
        };
        
        // Start processing from the root
        bookmarkTreeNodes.forEach(processNode);
        resolve(bookmarks);
      });
    } else {
      console.warn('Chrome bookmarks API not available, using mock data');
      resolve([...mockBookmarks]);
    }
  });
};

// Get bookmarks by collection
export const getBookmarksByCollection = (collectionId: string | null): Promise<Bookmark[]> | Bookmark[] => {
  if (!isExtension()) {
    return mockBookmarks.filter(bookmark => bookmark.collectionId === collectionId && !bookmark.isArchived);
  }
  
  return new Promise((resolve) => {
    getBookmarks().then((allBookmarks) => {
      if (Array.isArray(allBookmarks)) {
        resolve(allBookmarks.filter(bookmark => bookmark.collectionId === collectionId && !bookmark.isArchived));
      } else {
        allBookmarks.then(bookmarks => {
          resolve(bookmarks.filter(bookmark => bookmark.collectionId === collectionId && !bookmark.isArchived));
        });
      }
    }).catch(() => {
      resolve(mockBookmarks.filter(bookmark => bookmark.collectionId === collectionId && !bookmark.isArchived));
    });
  });
};

// Get reading list (saved for later)
export const getReadingList = (): Bookmark[] => {
  return mockBookmarks.filter(bookmark => bookmark.isReadLater && !bookmark.isArchived);
};

// Get all collections
export const getCollections = (): Promise<Collection[]> | Collection[] => {
  if (!isExtension()) {
    return [...mockCollections];
  }
  
  return new Promise((resolve) => {
    if (chrome && chrome.bookmarks) {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        const collections: Collection[] = [];
        
        const processNode = (node: chrome.bookmarks.BookmarkTreeNode) => {
          // Only process folders (nodes with children but no URL)
          if (node.children && !node.url) {
            // Skip the root node and bookmarks bar/other bookmarks default folders
            if (node.id !== '0' && node.id !== '1' && node.id !== '2') {
              collections.push({
                id: node.id,
                name: node.title,
                description: '',
                icon: 'Folder',
                color: generateRandomColor(),
                bookmarkCount: node.children.filter(child => !!child.url).length,
                createdAt: node.dateAdded ? new Date(node.dateAdded).toISOString() : new Date().toISOString()
              });
            }
            
            // Process child folders recursively
            node.children.forEach(processNode);
          }
        };
        
        bookmarkTreeNodes.forEach(processNode);
        resolve(collections);
      });
    } else {
      console.warn('Chrome bookmarks API not available, using mock data');
      resolve([...mockCollections]);
    }
  });
};

const generateRandomColor = (): string => {
  const colors = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'orange', 'teal'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Get collection by ID
export const getCollectionById = (id: string): Promise<Collection | undefined> | Collection | undefined => {
  if (!isExtension()) {
    return mockCollections.find(collection => collection.id === id);
  }
  
  return new Promise((resolve) => {
    getCollections().then((collections) => {
      if (Array.isArray(collections)) {
        resolve(collections.find(collection => collection.id === id));
      } else {
        collections.then(cols => {
          resolve(cols.find(collection => collection.id === id));
        });
      }
    }).catch(() => {
      resolve(mockCollections.find(collection => collection.id === id));
    });
  });
};

// Search bookmarks
export const searchBookmarks = (query: string): Promise<Bookmark[]> | Bookmark[] => {
  const lowerQuery = query.toLowerCase();
  
  if (!isExtension()) {
    return mockBookmarks.filter(
      bookmark => 
        !bookmark.isArchived && 
        (bookmark.title.toLowerCase().includes(lowerQuery) || 
         bookmark.url.toLowerCase().includes(lowerQuery) || 
         bookmark.description.toLowerCase().includes(lowerQuery) ||
         bookmark.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }
  
  return new Promise((resolve) => {
    getBookmarks().then((bookmarks) => {
      if (Array.isArray(bookmarks)) {
        resolve(bookmarks.filter(
          bookmark => 
            !bookmark.isArchived && 
            (bookmark.title.toLowerCase().includes(lowerQuery) || 
             bookmark.url.toLowerCase().includes(lowerQuery) || 
             bookmark.description.toLowerCase().includes(lowerQuery) ||
             bookmark.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        ));
      } else {
        bookmarks.then(bms => {
          resolve(bms.filter(
            bookmark => 
              !bookmark.isArchived && 
              (bookmark.title.toLowerCase().includes(lowerQuery) || 
               bookmark.url.toLowerCase().includes(lowerQuery) || 
               bookmark.description.toLowerCase().includes(lowerQuery) ||
               bookmark.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
          ));
        });
      }
    }).catch(() => {
      resolve(mockBookmarks.filter(
        bookmark => 
          !bookmark.isArchived && 
          (bookmark.title.toLowerCase().includes(lowerQuery) || 
           bookmark.url.toLowerCase().includes(lowerQuery) || 
           bookmark.description.toLowerCase().includes(lowerQuery) ||
           bookmark.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      ));
    });
  });
};

// Get tags
export const getTags = (): Tag[] => {
  const tagMap = new Map<string, number>();
  
  mockBookmarks.forEach(bookmark => {
    if (!bookmark.isArchived) {
      bookmark.tags.forEach(tag => {
        const count = tagMap.get(tag) || 0;
        tagMap.set(tag, count + 1);
      });
    }
  });
  
  return Array.from(tagMap.entries()).map(([name, count]) => ({
    id: name,
    name,
    bookmarkCount: count
  }));
};

// Extract domain from URL
export const extractDomain = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace('www.', '');
  } catch (error) {
    return url;
  }
};

// Format date
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

// Get analytics data
export const getAnalyticsData = (): AnalyticsData => {
  const nonArchivedBookmarks = mockBookmarks.filter(bookmark => !bookmark.isArchived);
  
  // Most visited
  const mostVisited = [...nonArchivedBookmarks]
    .sort((a, b) => b.visitCount - a.visitCount)
    .slice(0, 5);
  
  // Recently added
  const recentlyAdded = [...nonArchivedBookmarks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // By domain
  const domainMap = new Map<string, number>();
  nonArchivedBookmarks.forEach(bookmark => {
    const domain = extractDomain(bookmark.url);
    const count = domainMap.get(domain) || 0;
    domainMap.set(domain, count + 1);
  });
  
  const byDomain = Array.from(domainMap.entries())
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // By time (mock data for demonstration)
  const byTime = [
    { time: 'Morning', count: 12 },
    { time: 'Afternoon', count: 18 },
    { time: 'Evening', count: 25 },
    { time: 'Night', count: 8 }
  ];
  
  return {
    mostVisited,
    recentlyAdded,
    byDomain,
    byTime
  };
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
