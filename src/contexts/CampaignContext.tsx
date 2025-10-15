import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CampaignData {
  id?: string;
  name: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  clientName?: string;
  clientEmail?: string;
  vertical: string[];
  device: string;
  products: string;
  audience: string;
  language: string[];
  adSize: string[];
  type: string;
  retailer: string;
  retailerLabel: string;
  numberOfProducts: number;
  frames: number;
  selectedTemplate?: string;
  rules?: any[];
  assets?: File[];
  createdAt?: Date;
}

interface CampaignContextType {
  campaigns: CampaignData[];
  currentCampaign: CampaignData | null;
  setCurrentCampaign: (campaign: CampaignData | null) => void;
  saveCampaign: (campaign: CampaignData) => void;
  updateCampaign: (id: string, updates: Partial<CampaignData>) => void;
  deleteCampaign: (id: string) => void;
  filteredBanners: string[];
  setFilteredBanners: (banners: string[]) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<CampaignData[]>(() => {
    const saved = localStorage.getItem('adCampaigns');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentCampaign, setCurrentCampaign] = useState<CampaignData | null>(null);
  const [filteredBanners, setFilteredBanners] = useState<string[]>([]);

  const saveCampaign = (campaign: CampaignData) => {
    const newCampaign = {
      ...campaign,
      id: campaign.id || Date.now().toString(),
      createdAt: campaign.createdAt || new Date(),
    };
    
    const updatedCampaigns = [...campaigns, newCampaign];
    setCampaigns(updatedCampaigns);
    localStorage.setItem('adCampaigns', JSON.stringify(updatedCampaigns));
  };

  const updateCampaign = (id: string, updates: Partial<CampaignData>) => {
    const updatedCampaigns = campaigns.map(campaign =>
      campaign.id === id ? { ...campaign, ...updates } : campaign
    );
    setCampaigns(updatedCampaigns);
    localStorage.setItem('adCampaigns', JSON.stringify(updatedCampaigns));
  };

  const deleteCampaign = (id: string) => {
    const updatedCampaigns = campaigns.filter(campaign => campaign.id !== id);
    setCampaigns(updatedCampaigns);
    localStorage.setItem('adCampaigns', JSON.stringify(updatedCampaigns));
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        currentCampaign,
        setCurrentCampaign,
        saveCampaign,
        updateCampaign,
        deleteCampaign,
        filteredBanners,
        setFilteredBanners,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};