import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Calendar, User, Target, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCampaign } from '@/contexts/CampaignContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { campaigns, deleteCampaign, setCurrentCampaign } = useCampaign();

  const editCampaign = (campaign: any) => {
    setCurrentCampaign(campaign);
    navigate('/');
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="glass border-b border-glass-border/50 p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Campaign Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your ad campaigns</p>
            </div>
            <Button
              onClick={() => navigate('/')}
              className="btn-futuristic text-white font-semibold px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass p-6 glass-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </Card>
          
          <Card className="glass p-6 glass-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
              <Target className="w-8 h-8 text-accent" />
            </div>
          </Card>
          
          <Card className="glass p-6 glass-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{campaigns.filter(c => 
                  new Date(c.createdAt!).getMonth() === new Date().getMonth()
                ).length}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary-glow" />
            </div>
          </Card>
          
          <Card className="glass p-6 glass-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Templates Used</p>
                <p className="text-2xl font-bold">{new Set(campaigns.map(c => c.selectedTemplate)).size}</p>
              </div>
              <User className="w-8 h-8 text-accent-glow" />
            </div>
          </Card>
        </div>

        {/* Campaigns List */}
        <Card className="glass p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Your Campaigns</h2>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="glass-hover border-glass-border"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first ad campaign to get started
              </p>
              <Button
                onClick={() => navigate('/')}
                className="btn-futuristic text-white font-semibold px-8"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Campaign
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-glass/30 border border-glass-border rounded-lg p-6 glass-hover"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                          Active
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                        <div>
                          <span className="block font-medium text-foreground">Date Range</span>
                          {campaign.startDate && campaign.endDate 
                            ? `${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}`
                            : 'N/A'}
                        </div>
                        <div>
                          <span className="block font-medium text-foreground">Budget</span>
                          ${campaign.budget || 'N/A'}
                        </div>
                        <div>
                          <span className="block font-medium text-foreground">Vertical</span>
                          {campaign.vertical.join(', ')}
                        </div>
                        <div>
                          <span className="block font-medium text-foreground">Ad Sizes</span>
                          {campaign.adSize.join(', ')}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(campaign.createdAt!)}
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          {campaign.numberOfProducts} products
                        </div>
                        {campaign.clientName && (
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {campaign.clientName}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editCampaign(campaign)}
                        className="glass-hover border-glass-border"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteCampaign(campaign.id!)}
                        className="glass-hover border-destructive/30 text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;