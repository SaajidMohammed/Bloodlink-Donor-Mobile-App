// constants/API.ts

// Replace with your actual Render URL
export const BASE_URL = 'https://bloodlink-server-g6ee.onrender.com/api';

export const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DONOR_PROFILE: '/donor/profile',
  ACTIVE_REQUESTS: '/donor/active-requests', // Verify this path in your backend routes
  HOSPITALS: '/hospital/all',
  RESPOND_TO_REQUEST: (id: string) => `/donor/respond/${id}`,
};

// TypeScript Interfaces for API Data
export interface BloodRequest {
  id: string; // UUID from PostgreSQL
  hospital_name?: string;
  blood_group: string;
  units_required: number;
  city?: string;
  reason?: string;
  status?: string;
  created_at?: string;
  hospitalName?: string;
  hospital?: {
    hospital_name?: string;
    name?: string;
    city?: string;
    address?: string;
  };
  created_by?: {
    name?: string;
    hospital_name?: string;
    city?: string;
  };
  user?: {
    name?: string;
    hospital_name?: string;
    city?: string;
  };
}

export interface Hospital {
  city: any;
  id: string; // UUID
  hospital_name: string;
  address: string;
  contact_number: string;
  email: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
}

export interface DonorProfile {
  name: string;
  email: string;
  blood_group: string;
  city: string;
  donations_count: number; // Driven by the DB count query
}