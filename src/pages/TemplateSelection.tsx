import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCampaign } from '@/contexts/CampaignContext';

const mockTemplates = [
  { id: '1', name: 'Modern Product Showcase', preview: '/api/placeholder/800/600', size: '800x600' },
  { id: '2', name: 'Minimalist Banner', preview: '/api/placeholder/728/90', size: '728x90' },
  { id: '3', name: 'Interactive Display', preview: '/api/placeholder/300/250', size: '300x250' },
  { id: '4', name: 'Mobile Optimized', preview: '/api/placeholder/320/50', size: '320x50' },
  { id: '5', name: 'Social Media Ad', preview: '/api/placeholder/600/400', size: '600x400' },
];

const TemplateSelection = () => {
  const navigate = useNavigate();
  const { currentCampaign, updateCampaign } = useCampaign();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [highlightedArea, setHighlightedArea] = useState<string | null>(null);

  const highlightOptions = [
    'Headings',
    'Product1Frame1',
    'Product2Frame1',
    'Product1Frame2',
    'Product2Frame2',
    'Background',
    'Logo',
  ];

  const selectTemplate = () => {
    if (currentCampaign) {
      updateCampaign(currentCampaign.id!, {
        selectedTemplate: mockTemplates[selectedTemplate].id,
      });
    }
    navigate('/rules');
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="glass border-b border-glass-border/50 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold gradient-text">Template Selection</h1>
          <div></div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Main Content: Template Preview + Highlight Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6 mb-8">
          {/* Main Template Preview */}
          <Card className="glass p-6">
            <div className="relative mb-6">
              <img
                src={mockTemplates[selectedTemplate].preview}
                alt={mockTemplates[selectedTemplate].name}
                className="w-full h-96 object-contain bg-background/10 rounded-lg banner-hover"
              />
              
              {/* Interactive Overlay Areas */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-1 p-4">
                {/* Headings - Top center */}
                <div
                  className={`col-span-2 row-span-1 cursor-pointer transition-all duration-300 rounded-lg ${
                    highlightedArea === 'Headings' ? 'bg-accent/30 border-2 border-accent ring-2 ring-accent/50' : 'hover:bg-accent/10 hover:border-2 hover:border-accent/50'
                  }`}
                  onClick={() => setHighlightedArea(highlightedArea === 'Headings' ? null : 'Headings')}
                  onMouseEnter={() => setHighlightedArea('Headings')}
                  onMouseLeave={() => setHighlightedArea(null)}
                />
                
                {/* Product1Frame1 - Middle left */}
                <div
                  className={`col-span-1 row-span-1 cursor-pointer transition-all duration-300 rounded-lg ${
                    highlightedArea === 'Product1Frame1' ? 'bg-accent/30 border-2 border-accent ring-2 ring-accent/50' : 'hover:bg-accent/10 hover:border-2 hover:border-accent/50'
                  }`}
                  onClick={() => setHighlightedArea(highlightedArea === 'Product1Frame1' ? null : 'Product1Frame1')}
                  onMouseEnter={() => setHighlightedArea('Product1Frame1')}
                  onMouseLeave={() => setHighlightedArea(null)}
                />
                
                {/* Product2Frame1 - Middle right */}
                <div
                  className={`col-span-1 row-span-1 cursor-pointer transition-all duration-300 rounded-lg ${
                    highlightedArea === 'Product2Frame1' ? 'bg-accent/30 border-2 border-accent ring-2 ring-accent/50' : 'hover:bg-accent/10 hover:border-2 hover:border-accent/50'
                  }`}
                  onClick={() => setHighlightedArea(highlightedArea === 'Product2Frame1' ? null : 'Product2Frame1')}
                  onMouseEnter={() => setHighlightedArea('Product2Frame1')}
                  onMouseLeave={() => setHighlightedArea(null)}
                />
                
                {/* Product1Frame2 - Bottom left */}
                <div
                  className={`col-span-1 row-span-1 cursor-pointer transition-all duration-300 rounded-lg ${
                    highlightedArea === 'Product1Frame2' ? 'bg-accent/30 border-2 border-accent ring-2 ring-accent/50' : 'hover:bg-accent/10 hover:border-2 hover:border-accent/50'
                  }`}
                  onClick={() => setHighlightedArea(highlightedArea === 'Product1Frame2' ? null : 'Product1Frame2')}
                  onMouseEnter={() => setHighlightedArea('Product1Frame2')}
                  onMouseLeave={() => setHighlightedArea(null)}
                />
                
                {/* Product2Frame2 - Bottom right */}
                <div
                  className={`col-span-1 row-span-1 cursor-pointer transition-all duration-300 rounded-lg ${
                    highlightedArea === 'Product2Frame2' ? 'bg-accent/30 border-2 border-accent ring-2 ring-accent/50' : 'hover:bg-accent/10 hover:border-2 hover:border-accent/50'
                  }`}
                  onClick={() => setHighlightedArea(highlightedArea === 'Product2Frame2' ? null : 'Product2Frame2')}
                  onMouseEnter={() => setHighlightedArea('Product2Frame2')}
                  onMouseLeave={() => setHighlightedArea(null)}
                />
              </div>
              
              {/* Background and Logo overlays - corner positions */}
              <div
                className={`absolute top-4 left-4 w-20 h-20 cursor-pointer transition-all duration-300 rounded-lg ${
                  highlightedArea === 'Logo' ? 'bg-accent/30 border-2 border-accent ring-2 ring-accent/50' : 'hover:bg-accent/10 hover:border-2 hover:border-accent/50'
                }`}
                onClick={() => setHighlightedArea(highlightedArea === 'Logo' ? null : 'Logo')}
                onMouseEnter={() => setHighlightedArea('Logo')}
                onMouseLeave={() => setHighlightedArea(null)}
              />
              
              <div
                className={`absolute inset-0 -z-10 cursor-pointer transition-all duration-300 rounded-lg ${
                  highlightedArea === 'Background' ? 'bg-accent/30 border-2 border-accent ring-2 ring-accent/50' : 'hover:bg-accent/10 hover:border-2 hover:border-accent/50'
                }`}
                onClick={() => setHighlightedArea(highlightedArea === 'Background' ? null : 'Background')}
                onMouseEnter={() => setHighlightedArea('Background')}
                onMouseLeave={() => setHighlightedArea(null)}
              />
            </div>
          </Card>

          {/* Highlight Areas Panel */}
          <div className="space-y-4">
            <Card className="glass p-4">
              <h3 className="text-lg font-semibold mb-4">Highlight Areas</h3>
              <div className="space-y-2">
                {highlightOptions.map((option) => (
                  <Button
                    key={option}
                    variant={highlightedArea === option ? "default" : "outline"}
                    className={`w-full justify-start ${
                      highlightedArea === option
                        ? 'bg-gradient-primary text-white'
                        : 'glass-hover border-glass-border'
                    }`}
                    onClick={() => setHighlightedArea(
                      highlightedArea === option ? null : option
                    )}
                    onMouseEnter={() => setHighlightedArea(option)}
                    onMouseLeave={() => setHighlightedArea(null)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {option}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Select Template Button */}
            <Button
              onClick={selectTemplate}
              className="w-full btn-futuristic text-white font-semibold py-3"
            >
              Select Template
            </Button>
          </div>
        </div>

        {/* Template Thumbnails Row */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => setSelectedTemplate(Math.max(0, selectedTemplate - 1))}
            variant="outline"
            disabled={selectedTemplate === 0}
            className="glass-hover"
            size="icon"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex gap-3 overflow-x-auto py-2">
            {mockTemplates.map((template, index) => (
              <div
                key={template.id}
                className={`relative cursor-pointer banner-hover flex-shrink-0 ${
                  index === selectedTemplate ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedTemplate(index)}
              >
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-32 h-24 object-cover rounded"
                />
                {index === selectedTemplate && (
                  <CheckCircle className="absolute top-1 right-1 w-5 h-5 text-primary bg-background rounded-full" />
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={() => setSelectedTemplate(Math.min(mockTemplates.length - 1, selectedTemplate + 1))}
            variant="outline"
            disabled={selectedTemplate === mockTemplates.length - 1}
            className="glass-hover"
            size="icon"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;