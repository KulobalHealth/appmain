export interface User {
  _id?: string;
  businessName: string;
  ownerName: string;
  location: string;
  email: string;
  telephone: string;
  password?: string;
  avatar?: string;
  role: 'pharmacy' | 'supplier' | 'otc' | 'admin';
  pharmacyName?: string;
  phoneNumber?: string;
  pharmacyEmail?: string;
  pharmacyLocation?: string;
  streetAddress?: string;
  gpsAddress?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}