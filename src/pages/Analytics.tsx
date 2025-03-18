
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { getAnalyticsData } from '../lib/bookmarkHelpers';
import { BookmarkCard } from '../components/BookmarkCard';
import { BarChart, PieChart, Activity, Calendar, ArrowUpRight } from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { AnalyticsData } from '../lib/types';
import { useToast } from '@/hooks/use-toast';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getAnalyticsData();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast({
          title: "Error loading analytics",
          description: "There was a problem loading your analytics data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [toast]);
  
  const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#EC4899'];
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
            Insights
          </span>
          <h1 className="text-3xl font-display font-bold mt-2">Your Analytics</h1>
          <p className="text-muted-foreground mt-2">Get insights about your browsing habits.</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : analyticsData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-primary" />
                    Most Visited
                  </h2>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    Last 30 days
                  </span>
                </div>
                
                <div className="space-y-4">
                  {analyticsData.mostVisited.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No data available.</p>
                  ) : (
                    analyticsData.mostVisited.map((bookmark, index) => (
                      <div key={bookmark.id} className="flex items-center">
                        <span className="w-6 text-sm text-muted-foreground">{index + 1}.</span>
                        <div className="flex-1 truncate">
                          <a 
                            href={bookmark.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm hover:underline truncate"
                          >
                            {bookmark.title}
                          </a>
                        </div>
                        <span className="ml-2 text-sm font-medium">
                          {bookmark.visitCount} visits
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Recently Added
                  </h2>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    Last 30 days
                  </span>
                </div>
                
                <div className="space-y-4">
                  {analyticsData.recentlyAdded.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No data available.</p>
                  ) : (
                    analyticsData.recentlyAdded.map((bookmark, index) => (
                      <div key={bookmark.id} className="flex items-center">
                        <span className="w-6 text-sm text-muted-foreground">{index + 1}.</span>
                        <div className="flex-1 truncate">
                          <a 
                            href={bookmark.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm hover:underline truncate"
                          >
                            {bookmark.title}
                          </a>
                        </div>
                        <span className="ml-2 text-sm font-medium">
                          <ArrowUpRight className="h-4 w-4 text-green-500 inline-block mr-1" />
                          New
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-primary" />
                    By Domain
                  </h2>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    Top 5
                  </span>
                </div>
                
                <div className="h-60">
                  {analyticsData.byDomain.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No data available.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={analyticsData.byDomain}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="domain"
                          label={({ domain, percent }) => `${domain} (${(percent * 100).toFixed(0)}%)`}
                          labelLine={false}
                        >
                          {analyticsData.byDomain.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value, name, props) => [`${value} bookmarks`, props.payload.domain]} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    By Time of Day
                  </h2>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    Last 7 days
                  </span>
                </div>
                
                <div className="h-60">
                  {analyticsData.byTime.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No data available.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={analyticsData.byTime}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <XAxis dataKey="time" />
                        <YAxis />
                        <RechartsTooltip formatter={(value) => [`${value} bookmarks`, 'Visits']} />
                        <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Bookmark Insights</h2>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                  Auto-generated
                </span>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground">
                  Based on your bookmarking patterns, you're most interested in development and 
                  entertainment content. You tend to bookmark most frequently in the evening, 
                  and you often visit GitHub and Stack Overflow.
                </p>
                
                <p className="text-muted-foreground mt-3">
                  Consider organizing your entertainment bookmarks into a dedicated collection 
                  for easier access and management.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="glass-card rounded-xl p-6">
            <p className="text-muted-foreground">No analytics data available.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;
