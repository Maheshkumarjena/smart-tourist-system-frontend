export interface User {
  id: string;
  email: string;
  phone: string;
  profile?: {
    aadhaar?: string;
    passport?: string;
    itinerary?: {
      startDate: string;
      endDate: string;
      locations: string[];
    };
  };
  digitalId?: string;
  qrCode?: string;
}

export interface SafetyScore {
  score: number;
  factors: {
    location: number;
    weather: number;
    crowd: number;
    crime: number;
  };
  lastUpdated: string;
}

export interface Alert {
  id: string;
  type: 'safety' | 'weather' | 'traffic' | 'emergency';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relation: string;
}

export interface LocationPing {
  latitude: number;
  longitude: number;
  timestamp: string;
  zoneType?: 'safe' | 'risky' | 'restricted';
}

export interface PanicAlert {
  id: string;
  location: LocationPing;
  audioFile?: string;
  videoFile?: string;
  timestamp: string;
  status: 'pending' | 'responded' | 'resolved';
}