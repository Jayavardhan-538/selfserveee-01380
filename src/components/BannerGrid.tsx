import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CampaignData } from '@/contexts/CampaignContext';

interface Banner {
  id: string;
  name: string;
  size: string;
  type: string;
  vertical: string;
  preview: string;
  animated: boolean;
}

const mockBanners: Banner[] = [
  {
    id: '1',
    name: 'Tech Product Showcase',
    size: '300x250',
    type: 'Animated Banner',
    vertical: 'Technology',
    preview: '/api/placeholder/300/250?text=Tech+Banner+1',
    animated: true,
  },
  {
    id: '2',
    name: 'Fashion Collection',
    size: '728x90',
    type: 'Static Banner',
    vertical: 'Fashion',
    preview: '/api/placeholder/728/90?text=Fashion+Banner',
    animated: false,
  },
  {
    id: '3',
    name: 'Food Delivery Ad',
    size: '320x50',
    type: 'Mobile Banner',
    vertical: 'Food & Beverage',
    preview: '/api/placeholder/320/50?text=Food+Mobile',
    animated: true,
  },
  {
    id: '4',
    name: 'Healthcare Campaign',
    size: '160x600',
    type: 'Skyscraper',
    vertical: 'Healthcare',
    preview: '/api/placeholder/160/600?text=Health+Sky',
    animated: false,
  },
  {
    id: '5',
    name: 'Finance Dashboard',
    size: '970x250',
    type: 'Leaderboard',
    vertical: 'Finance',
    preview: '/api/placeholder/970/250?text=Finance+Leader',
    animated: true,
  },
  {
    id: '6',
    name: 'Travel Experience',
    size: '600x400',
    type: 'Rich Media',
    vertical: 'Travel',
    preview: '/api/placeholder/600/400?text=Travel+Rich',
    animated: true,
  },
  {
    id: '7',
    name: 'Education Platform',
    size: '300x250',
    type: 'Interactive',
    vertical: 'Education',
    preview: '/api/placeholder/300/250?text=Education+Inter',
    animated: false,
  },
  {
    id: '8',
    name: 'Entertainment Hub',
    size: '728x90',
    type: 'Video Ad',
    vertical: 'Entertainment',
    preview: '/api/placeholder/728/90?text=Entertainment+Video',
    animated: true,
  },
  {
    id: '9',
    name: 'Mobile App Promo',
    size: '320x50',
    type: 'Native Ad',
    vertical: 'Technology',
    preview: '/api/placeholder/320/50?text=Mobile+Native',
    animated: false,
  },
];

interface BannerGridProps {
  searchQuery: string;
  formData: Partial<CampaignData>;
}

export const BannerGrid: React.FC<BannerGridProps> = ({ searchQuery, formData }) => {
  const [filteredBanners, setFilteredBanners] = useState<Banner[]>(mockBanners);

  useEffect(() => {
    let filtered = mockBanners;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(banner =>
        banner.name.toLowerCase().includes(query) ||
        banner.size.toLowerCase().includes(query) ||
        banner.type.toLowerCase().includes(query) ||
        banner.vertical.toLowerCase().includes(query) ||
        (banner.animated && query.includes('animated')) ||
        (!banner.animated && query.includes('static'))
      );
    }

    // Filter by form data
    if (formData.vertical && formData.vertical.length > 0) {
      filtered = filtered.filter(banner =>
        formData.vertical!.some(v => banner.vertical.includes(v))
      );
    }

    if (formData.adSize && formData.adSize.length > 0) {
      filtered = filtered.filter(banner =>
        formData.adSize!.includes(banner.size)
      );
    }

    if (formData.type && formData.type.length > 0) {
      filtered = filtered.filter(banner =>
        banner.type.includes(formData.type!)
      );
    }

    setFilteredBanners(filtered);
  }, [searchQuery, formData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredBanners.length} of {mockBanners.length} templates
        </p>
        {(searchQuery || formData.vertical?.length || formData.adSize?.length || formData.type?.length) && (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Filtered
          </Badge>
        )}
      </div>

      {filteredBanners.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or form selections
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBanners.map((banner) => (
            <Card key={banner.id} className="glass p-4 banner-hover cursor-pointer group">
              <div className="relative mb-4">
                <div className="aspect-video bg-background/10 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={banner.preview}
                    alt={banner.name}
                    className="w-full h-full object-contain transition-transform group-hover:scale-105"
                  />
                  {banner.animated && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 text-xs">
                        ⚡ Animated
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{banner.name}</h4>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{banner.size}</span>
                  <Badge variant="outline" className="text-xs">
                    {banner.vertical}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{banner.type}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredBanners.length > 0 && (
        <div className="text-center pt-6">
          <p className="text-sm text-muted-foreground">
            Click "Proceed to Templates" above to continue with your campaign setup
          </p>
        </div>
      )}
    </div>
  );
};