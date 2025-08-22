import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { RESTAURANT_CONFIG, getFullAddress, getFormattedHours } from '../config/restaurant-config';
import { useLanguage } from '../lib/language-context';

const ContactSection: React.FC = () => {
  const { language } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Contact form submitted');
  };

  const formattedHours = getFormattedHours(RESTAURANT_CONFIG.hours.general, language);
  
  // Group consecutive days with same hours
  const groupedHours = formattedHours.reduce((acc: any[], curr, index) => {
    if (curr.closed) {
      acc.push({ days: [curr.day], hours: language === 'fi' ? 'Suljettu' : 'Closed' });
      return acc;
    }
    
    const timeStr = `${curr.open} - ${curr.close}`;
    const lastGroup = acc[acc.length - 1];
    
    if (lastGroup && lastGroup.hours === timeStr) {
      lastGroup.days.push(curr.day);
    } else {
      acc.push({ days: [curr.day], hours: timeStr });
    }
    
    return acc;
  }, []);

  return (
    <section id="contact" className="py-16 bg-gray-50 dark:bg-stone-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'fi' ? 'Ota yhteyttä' : 'Contact Us'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === 'fi' 
              ? 'Ota meihin yhteyttä varausten, catering-palveluiden tai kysymysten osalta.'
              : 'Get in touch with us for reservations, catering, or any questions you may have.'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {language === 'fi' ? 'Puhelin' : 'Phone'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{RESTAURANT_CONFIG.phone}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{RESTAURANT_CONFIG.email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {language === 'fi' ? 'Osoite' : 'Address'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  {RESTAURANT_CONFIG.address.street}<br />
                  {RESTAURANT_CONFIG.address.postalCode} {RESTAURANT_CONFIG.address.city}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {language === 'fi' ? 'Aukioloajat' : 'Hours'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {groupedHours.map((group, index) => (
                    <p key={index}>
                      <span className="font-medium">
                        {group.days.length === 1 
                          ? group.days[0]
                          : group.days.length === 2
                          ? `${group.days[0]} - ${group.days[group.days.length - 1]}`
                          : `${group.days[0]} - ${group.days[group.days.length - 1]}`
                        }:
                      </span>{' '}
                      {group.hours}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'fi' ? 'Lähetä viesti' : 'Send us a Message'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === 'fi' ? 'Etunimi' : 'First Name'}
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      placeholder={language === 'fi' ? 'Etunimesi' : 'Your first name'}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === 'fi' ? 'Sukunimi' : 'Last Name'}
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      placeholder={language === 'fi' ? 'Sukunimesi' : 'Your last name'}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder={language === 'fi' ? 'sinun.email@esimerkki.com' : 'your.email@example.com'}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'fi' ? 'Puhelin (valinnainen)' : 'Phone (optional)'}
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={language === 'fi' ? '+358 40 123 4567' : '(555) 123-4567'}
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'fi' ? 'Aihe' : 'Subject'}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder={language === 'fi' ? 'Mistä viesti koskee?' : 'What is this regarding?'}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'fi' ? 'Viesti' : 'Message'}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    placeholder={language === 'fi' ? 'Kerro lisää...' : 'Tell us more about your inquiry...'}
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  {language === 'fi' ? 'Lähetä viesti' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;