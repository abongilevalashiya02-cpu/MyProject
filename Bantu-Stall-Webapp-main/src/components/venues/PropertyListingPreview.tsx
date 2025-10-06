import React from 'react';
import { PropertyListingFormData } from './forms/propertyListingSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Building, Phone, Mail, Globe } from 'lucide-react';

interface PropertyListingPreviewProps {
  formData: PropertyListingFormData;
}

const PropertyListingPreview: React.FC<PropertyListingPreviewProps> = ({ formData }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {formData.propertyName || 'Property Name'}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{formData.propertyType || 'Property Type'}</Badge>
            {formData.luxury && <Badge className="bg-purple-100 text-purple-800">Luxury</Badge>}
            {formData.ecoFriendly && <Badge className="bg-green-100 text-green-800">Eco-Friendly</Badge>}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Location */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{formData.location || 'Location'}, {formData.area || 'Area'}</span>
          </div>
          
          {/* Capacity */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              Capacity: {formData.minCapacity || 0} - {formData.maxCapacity || 0} guests
            </span>
          </div>
          
          {/* Rooms */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>Total Rooms: {formData.totalRooms || 0}</div>
            <div>Meeting Rooms: {formData.meetingRooms || 0}</div>
          </div>
          
          {/* Description */}
          {formData.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{formData.description}</p>
            </div>
          )}
          
          {/* Amenities */}
          {formData.amenities && formData.amenities.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-1">
                {formData.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Contact Information */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Contact Information</h4>
            <div className="space-y-2 text-sm">
              {formData.contactName && (
                <div>Contact: {formData.contactName}</div>
              )}
              {formData.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  {formData.contactEmail}
                </div>
              )}
              {formData.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  {formData.contactPhone}
                </div>
              )}
              {formData.websiteUrl && (
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  <a href={formData.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Website
                  </a>
                </div>
              )}
            </div>
          </div>
          
          {/* Pricing */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Pricing</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {formData.priceRangeUSD && (
                <div>USD: {formData.priceRangeUSD}</div>
              )}
              {formData.priceRangeZAR && (
                <div>ZAR: {formData.priceRangeZAR}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyListingPreview;