import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Image, File, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCampaign } from '@/contexts/CampaignContext';

interface UploadedAsset {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  file: File;
}

const AssetUpload = () => {
  const navigate = useNavigate();
  const { currentCampaign, saveCampaign } = useCampaign();
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAsset: UploadedAsset = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          url: e.target?.result as string,
          file: file,
        };
        setAssets(prev => [...prev, newAsset]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const completeCampaign = () => {
    if (currentCampaign) {
      const finalCampaign = {
        ...currentCampaign,
        assets: assets.map(asset => asset.file),
      };
      saveCampaign(finalCampaign);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="glass border-b border-glass-border/50 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate('/rules')}
            variant="ghost"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rules
          </Button>
          <h1 className="text-2xl font-bold gradient-text">Upload Assets</h1>
          <div></div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <Card className="glass p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Upload Your Assets</h2>
              <p className="text-muted-foreground mb-6">
                Upload images, logos, and creative assets to be used in your campaign
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.ai,.psd"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="btn-futuristic text-white font-semibold px-8 py-3"
              >
                <Upload className="w-5 h-5 mr-2" />
                Choose Files
              </Button>
              
              <p className="text-sm text-muted-foreground mt-4">
                Supported formats: PNG, JPG, GIF, PDF, AI, PSD (Max 10MB each)
              </p>
            </div>
          </Card>

          {/* Asset Grid */}
          {assets.length > 0 && (
            <Card className="glass p-6">
              <h3 className="text-xl font-semibold mb-6">Uploaded Assets ({assets.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset) => (
                  <div key={asset.id} className="bg-glass/30 rounded-lg p-4 border border-glass-border glass-hover">
                    <div className="aspect-video bg-background/10 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {asset.type.startsWith('image/') ? (
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <File className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate mb-1">{asset.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(asset.size)}
                        </p>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeAsset(asset.id)}
                        className="text-destructive hover:text-destructive/80 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Button
              onClick={() => navigate('/rules')}
              variant="outline"
              className="glass-hover border-glass-border"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rules
            </Button>
            
            <div className="flex space-x-4">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="glass-hover border-glass-border"
              >
                Skip Assets
              </Button>
              
              <Button
                onClick={completeCampaign}
                className="btn-futuristic text-white font-semibold px-8"
                disabled={!currentCampaign}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Campaign
              </Button>
            </div>
          </div>

          {/* Campaign Summary */}
          {currentCampaign && (
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">Campaign Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span> {currentCampaign.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Start Date:</span> {currentCampaign.startDate ? new Date(currentCampaign.startDate).toLocaleDateString() : 'N/A'}
                </div>
                <div>
                  <span className="text-muted-foreground">End Date:</span> {currentCampaign.endDate ? new Date(currentCampaign.endDate).toLocaleDateString() : 'N/A'}
                </div>
                <div>
                  <span className="text-muted-foreground">Budget:</span> ${currentCampaign.budget || 'N/A'}
                </div>
                <div>
                  <span className="text-muted-foreground">Vertical:</span> {currentCampaign.vertical.join(', ')}
                </div>
                <div>
                  <span className="text-muted-foreground">Ad Sizes:</span> {currentCampaign.adSize.join(', ')}
                </div>
                <div>
                  <span className="text-muted-foreground">Products:</span> {currentCampaign.numberOfProducts}
                </div>
                <div>
                  <span className="text-muted-foreground">Assets:</span> {assets.length} files
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetUpload;