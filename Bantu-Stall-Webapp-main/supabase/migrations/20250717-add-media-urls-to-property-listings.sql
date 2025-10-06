-- Add media_urls column to property_listings for storing uploaded file URLs
ALTER TABLE property_listings ADD COLUMN media_urls text[];
