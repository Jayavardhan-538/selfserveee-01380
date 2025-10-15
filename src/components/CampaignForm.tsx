import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CampaignData } from '@/contexts/CampaignContext';

interface CampaignFormProps {
  data: Partial<CampaignData>;
  onChange: (data: Partial<CampaignData>) => void;
  onProceed: () => void;
}

const verticalOptions = ['Technology', 'Fashion', 'Food & Beverage', 'Healthcare', 'Finance', 'Travel', 'Education', 'Entertainment'];
const languageOptions = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese'];
const adSizeOptions = ['300x250', '728x90', '320x50', '160x600', '970x250', '600x400', '800x600'];
const typeOptions = ['Animated Banner', 'Static Banner', 'Interstitial', 'Video Ad', 'Native Ad', 'Rich Media'];

export const CampaignForm: React.FC<CampaignFormProps> = ({ data, onChange, onProceed }) => {
  const ctr = 0.25; // Constant CTR
  const cpm = 3.65; // Constant CPM
  const [impressions, setImpressions] = useState(0);
  const [isEditingRetailerLabel, setIsEditingRetailerLabel] = useState(false);

  useEffect(() => {
    if (data.budget && data.budget > 0) {
      // Calculate impressions: (Budget / CPM) × 1000
      const calculatedImpressions = (data.budget / cpm) * 1000;
      setImpressions(calculatedImpressions);
    } else {
      setImpressions(0);
    }
  }, [data.budget]);

  const updateField = (field: keyof CampaignData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const toggleArrayItem = (field: 'vertical' | 'language' | 'adSize', item: string) => {
    const currentArray = data[field] as string[] || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateField(field, newArray);
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="campaignName" className="text-sm font-medium">Campaign Name *</Label>
          <Input
            id="campaignName"
            placeholder="Black Friday 2024 Campaign"
            value={data.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            className="glass border-glass-border bg-glass/30 mt-2"
          />
        </div>
        
        <div>
          <Label htmlFor="budget" className="text-sm font-medium">Budget ($)</Label>
          <Input
            id="budget"
            type="number"
            placeholder="10000"
            value={data.budget || ''}
            onChange={(e) => updateField('budget', e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
            className="glass border-glass-border bg-glass/30 mt-2"
          />
        </div>
      </div>

      {/* Type, Device, and Retailer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="type" className="text-sm font-medium">Type</Label>
          <Select value={data.type || ''} onValueChange={(value) => updateField('type', value)}>
            <SelectTrigger className="glass border-glass-border bg-glass/30 mt-2">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="device" className="text-sm font-medium">Device</Label>
          <Input
            id="device"
            placeholder="Mobile, Desktop, Tablet"
            value={data.device || ''}
            onChange={(e) => updateField('device', e.target.value)}
            className="glass border-glass-border bg-glass/30 mt-2"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="retailer" className="text-sm font-medium">
              {isEditingRetailerLabel ? (
                <Input
                  value={data.retailerLabel || 'Retailer/Store'}
                  onChange={(e) => updateField('retailerLabel', e.target.value)}
                  onBlur={() => setIsEditingRetailerLabel(false)}
                  className="h-6 px-2 text-sm"
                  autoFocus
                />
              ) : (
                <span 
                  onClick={() => setIsEditingRetailerLabel(true)}
                  className="cursor-pointer hover:text-primary"
                  title="Click to edit label"
                >
                  {data.retailerLabel || 'Retailer/Store'}
                </span>
              )}
            </Label>
          </div>
          <Input
            id="retailer"
            placeholder="7-Eleven, Walmart, etc."
            value={data.retailer || ''}
            onChange={(e) => updateField('retailer', e.target.value)}
            className="glass border-glass-border bg-glass/30 mt-2"
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal glass border-glass-border bg-glass/30 mt-2",
                  !data.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.startDate ? format(data.startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.startDate}
                onSelect={(date) => updateField('startDate', date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label className="text-sm font-medium">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal glass border-glass-border bg-glass/30 mt-2",
                  !data.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.endDate ? format(data.endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.endDate}
                onSelect={(date) => updateField('endDate', date)}
                initialFocus
                disabled={(date) => data.startDate ? date < data.startDate : false}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Calculation Summary Box */}
      {data.budget && data.budget > 0 && (
        <div className="glass p-6 rounded-lg border-2 border-primary/30">
          <h4 className="text-lg font-semibold mb-4 gradient-text">Campaign Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 glass rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Impressions</p>
              <p className="text-2xl font-bold text-accent">
                {impressions >= 1000000 
                  ? `${(impressions / 1000000).toFixed(1)}M` 
                  : impressions >= 1000 
                  ? `${(impressions / 1000).toFixed(1)}K` 
                  : impressions.toFixed(0)}
              </p>
            </div>
            <div className="text-center p-4 glass rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">CTR</p>
              <p className="text-2xl font-bold text-accent">{ctr}%</p>
            </div>
            <div className="text-center p-4 glass rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">CPM</p>
              <p className="text-2xl font-bold text-accent">${cpm.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Client Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="clientName" className="text-sm font-medium">Client Name (Optional)</Label>
          <Input
            id="clientName"
            placeholder="John Doe"
            value={data.clientName || ''}
            onChange={(e) => updateField('clientName', e.target.value)}
            className="glass border-glass-border bg-glass/30 mt-2"
          />
        </div>
        
        <div>
          <Label htmlFor="clientEmail" className="text-sm font-medium">Client Email (Optional)</Label>
          <Input
            id="clientEmail"
            type="email"
            placeholder="john@example.com"
            value={data.clientEmail || ''}
            onChange={(e) => updateField('clientEmail', e.target.value)}
            className="glass border-glass-border bg-glass/30 mt-2"
          />
        </div>
      </div>

      {/* Campaign Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="products" className="text-sm font-medium">Products</Label>
          <Input
            id="products"
            placeholder="iPhone 15, MacBook Pro, AirPods"
            value={data.products || ''}
            onChange={(e) => updateField('products', e.target.value)}
            className="glass border-glass-border bg-glass/30 mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="audience" className="text-sm font-medium">Audience</Label>
        <Input
          id="audience"
          placeholder="Male, Female, Gen Z, Millennials, 18-35"
          value={data.audience || ''}
          onChange={(e) => updateField('audience', e.target.value)}
          className="glass border-glass-border bg-glass/30 mt-2"
        />
      </div>

      {/* Multi-select options */}
      <div className="space-y-6">
        {/* Vertical */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Vertical</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {verticalOptions.map((vertical) => (
              <div key={vertical} className="flex items-center space-x-2">
                <Checkbox
                  id={`vertical-${vertical}`}
                  checked={(data.vertical || []).includes(vertical)}
                  onCheckedChange={() => toggleArrayItem('vertical', vertical)}
                />
                <Label 
                  htmlFor={`vertical-${vertical}`} 
                  className="text-sm cursor-pointer"
                >
                  {vertical}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <Label htmlFor="language" className="text-sm font-medium">Language</Label>
          <Input
            id="language"
            placeholder="English, Spanish, French"
            value={data.language || ''}
            onChange={(e) => updateField('language', e.target.value)}
            className="glass border-glass-border bg-glass/30 mt-2"
          />
        </div>

        {/* Ad Size */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Ad Size</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {adSizeOptions.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`adSize-${size}`}
                  checked={(data.adSize || []).includes(size)}
                  onCheckedChange={() => toggleArrayItem('adSize', size)}
                />
                <Label 
                  htmlFor={`adSize-${size}`} 
                  className="text-sm cursor-pointer"
                >
                  {size}
                </Label>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="numberOfProducts" className="text-sm font-medium">Number of Products</Label>
          <Input
            id="numberOfProducts"
            type="number"
            value={data.numberOfProducts ?? ''}
            onChange={(e) => updateField('numberOfProducts', e.target.value === '' ? '' : parseInt(e.target.value) || '')}
            className="glass border-glass-border bg-glass/30 mt-2"
          />
        </div>
        
        <div>
          <Label htmlFor="frames" className="text-sm font-medium">Number of Frames</Label>
          <Input
            id="frames"
            type="number"
            value={data.frames ?? ''}
            onChange={(e) => updateField('frames', e.target.value === '' ? '' : parseInt(e.target.value) || '')}
            className="glass border-glass-border bg-glass/30 mt-2"
          />
        </div>
      </div>

      {/* Proceed Button */}
      <div className="pt-6">
        <Button
          onClick={onProceed}
          className="w-full btn-futuristic text-white font-semibold py-3 text-lg"
          disabled={!data.name}
        >
          Proceed to Templates
        </Button>
      </div>
    </div>
  );
};