import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Download, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCampaign } from '@/contexts/CampaignContext';

interface Rule {
  id: string;
  daysOfWeek: string[];
  startHour: number;
  endHour: number;
  combinations: string[];
}

interface TemplateFields {
  headings: string;
  product1Frame1: string;
  product2Frame1: string;
  product1Frame2: string;
  product2Frame2: string;
  images: string;
  offer1: string;
}

const DAYS_OF_WEEK = [
  { id: 'mon', label: 'Monday' },
  { id: 'tue', label: 'Tuesday' },
  { id: 'wed', label: 'Wednesday' },
  { id: 'thu', label: 'Thursday' },
  { id: 'fri', label: 'Friday' },
  { id: 'sat', label: 'Saturday' },
  { id: 'sun', label: 'Sunday' }
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const RuleBuilder = () => {
  const navigate = useNavigate();
  const { currentCampaign } = useCampaign();
  
  const [fields, setFields] = useState<TemplateFields>({
    headings: '',
    product1Frame1: '',
    product2Frame1: '',
    product1Frame2: '',
    product2Frame2: '',
    images: '',
    offer1: '',
  });
  
  const [selectedValues, setSelectedValues] = useState({
    headings: [] as string[],
    product1Frame1: [] as string[],
    product2Frame1: [] as string[],
    product1Frame2: [] as string[],
    product2Frame2: [] as string[],
    images: [] as string[],
    offer1: [] as string[],
  });
  
  const [rules, setRules] = useState<Rule[]>([]);
  
  const [currentRule, setCurrentRule] = useState({
    daysOfWeek: [] as string[],
    startHour: 0,
    endHour: 23,
  });

  const parseField = (value: string) => {
    return value.split('\n').filter(item => item.trim() !== '');
  };

  const formatDays = (daysOfWeek: string[]) => {
    const dayMap: Record<string, string> = {
      mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
      fri: 'Fri', sat: 'Sat', sun: 'Sun'
    };
    
    // Check for Mon-Fri pattern
    const weekdayPattern = ['mon', 'tue', 'wed', 'thu', 'fri'];
    const isWeekdays = weekdayPattern.every(day => daysOfWeek.includes(day)) && 
                       daysOfWeek.length === 5;
    if (isWeekdays) return 'Mon-Fri';
    
    // Check for Mon-Sun pattern (all days)
    if (daysOfWeek.length === 7) return 'Mon-Sun';
    
    // Check for continuous ranges
    const sortedDays = [...daysOfWeek].sort((a, b) => {
      const order = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      return order.indexOf(a) - order.indexOf(b);
    });
    
    // Format as comma-separated short names
    return sortedDays.map(day => dayMap[day] || day).join(', ');
  };

  const formatSchedule = (daysOfWeek: string[], startHour: number, endHour: number) => {
    const daysFormatted = formatDays(daysOfWeek);
    const timeFormatted = `${startHour.toString().padStart(2, '0')}-${endHour.toString().padStart(2, '0')}`;
    return `${daysFormatted}, ${timeFormatted}`;
  };

  const generateCombinations = () => {
    const { headings, product1Frame1, product2Frame1, product1Frame2, product2Frame2, images, offer1 } = selectedValues;
    
    const combinations = [];
    const schedule = formatSchedule(currentRule.daysOfWeek, currentRule.startHour, currentRule.endHour);
    
    for (const heading of headings) {
      for (const p1f1 of product1Frame1) {
        for (const p2f1 of product2Frame1) {
          for (const p1f2 of product1Frame2) {
            for (const p2f2 of product2Frame2) {
              for (const image of images) {
                for (const offer of offer1) {
                  combinations.push(`${heading}_${p1f1}_${p2f1}_${p1f2}_${p2f2}_${image}_${offer}_${schedule}`);
                }
              }
            }
          }
        }
      }
    }
    return combinations;
  };

  const addRule = () => {
    if (currentRule.daysOfWeek.length === 0 || selectedValues.headings.length === 0) return;
    
    const combinations = generateCombinations();
    const newRule: Rule = {
      id: Date.now().toString(),
      daysOfWeek: currentRule.daysOfWeek,
      startHour: currentRule.startHour,
      endHour: currentRule.endHour,
      combinations,
    };
    
    setRules([...rules, newRule]);
    setCurrentRule({ daysOfWeek: [], startHour: 0, endHour: 23 });
    // Don't reset selectedValues - allow reuse for next rule
  };

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };

  const getLanguageLocale = (language: string) => {
    const localeMap: Record<string, string> = {
      'English': 'en',
      'Spanish': 'es',
      'French': 'fr',
      'German': 'de',
      'Italian': 'it',
      'Portuguese': 'pt',
      'Chinese': 'zh',
      'Japanese': 'ja'
    };
    return localeMap[language] || language.substring(0, 2).toLowerCase();
  };

  const exportToExcel = () => {
    // Sheet 1: Original comprehensive export
    let sheet1Content = '';
    
    sheet1Content += 'CAMPAIGN DETAILS\n';
    sheet1Content += `Campaign Name,${currentCampaign?.name || 'N/A'}\n`;
    sheet1Content += `Start Date,${currentCampaign?.startDate ? new Date(currentCampaign.startDate).toLocaleDateString() : 'N/A'}\n`;
    sheet1Content += `End Date,${currentCampaign?.endDate ? new Date(currentCampaign.endDate).toLocaleDateString() : 'N/A'}\n`;
    sheet1Content += `Budget,$${currentCampaign?.budget || 'N/A'}\n`;
    sheet1Content += `Client Name,${currentCampaign?.clientName || 'N/A'}\n`;
    sheet1Content += `Client Email,${currentCampaign?.clientEmail || 'N/A'}\n`;
    sheet1Content += `Vertical,${currentCampaign?.vertical?.join('; ') || 'N/A'}\n`;
    sheet1Content += `Device,${currentCampaign?.device || 'N/A'}\n`;
    sheet1Content += `Products,${currentCampaign?.products || 'N/A'}\n`;
    sheet1Content += `Audience,${currentCampaign?.audience || 'N/A'}\n`;
    sheet1Content += `Ad Size,${currentCampaign?.adSize?.join('; ') || 'N/A'}\n`;
    sheet1Content += `Type,${currentCampaign?.type || 'N/A'}\n`;
    sheet1Content += `${currentCampaign?.retailerLabel || 'Retailer'},${currentCampaign?.retailer || 'N/A'}\n`;
    sheet1Content += `Language,${currentCampaign?.language?.join('; ') || 'N/A'}\n`;
    sheet1Content += `Number of Products,${currentCampaign?.numberOfProducts || 'N/A'}\n`;
    sheet1Content += `Frames,${currentCampaign?.frames || 'N/A'}\n\n`;
    
    sheet1Content += 'PERSONALIZATION DETAILS\n';
    sheet1Content += `Headings,${parseField(fields.headings).join('; ')}\n`;
    sheet1Content += `Product 1 Frame 1,${parseField(fields.product1Frame1).join('; ')}\n`;
    sheet1Content += `Product 2 Frame 1,${parseField(fields.product2Frame1).join('; ')}\n`;
    sheet1Content += `Product 1 Frame 2,${parseField(fields.product1Frame2).join('; ')}\n`;
    sheet1Content += `Product 2 Frame 2,${parseField(fields.product2Frame2).join('; ')}\n`;
    sheet1Content += `Images,${parseField(fields.images).join('; ')}\n`;
    sheet1Content += `Offer1,${parseField(fields.offer1).join('; ')}\n\n`;
    
    sheet1Content += 'RULE-BASED COMBINATIONS\n';
    sheet1Content += 'Rule Schedule,Combination\n';
    
    rules.forEach(rule => {
      const schedule = formatSchedule(rule.daysOfWeek, rule.startHour, rule.endHour);
      rule.combinations.forEach(combo => {
        sheet1Content += `"${schedule}","${combo}"\n`;
      });
    });

    // Sheet 2: Dynamic data format
    let sheet2Content = '\n\n\nSHEET 2 - DYNAMIC DATA\n';
    sheet2Content += 'AdSize,Day of Week,Hour of Day,Locale,Language,Heading,Product1,Product2,Combination,Version,Audience,';
    sheet2Content += `${currentCampaign?.retailerLabel || 'Retailer'},Offer\n`;
    
    const adSizes = currentCampaign?.adSize || [];
    const languagesRaw = currentCampaign?.language || [];
    const languages = Array.isArray(languagesRaw) 
      ? languagesRaw 
      : String(languagesRaw).split(',').map(l => l.trim());
    
    let versionIndex = 0;
    const versions = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    rules.forEach(rule => {
      const daysFormatted = formatDays(rule.daysOfWeek);
      const hourFormatted = `${rule.startHour.toString().padStart(2, '0')}-${rule.endHour.toString().padStart(2, '0')}`;
      
      // Generate rows for each combination
      const { headings, product1Frame1, product2Frame1, offer1 } = selectedValues;
      
      for (const adSize of adSizes) {
        for (const language of languages) {
          const locale = getLanguageLocale(language);
          
          for (const heading of headings) {
            for (const p1 of product1Frame1) {
              for (const p2 of product2Frame1) {
                for (const offer of offer1) {
                  const combination = `${p1} + ${p2}`;
                  const version = versions[versionIndex % versions.length];
                  versionIndex++;
                  
                  sheet2Content += `${adSize},${daysFormatted},${hourFormatted},${locale},${language},`;
                  sheet2Content += `${heading},${p1},${p2},${combination},${version},`;
                  sheet2Content += `${currentCampaign?.audience || 'N/A'},${currentCampaign?.retailer || 'N/A'},${offer}\n`;
                }
              }
            }
          }
        }
      }
    });
    
    const fullContent = sheet1Content + sheet2Content;
    
    const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCampaign?.name || 'campaign'}_complete_export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDayToggle = (dayId: string, checked: boolean) => {
    if (checked) {
      setCurrentRule({
        ...currentRule,
        daysOfWeek: [...currentRule.daysOfWeek, dayId]
      });
    } else {
      setCurrentRule({
        ...currentRule,
        daysOfWeek: currentRule.daysOfWeek.filter(day => day !== dayId)
      });
    }
  };

  const addToSelectedValues = (field: keyof typeof selectedValues, value: string) => {
    if (!selectedValues[field].includes(value)) {
      setSelectedValues({
        ...selectedValues,
        [field]: [...selectedValues[field], value]
      });
    }
  };

  const removeFromSelectedValues = (field: keyof typeof selectedValues, index: number) => {
    setSelectedValues({
      ...selectedValues,
      [field]: selectedValues[field].filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="glass border-b border-glass-border/50 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate('/templates')}
            variant="ghost"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
          <h1 className="text-2xl font-bold gradient-text">Rule & Combination Builder</h1>
          <div></div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Template Content and Rule Creation */}
          <div className="space-y-6">
            <Card className="glass p-6">
              <h3 className="text-xl font-semibold mb-4">Template Content Fields</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="headings">Headings (one per line)</Label>
                  <Textarea
                    id="headings"
                    placeholder="Black Friday Sale&#10;Limited Time Offer&#10;Best Deals"
                    value={fields.headings}
                    onChange={(e) => setFields({ ...fields, headings: e.target.value })}
                    className="glass border-glass-border mt-2"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="product1Frame1">Product 1 Frame 1 (one per line)</Label>
                  <Textarea
                    id="product1Frame1"
                    placeholder="iPhone 15&#10;MacBook Pro&#10;AirPods"
                    value={fields.product1Frame1}
                    onChange={(e) => setFields({ ...fields, product1Frame1: e.target.value })}
                    className="glass border-glass-border mt-2"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="product2Frame1">Product 2 Frame 1 (one per line)</Label>
                  <Textarea
                    id="product2Frame1"
                    placeholder="iPad&#10;Apple Watch&#10;Mac Studio"
                    value={fields.product2Frame1}
                    onChange={(e) => setFields({ ...fields, product2Frame1: e.target.value })}
                    className="glass border-glass-border mt-2"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="product1Frame2">Product 1 Frame 2 (one per line)</Label>
                  <Textarea
                    id="product1Frame2"
                    placeholder="Gaming Setup&#10;Work Station&#10;Home Office"
                    value={fields.product1Frame2}
                    onChange={(e) => setFields({ ...fields, product1Frame2: e.target.value })}
                    className="glass border-glass-border mt-2"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="product2Frame2">Product 2 Frame 2 (one per line)</Label>
                  <Textarea
                    id="product2Frame2"
                    placeholder="Accessories&#10;Cases&#10;Chargers"
                    value={fields.product2Frame2}
                    onChange={(e) => setFields({ ...fields, product2Frame2: e.target.value })}
                    className="glass border-glass-border mt-2"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="images">Image Names (one per line)</Label>
                  <Textarea
                    id="images"
                    placeholder="hero_image_1.jpg&#10;product_showcase.jpg&#10;lifestyle_banner.jpg"
                    value={fields.images}
                    onChange={(e) => setFields({ ...fields, images: e.target.value })}
                    className="glass border-glass-border mt-2"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="offer1">Offer1 (one per line)</Label>
                  <Textarea
                    id="offer1"
                    placeholder="2/$4.50&#10;Buy 1 Get 1 Free&#10;50% Off"
                    value={fields.offer1}
                    onChange={(e) => setFields({ ...fields, offer1: e.target.value })}
                    className="glass border-glass-border mt-2"
                    rows={4}
                  />
                </div>
              </div>
            </Card>

            <Card className="glass p-6">
              <h3 className="text-xl font-semibold mb-4">Create Day & Time Rule</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Days of Week</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={day.id}
                          checked={currentRule.daysOfWeek.includes(day.id)}
                          onCheckedChange={(checked) => handleDayToggle(day.id, checked as boolean)}
                        />
                        <Label htmlFor={day.id} className="text-sm">{day.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startHour">Start Hour</Label>
                    <Select onValueChange={(value) => setCurrentRule({ ...currentRule, startHour: parseInt(value) })}>
                      <SelectTrigger className="glass border-glass-border mt-2">
                        <SelectValue placeholder={`${currentRule.startHour}:00`} />
                      </SelectTrigger>
                      <SelectContent>
                        {HOURS.map((hour) => (
                          <SelectItem key={hour} value={hour.toString()}>
                            {hour.toString().padStart(2, '0')}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="endHour">End Hour</Label>
                    <Select onValueChange={(value) => setCurrentRule({ ...currentRule, endHour: parseInt(value) })}>
                      <SelectTrigger className="glass border-glass-border mt-2">
                        <SelectValue placeholder={`${currentRule.endHour}:00`} />
                      </SelectTrigger>
                      <SelectContent>
                        {HOURS.map((hour) => (
                          <SelectItem key={hour} value={hour.toString()}>
                            {hour.toString().padStart(2, '0')}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(fields).map(([fieldKey, fieldValue]) => {
                    const key = fieldKey as keyof typeof selectedValues;
                    const displayName = fieldKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    
                    return (
                      <div key={fieldKey}>
                        <Label>Select {displayName}</Label>
                        <Select onValueChange={(value) => addToSelectedValues(key, value)}>
                          <SelectTrigger className="glass border-glass-border mt-2">
                            <SelectValue placeholder={`Add ${displayName.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {parseField(fieldValue).map((item, index) => (
                              <SelectItem key={index} value={item}>{item}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="mt-2 space-y-1">
                          {selectedValues[key].map((item, index) => (
                            <div key={index} className="flex items-center justify-between bg-glass/50 px-2 py-1 rounded text-sm">
                              {item}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromSelectedValues(key, index)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <Button
                  onClick={addRule}
                  className="w-full btn-futuristic text-white"
                  disabled={currentRule.daysOfWeek.length === 0 || selectedValues.headings.length === 0}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Generated Rules */}
          <div className="space-y-6">
            <Card className="glass p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Generated Rules</h3>
                {rules.length > 0 && (
                  <Button
                    onClick={exportToExcel}
                    className="btn-futuristic text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Excel
                  </Button>
                )}
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {rules.map((rule) => (
                  <div key={rule.id} className="bg-glass/30 p-4 rounded-lg border border-glass-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">
                        {formatSchedule(rule.daysOfWeek, rule.startHour, rule.endHour)}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {rule.startHour}:00 - {rule.endHour}:00
                        </div>
                        <Button
                          onClick={() => deleteRule(rule.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {rule.combinations.length} combinations generated
                    </p>
                    <div className="max-h-32 overflow-y-auto">
                      {rule.combinations.slice(0, 5).map((combo, index) => (
                        <div key={index} className="text-xs bg-background/10 px-2 py-1 rounded mb-1">
                          {combo}
                        </div>
                      ))}
                      {rule.combinations.length > 5 && (
                        <div className="text-xs text-muted-foreground px-2 py-1">
                          ... and {rule.combinations.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {rules.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No rules created yet. Add your first rule above.</p>
                </div>
              )}
            </Card>

            <Button
              onClick={() => navigate('/assets')}
              className="w-full btn-futuristic text-white font-semibold py-3"
              disabled={rules.length === 0}
            >
              Continue to Assets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleBuilder;