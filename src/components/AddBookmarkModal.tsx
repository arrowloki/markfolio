
import React, { useState, useEffect } from 'react';
import { X, Bookmark, Link2, Tag } from 'lucide-react';
import { Collection } from '../lib/types';
import { getCollections, extractDomain } from '../lib/bookmarkHelpers';

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBookmark: (data: any) => void;
}

export const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({
  isOpen,
  onClose,
  onAddBookmark
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isReadLater, setIsReadLater] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setCollections(getCollections());
    }
  }, [isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBookmark = {
      url,
      title: title || extractDomain(url),
      description,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      collectionId: collectionId || null,
      isReadLater
    };
    
    onAddBookmark(newBookmark);
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setUrl('');
    setTitle('');
    setDescription('');
    setTags('');
    setCollectionId('');
    setIsReadLater(false);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-card max-w-md w-full rounded-xl overflow-hidden shadow-elevation animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-medium flex items-center">
            <Bookmark className="h-5 w-5 mr-2 text-primary" />
            Add Bookmark
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium mb-1">
                URL <span className="text-destructive">*</span>
              </label>
              <div className="glass-input flex items-center rounded-lg pr-3 focus-within:ring-2 focus-within:ring-ring transition-all">
                <div className="pl-3 flex items-center pointer-events-none">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <input 
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="block w-full bg-transparent border-none focus:outline-none focus:ring-0 py-2.5 pl-2 text-sm"
                  placeholder="https://example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <input 
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full glass-input rounded-lg px-3 py-2.5 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                placeholder="Website title"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full glass-input rounded-lg px-3 py-2.5 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring transition-all min-h-[80px] resize-none"
                placeholder="Add a description..."
              />
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-1">
                Tags
              </label>
              <div className="glass-input flex items-center rounded-lg pr-3 focus-within:ring-2 focus-within:ring-ring transition-all">
                <div className="pl-3 flex items-center pointer-events-none">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </div>
                <input 
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="block w-full bg-transparent border-none focus:outline-none focus:ring-0 py-2.5 pl-2 text-sm"
                  placeholder="Enter tags separated by commas"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Separate tags with commas (e.g., work, reference, design)
              </p>
            </div>
            
            <div>
              <label htmlFor="collection" className="block text-sm font-medium mb-1">
                Collection
              </label>
              <select
                id="collection"
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="block w-full glass-input rounded-lg px-3 py-2.5 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none"
              >
                <option value="">No collection</option>
                {collections.map(collection => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                id="readLater"
                type="checkbox"
                checked={isReadLater}
                onChange={(e) => setIsReadLater(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-ring"
              />
              <label htmlFor="readLater" className="ml-2 block text-sm">
                Add to reading list
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-colors"
            >
              Save Bookmark
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
