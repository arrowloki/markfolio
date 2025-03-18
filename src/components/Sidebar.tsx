
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bookmark, BookmarkPlus, LayoutGrid, BarChart, Settings, BookOpen, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getCollections } from '../lib/bookmarkHelpers';
import { Collection } from '../lib/types';
import { useToast } from '@/hooks/use-toast';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const result = await getCollections();
        setCollections(result);
      } catch (error) {
        console.error('Error fetching collections:', error);
        toast({
          title: "Error loading collections",
          description: "There was a problem loading your collections.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCollections();
  }, [toast]);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div 
      className={`bg-white dark:bg-gray-900 border-r border-border h-screen transition-all duration-300 ease-in-out flex flex-col relative ${
        isCollapsed ? 'w-[60px]' : 'w-[220px]'
      }`}
    >
      <div className="flex items-center p-3 h-14 border-b border-border">
        {!isCollapsed && (
          <h1 className="text-base font-semibold flex items-center space-x-2">
            <Bookmark className="h-4 w-4 text-primary" />
            <span className="animate-fade-in">Markfolio</span>
          </h1>
        )}
        {isCollapsed && <Bookmark className="h-4 w-4 text-primary mx-auto" />}
      </div>
      
      <div className="flex-1 py-3 overflow-y-auto no-scrollbar">
        <nav className="space-y-1 px-2">
          <NavItem 
            to="/" 
            icon={<BookmarkPlus className="h-4 w-4" />} 
            label="All Bookmarks" 
            isCollapsed={isCollapsed} 
            isActive={location.pathname === '/' || location.hash === '#/'}
          />
          <NavItem 
            to="/collections" 
            icon={<LayoutGrid className="h-4 w-4" />} 
            label="Collections" 
            isCollapsed={isCollapsed} 
            isActive={location.pathname === '/collections' || location.hash === '#/collections'}
          />
          <NavItem 
            to="/reading-list" 
            icon={<BookOpen className="h-4 w-4" />} 
            label="Reading List" 
            isCollapsed={isCollapsed} 
            isActive={location.pathname === '/reading-list' || location.hash === '#/reading-list'}
          />
          <NavItem 
            to="/analytics" 
            icon={<BarChart className="h-4 w-4" />} 
            label="Analytics" 
            isCollapsed={isCollapsed} 
            isActive={location.pathname === '/analytics' || location.hash === '#/analytics'}
          />
          
          {!isCollapsed && !loading && (
            <div className="mt-5 mb-2">
              <div className="flex items-center justify-between px-2 py-1">
                <h2 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                  Collections
                </h2>
                <button 
                  className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground transition-colors"
                  aria-label="Add collection"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              
              <div className="mt-1 space-y-1">
                {collections.map(collection => (
                  <NavItem 
                    key={collection.id}
                    to={`/collections/${collection.id}`}
                    label={collection.name}
                    isCollapsed={isCollapsed}
                    isActive={location.pathname === `/collections/${collection.id}` || location.hash === `#/collections/${collection.id}`}
                    icon={<div className={`h-3 w-3 rounded-full bg-${collection.color}-500`} />}
                    chip={collection.bookmarkCount > 0 ? collection.bookmarkCount.toString() : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>
      
      <div className="border-t border-border p-2">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-1 h-8 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
  chip?: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isCollapsed, isActive, chip }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-2 py-2 rounded-md transition-all group ${
        isActive 
          ? 'bg-secondary text-foreground font-medium' 
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
      }`}
    >
      <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
        {icon}
      </div>
      
      {!isCollapsed && (
        <div className="ml-2 flex-1 flex items-center justify-between">
          <span className="truncate text-sm">{label}</span>
          {chip && (
            <span className="ml-auto rounded-full text-xs bg-background px-1.5 py-0.5">
              {chip}
            </span>
          )}
        </div>
      )}
    </Link>
  );
};
