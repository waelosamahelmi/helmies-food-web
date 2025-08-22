import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { RestaurantConfig } from '../config/restaurant-config';
import { useRestaurant } from '../lib/restaurant-context';

interface AdminPageProps {
  onClose: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onClose }) => {
  const { config: currentConfig, updateConfig: updateGlobalConfig } = useRestaurant();
  const [config, setConfig] = useState<RestaurantConfig>(currentConfig);
  const [hasChanges, setHasChanges] = useState(false);

  const updateConfig = (path: string, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      const keys = path.split('.');
      let current: any = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      setHasChanges(true);
      return newConfig;
    });
  };

  const handleSave = () => {
    // Update the global config through context
    updateGlobalConfig(config);
    setHasChanges(false);
    alert('Configuration saved successfully! Changes are now live.');
  };

  const addDeliveryZone = () => {
    const newZones = [...config.delivery.zones, { maxDistance: 5, fee: 2.50, minimumOrder: 15.00 }];
    updateConfig('delivery.zones', newZones);
  };

  const removeDeliveryZone = (index: number) => {
    const newZones = config.delivery.zones.filter((_, i) => i !== index);
    updateConfig('delivery.zones', newZones);
  };

  const addSpecialty = () => {
    const newSpecialties = [...config.about.specialties, {
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      icon: 'Star'
    }];
    updateConfig('about.specialties', newSpecialties);
  };

  const removeSpecialty = (index: number) => {
    const newSpecialties = config.about.specialties.filter((_, i) => i !== index);
    updateConfig('about.specialties', newSpecialties);
  };

  const addHeroFeature = () => {
    const newFeatures = [...config.hero.features, {
      title: '',
      titleEn: '',
      color: '#16a34a'
    }];
    updateConfig('hero.features', newFeatures);
  };

  const removeHeroFeature = (index: number) => {
    const newFeatures = config.hero.features.filter((_, i) => i !== index);
    updateConfig('hero.features', newFeatures);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Admin Panel</h1>
          <div className="flex items-center gap-4">
            {hasChanges && (
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="basic" className="p-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="hours">Hours</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Restaurant Name (Finnish)</Label>
                      <Input
                        id="name"
                        value={config.name}
                        onChange={(e) => updateConfig('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nameEn">Restaurant Name (English)</Label>
                      <Input
                        id="nameEn"
                        value={config.nameEn}
                        onChange={(e) => updateConfig('nameEn', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tagline">Tagline (Finnish)</Label>
                      <Input
                        id="tagline"
                        value={config.tagline}
                        onChange={(e) => updateConfig('tagline', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="taglineEn">Tagline (English)</Label>
                      <Input
                        id="taglineEn"
                        value={config.taglineEn}
                        onChange={(e) => updateConfig('taglineEn', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="description">Description (Finnish)</Label>
                      <Textarea
                        id="description"
                        value={config.description}
                        onChange={(e) => updateConfig('description', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="descriptionEn">Description (English)</Label>
                      <Textarea
                        id="descriptionEn"
                        value={config.descriptionEn}
                        onChange={(e) => updateConfig('descriptionEn', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={config.phone}
                        onChange={(e) => updateConfig('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={config.email}
                        onChange={(e) => updateConfig('email', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="street">Street</Label>
                        <Input
                          id="street"
                          value={config.address.street}
                          onChange={(e) => updateConfig('address.street', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={config.address.postalCode}
                          onChange={(e) => updateConfig('address.postalCode', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={config.address.city}
                          onChange={(e) => updateConfig('address.city', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={config.address.country}
                          onChange={(e) => updateConfig('address.country', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Social Media</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="facebook">Facebook URL</Label>
                        <Input
                          id="facebook"
                          value={config.facebook || ''}
                          onChange={(e) => updateConfig('facebook', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagram">Instagram URL</Label>
                        <Input
                          id="instagram"
                          value={config.instagram || ''}
                          onChange={(e) => updateConfig('instagram', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hours" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {['general', 'pickup', 'delivery'].map((type) => (
                    <div key={type} className="space-y-4">
                      <h3 className="text-lg font-semibold capitalize">{type} Hours</h3>
                      <div className="space-y-2">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                          <div key={day} className="grid grid-cols-4 gap-4 items-center">
                            <Label className="capitalize">{day}</Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={!config.hours[type as keyof typeof config.hours][day as keyof typeof config.hours.general].closed}
                                onCheckedChange={(checked) => updateConfig(`hours.${type}.${day}.closed`, !checked)}
                              />
                              <span className="text-sm">Open</span>
                            </div>
                            <Input
                              type="time"
                              value={config.hours[type as keyof typeof config.hours][day as keyof typeof config.hours.general].open}
                              onChange={(e) => updateConfig(`hours.${type}.${day}.open`, e.target.value)}
                              disabled={config.hours[type as keyof typeof config.hours][day as keyof typeof config.hours.general].closed}
                            />
                            <Input
                              type="time"
                              value={config.hours[type as keyof typeof config.hours][day as keyof typeof config.hours.general].close}
                              onChange={(e) => updateConfig(`hours.${type}.${day}.close`, e.target.value)}
                              disabled={config.hours[type as keyof typeof config.hours][day as keyof typeof config.hours.general].closed}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Delivery Zones</h3>
                      <Button onClick={addDeliveryZone} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Zone
                      </Button>
                    </div>
                    
                    {config.delivery.zones.map((zone, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 items-end p-4 border rounded-lg">
                        <div>
                          <Label>Max Distance (km)</Label>
                          <Input
                            type="number"
                            value={zone.maxDistance}
                            onChange={(e) => updateConfig(`delivery.zones.${index}.maxDistance`, parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Delivery Fee (€)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={zone.fee}
                            onChange={(e) => updateConfig(`delivery.zones.${index}.fee`, parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Minimum Order (€)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={zone.minimumOrder || ''}
                            onChange={(e) => updateConfig(`delivery.zones.${index}.minimumOrder`, e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeDeliveryZone(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Restaurant Location</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Latitude</Label>
                        <Input
                          type="number"
                          step="any"
                          value={config.delivery.location.lat}
                          onChange={(e) => updateConfig('delivery.location.lat', parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Longitude</Label>
                        <Input
                          type="number"
                          step="any"
                          value={config.delivery.location.lng}
                          onChange={(e) => updateConfig('delivery.location.lng', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Story (Finnish)</Label>
                      <Textarea
                        value={config.about.story}
                        onChange={(e) => updateConfig('about.story', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Story (English)</Label>
                      <Textarea
                        value={config.about.storyEn}
                        onChange={(e) => updateConfig('about.storyEn', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Mission (Finnish)</Label>
                      <Textarea
                        value={config.about.mission}
                        onChange={(e) => updateConfig('about.mission', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Mission (English)</Label>
                      <Textarea
                        value={config.about.missionEn}
                        onChange={(e) => updateConfig('about.missionEn', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Specialties</h3>
                      <Button onClick={addSpecialty} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Specialty
                      </Button>
                    </div>
                    
                    {config.about.specialties.map((specialty, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Specialty {index + 1}</h4>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeSpecialty(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Icon (Lucide name)</Label>
                            <Input
                              value={specialty.icon}
                              onChange={(e) => updateConfig(`about.specialties.${index}.icon`, e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Title (Finnish)</Label>
                            <Input
                              value={specialty.title}
                              onChange={(e) => updateConfig(`about.specialties.${index}.title`, e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Title (English)</Label>
                            <Input
                              value={specialty.titleEn}
                              onChange={(e) => updateConfig(`about.specialties.${index}.titleEn`, e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Description (Finnish)</Label>
                            <Textarea
                              value={specialty.description}
                              onChange={(e) => updateConfig(`about.specialties.${index}.description`, e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Description (English)</Label>
                            <Textarea
                              value={specialty.descriptionEn}
                              onChange={(e) => updateConfig(`about.specialties.${index}.descriptionEn`, e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="theme" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme & Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Colors</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(config.theme).filter(([key, value]) => typeof value === 'string').map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <Label className="capitalize">{key}</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              value={value as string}
                              onChange={(e) => updateConfig(`theme.${key}`, e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={value as string}
                              onChange={(e) => updateConfig(`theme.${key}`, e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Logo</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Icon (Lucide name)</Label>
                        <Input
                          value={config.logo.icon}
                          onChange={(e) => updateConfig('logo.icon', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Background Color</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="color"
                            value={config.logo.backgroundColor}
                            onChange={(e) => updateConfig('logo.backgroundColor', e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            value={config.logo.backgroundColor}
                            onChange={(e) => updateConfig('logo.backgroundColor', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={config.logo.showText}
                        onCheckedChange={(checked) => updateConfig('logo.showText', checked)}
                      />
                      <Label>Show text with logo</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Hero Section</h3>
                    <div>
                      <Label>Background Image URL</Label>
                      <Input
                        value={config.hero.backgroundImage}
                        onChange={(e) => updateConfig('hero.backgroundImage', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Video URL (optional)</Label>
                      <Input
                        value={config.hero.videoUrl || ''}
                        onChange={(e) => updateConfig('hero.videoUrl', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Hero Features</h4>
                        <Button onClick={addHeroFeature} size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Feature
                        </Button>
                      </div>
                      
                      {config.hero.features.map((feature, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 items-end p-4 border rounded-lg">
                          <div>
                            <Label>Title (Finnish)</Label>
                            <Input
                              value={feature.title}
                              onChange={(e) => updateConfig(`hero.features.${index}.title`, e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Title (English)</Label>
                            <Input
                              value={feature.titleEn}
                              onChange={(e) => updateConfig(`hero.features.${index}.titleEn`, e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Color</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="color"
                                value={feature.color}
                                onChange={(e) => updateConfig(`hero.features.${index}.color`, e.target.value)}
                                className="w-10 h-10 p-1"
                              />
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeHeroFeature(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
