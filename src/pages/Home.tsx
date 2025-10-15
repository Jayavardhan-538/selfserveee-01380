import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SearchBar } from '@/components/SearchBar';
import { CampaignForm } from '@/components/CampaignForm';
import { BannerGrid } from '@/components/BannerGrid';
import { useCampaign } from '@/contexts/CampaignContext';
import { CampaignData } from '@/contexts/CampaignContext';
const Home = () => {
  const navigate = useNavigate();
  const {
    setCurrentCampaign,
    setFilteredBanners
  } = useCampaign();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<Partial<CampaignData>>({
    name: '',
    startDate: undefined,
    endDate: undefined,
    budget: undefined,
    clientName: '',
    clientEmail: '',
    vertical: [],
    device: '',
    products: '',
    audience: '',
    language: [],
    adSize: [],
    type: '',
    retailer: '',
    retailerLabel: 'Retailer/Store',
    numberOfProducts: 2,
    frames: 1
  });
  const handleProceed = () => {
    if (!formData.name) {
      alert('Please enter a campaign name');
      return;
    }
    setCurrentCampaign(formData as CampaignData);
    navigate('/templates');
  };
  const handleSearchTemplates = () => {
    setShowResults(true);
  };
  return <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="glass border-b border-glass-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">Self Serve</h1>
            </div>
            <Button onClick={() => navigate('/dashboard')} variant="outline" className="glass-hover border-glass-border bg-glass/50">
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-6">
            Create <span className="gradient-text">Futuristic</span> Ad Campaigns
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Automate your campaign setup with AI-powered template selection and rule-based content generation
          </p>
        </div>

        {/* Search Bar */}
        <Card className="glass mb-8 p-6">
          <SearchBar onSearch={setSearchQuery} onSearchTemplates={handleSearchTemplates} />
        </Card>

        {/* Campaign Form - Show only if not showing results */}
        <div className={`transition-all duration-500 ease-out ${showResults ? 'opacity-0 scale-95 h-0 overflow-hidden' : 'opacity-100 scale-100'}`}>
          <Card className="glass mb-8 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Target className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-2xl font-semibold">Campaign Configuration</h3>
              </div>
              {showResults && <Button variant="outline" onClick={() => setShowResults(false)} className="glass-hover border-glass-border bg-glass/50">
                  Edit Campaign
                </Button>}
            </div>
            <CampaignForm data={formData} onChange={setFormData} onProceed={handleProceed} />
          </Card>
        </div>

        {/* Search Results - Show only when showing results */}
        <div className={`transition-all duration-500 ease-out ${showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95 h-0 overflow-hidden'}`}>
          {showResults && <Card className="glass mb-8 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Sparkles className="w-6 h-6 text-accent mr-3" />
                  <h3 className="text-2xl font-semibold">Search Results</h3>
                </div>
                <Button variant="outline" onClick={() => setShowResults(false)} className="glass-hover border-glass-border bg-glass/50">
                  Back to Form
                </Button>
              </div>
              <BannerGrid searchQuery={searchQuery} formData={formData} />
            </Card>}
        </div>

        {/* Preview Templates - Show only if not showing results */}
        {!showResults && <Card className="glass p-8">
            <div className="flex items-center mb-6">
              <Sparkles className="w-6 h-6 text-accent mr-3" />
              <h3 className="text-2xl font-semibold">Preview Templates</h3>
            </div>
            <BannerGrid searchQuery={searchQuery} formData={formData} />
          </Card>}
      </div>
    </div>;
};
export default Home;