-- Rename column for property_listings: proximity_to_sandton -> proximity_to_landmark
ALTER TABLE property_listings RENAME COLUMN proximity_to_sandton TO proximity_to_landmark;
