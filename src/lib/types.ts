
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon: string;
  description: string;
  tags: string[];
  createdAt: string;
  lastVisited: string | null;
  collectionId: string | null;
  isArchived: boolean;
  isReadLater: boolean;
  visitCount: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bookmarkCount: number;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  bookmarkCount: number;
}

export interface AnalyticsData {
  mostVisited: Bookmark[];
  recentlyAdded: Bookmark[];
  byDomain: { domain: string; count: number }[];
  byTime: { time: string; count: number }[];
}
