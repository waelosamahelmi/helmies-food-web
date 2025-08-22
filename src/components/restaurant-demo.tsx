import React from 'react';
import { useRestaurantSettings } from '../hooks/use-restaurant-settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Clock, Store, Phone, Mail, MapPin } from 'lucide-react';

/**
 * Demo component showing how to use the restaurant settings hook
 * This integrates database restaurant settings with the configuration system
 */
export function RestaurantDemo() {
  const { config, dbSettings, loading, error, isOpen, specialMessage } = useRestaurantSettings();

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Restaurant Settings</CardTitle>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{config.name}</h1>
        <p className="text-lg text-muted-foreground">{config.tagline}</p>
        {specialMessage && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 font-medium">{specialMessage}</p>
          </div>
        )}
        <div className="flex justify-center">
          <Badge variant={isOpen ? "default" : "destructive"} className="text-sm">
            <Store className="w-4 h-4 mr-1" />
            {isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Restaurant Info
            </CardTitle>
            <CardDescription>Basic restaurant information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{config.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{config.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{config.address.street}, {config.address.city}</span>
            </div>
          </CardContent>
        </Card>

        {/* Opening Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Opening Hours
            </CardTitle>
            <CardDescription>General opening hours from database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              {Object.entries(config.hours.general).map(([day, schedule]) => (
                <div key={day} className="flex justify-between">
                  <span className="capitalize">{day}:</span>
                  <span>
                    {schedule.closed ? "Closed" : `${schedule.open} - ${schedule.close}`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pickup Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pickup Hours
            </CardTitle>
            <CardDescription>Pickup hours from database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              {Object.entries(config.hours.pickup).map(([day, schedule]) => (
                <div key={day} className="flex justify-between">
                  <span className="capitalize">{day}:</span>
                  <span>
                    {schedule.closed ? "Closed" : `${schedule.open} - ${schedule.close}`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Delivery Hours
            </CardTitle>
            <CardDescription>Delivery hours from database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              {Object.entries(config.hours.delivery).map(([day, schedule]) => (
                <div key={day} className="flex justify-between">
                  <span className="capitalize">{day}:</span>
                  <span>
                    {schedule.closed ? "Closed" : `${schedule.open} - ${schedule.close}`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Theme Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Colors</CardTitle>
            <CardDescription>Current theme configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border" 
                  style={{ backgroundColor: config.theme.primary }}
                />
                <span className="text-sm">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border" 
                  style={{ backgroundColor: config.theme.secondary }}
                />
                <span className="text-sm">Secondary</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border" 
                  style={{ backgroundColor: config.theme.accent }}
                />
                <span className="text-sm">Accent</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border" 
                  style={{ backgroundColor: config.theme.error }}
                />
                <span className="text-sm">Error</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Database Settings</CardTitle>
            <CardDescription>Raw database configuration</CardDescription>
          </CardHeader>
          <CardContent>
            {dbSettings ? (
              <div className="space-y-2 text-sm">
                <div>Status: <Badge variant={dbSettings.is_open ? "default" : "destructive"}>{dbSettings.is_open ? "Open" : "Closed"}</Badge></div>
                <div>Updated: {new Date(dbSettings.updated_at).toLocaleDateString()}</div>
                {dbSettings.default_printer_id && (
                  <div>Default Printer: {dbSettings.default_printer_id}</div>
                )}
                <div>Auto Reconnect: {dbSettings.printer_auto_reconnect ? "Yes" : "No"}</div>
                <div>Sticky Tab: {dbSettings.printer_tab_sticky ? "Yes" : "No"}</div>
              </div>
            ) : (
              <p className="text-muted-foreground">No database settings loaded</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How This Works</CardTitle>
          <CardDescription>Integration of configuration and database settings</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ul className="space-y-2">
            <li><strong>Restaurant Configuration:</strong> Static configuration from `restaurant-config.ts` provides defaults and branding.</li>
            <li><strong>Database Settings:</strong> Dynamic settings from Supabase `restaurant_settings` table override hours and operational status.</li>
            <li><strong>Real-time Updates:</strong> Changes to database settings are automatically reflected via WebSocket subscription.</li>
            <li><strong>Fallback Handling:</strong> If database is unavailable, the app falls back to configuration defaults.</li>
            <li><strong>Theme System:</strong> Restaurant branding colors are applied globally via CSS custom properties.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
