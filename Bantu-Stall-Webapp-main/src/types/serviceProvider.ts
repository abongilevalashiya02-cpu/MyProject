
export interface ServiceProviderApplication {
  id: string;
  user_id?: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  location: string;
  provider_type: string;
  terms_accepted: boolean;
  profile_photo?: string;
  gov_id_document?: string;
  business_registration?: string;
  portfolio_images?: string[];
  professional_bio?: string;
  areas_of_expertise?: string[];
  languages?: string[];
  years_experience?: string;
  services_offered?: string;
  base_price?: number;
  price_per_person?: number;
  currency?: string;
  availability?: string;
  certifications?: string;
  status: string;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
}
