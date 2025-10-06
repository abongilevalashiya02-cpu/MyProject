import React, { useState } from 'react';
import PageSEO from '@/components/PageSEO';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageSEO
        title="Contact Bantu Stall | Get in Touch | Cape Town & Johannesburg"
        description="Contact Bantu Stall's expert team in Cape Town and Johannesburg. Get support for African travel experiences, corporate retreats, business partnerships, and customer service. Available Monday-Saturday."
        keywords={[
          'contact bantu stall',
          'cape town travel support',
          'johannesburg business contact',
          'african travel customer service',
          'south africa travel experts',
          'bantu stall support team',
          'african experience inquiries',
          'corporate retreat contact',
          'travel consultation south africa',
          'business partnerships africa'
        ]}
        canonicalUrl="https://bantustall.com/contact"
        breadcrumbs={[
          { name: 'Home', url: 'https://bantustall.com/' },
          { name: 'Contact', url: 'https://bantustall.com/contact' }
        ]}
        type="website"
        locale="en_ZA"
        region="ZA"
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "mainEntity": {
            "@type": "Organization",
            "name": "Bantu Stall",
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+27-11-123-4567",
                "contactType": "customer service",
                "email": "hello@bantustall.com",
                "areaServed": "ZA",
                "availableLanguage": ["English", "Afrikaans"],
                "hoursAvailable": [
                  {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    "opens": "08:00",
                    "closes": "18:00"
                  },
                  {
                    "@type": "OpeningHoursSpecification", 
                    "dayOfWeek": "Saturday",
                    "opens": "09:00",
                    "closes": "14:00"
                  }
                ]
              }
            ],
            "address": [
              {
                "@type": "PostalAddress",
                "addressLocality": "Cape Town",
                "addressRegion": "Western Cape",
                "addressCountry": "South Africa"
              },
              {
                "@type": "PostalAddress",
                "addressLocality": "Johannesburg", 
                "addressRegion": "Gauteng",
                "addressCountry": "South Africa"
              }
            ]
          }
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to embark on your African adventure? Get in touch with our team of travel experts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Input
                      {...register('name')}
                      placeholder="Your Name"
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      {...register('email')}
                      type="email"
                      placeholder="your.email@example.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      {...register('subject')}
                      placeholder="Subject"
                      className={errors.subject ? 'border-destructive' : ''}
                    />
                    {errors.subject && (
                      <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <Textarea
                      {...register('message')}
                      placeholder="Tell us about your travel plans or questions..."
                      rows={6}
                      className={errors.message ? 'border-destructive' : ''}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    Multiple ways to reach our team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Office Location</h4>
                      <p className="text-muted-foreground">
                        Cape Town, South Africa<br />
                        Johannesburg, South Africa
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <p className="text-muted-foreground">+27 (0) 11 123 4567</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-muted-foreground">hello@bantustall.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Business Hours</h4>
                      <p className="text-muted-foreground">
                        Monday - Friday: 8:00 AM - 6:00 PM (SAST)<br />
                        Saturday: 9:00 AM - 2:00 PM (SAST)<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Our Team</CardTitle>
                  <CardDescription>
                    Meet the experts behind your African adventure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our passionate team of travel specialists has extensive knowledge of African destinations, 
                    cultures, and experiences. We're committed to creating authentic, meaningful journeys that 
                    connect you with the heart of Africa.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;