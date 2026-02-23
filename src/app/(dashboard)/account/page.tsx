"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  Edit,
  Save,
  X,
  Shield,
  CreditCard,
  Bell,
  Lock,
  Smartphone,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Settings,
  Download,
  QrCode,
  Camera,
  Trash2,
  Plus,
  Copy
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth-store';

export default function AccountPage() {
  const { user, isAuthenticated, getProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  // Extract pharmacy data (handle both object and string)
  const pharmacyData = useMemo(() => {
    if (!user) return null;
    return typeof user.pharmacy === 'object' ? user.pharmacy : null;
  }, [user]);

  const isPharmacy = useMemo(() => {
    return user?.role === 'pharmacy' || user?.role === 'admin' || !!pharmacyData;
  }, [user, pharmacyData]);

  // Initialize form data from auth store
  const initialUserData = useMemo(() => {
    if (!user) return null;
    
    const pharmacyObj = typeof user.pharmacy === 'object' ? user.pharmacy : null;
    
    return {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phoneNumber || '',
      location: user.location || pharmacyObj?.location || '',
      businessName: pharmacyObj?.pharmacy || user.businessName || '',
      licenceNumber: pharmacyObj?.licenceNumber || user.licenceNumber || '',
      branch: pharmacyObj?.branch || user.branch || 1,
      pharmacyId: pharmacyObj?.pharmacyId || user.pharmacyId || '',
      region: pharmacyObj?.region || '',
      city: pharmacyObj?.city || '',
      gps: pharmacyObj?.gps || '',
      pharmacyBio: pharmacyObj?.pharmacyBio || user.pharmacyBio || '',
      role: user.role || '',
      staffId: user.staffId || '',
      verifiedUser: user.verifiedUser || false,
      registrationDate: pharmacyObj?.dateCreated || user.dateCreated || user.createdAt || '',
      avatar: pharmacyObj?.photo || user.avatar || user.photo || ''
    };
  }, [user]);

  const [formData, setFormData] = useState(initialUserData || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    businessName: '',
    licenceNumber: '',
    branch: 1,
    pharmacyId: '',
    region: '',
    city: '',
    gps: '',
    pharmacyBio: '',
    role: '',
    staffId: '',
    verifiedUser: false,
    registrationDate: '',
    avatar: ''
  });

  // Update form data when user data changes
  useEffect(() => {
    if (initialUserData) {
      setFormData(initialUserData);
    }
  }, [initialUserData]);

  // Fetch profile on mount if authenticated but user data is not loaded
  useEffect(() => {
    // Only fetch profile if authenticated and user data is missing
    if (isAuthenticated && !user) {
      getProfile();
    }
  }, [isAuthenticated, user, getProfile]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(userData);
  };

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const handlePasswordSave = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    setIsEditingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast.success('Password updated successfully!');
  };

  const handlePasswordCancel = () => {
    setIsEditingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleMfaToggle = (enabled: boolean) => {
    setMfaEnabled(enabled);
    if (enabled) {
      // Generate backup codes when enabling MFA
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
      setBackupCodes(codes);
      setShowBackupCodes(true);
      toast.success('MFA enabled successfully!');
    } else {
      setBackupCodes([]);
      setShowBackupCodes(false);
      toast.success('MFA disabled successfully!');
    }
  };

  const copyBackupCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Backup code copied!');
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Backup codes downloaded!');
  };

  return (
    <div className="min-h-screen p-6 mx-auto max-w-7xl">
      <div className="min-w-5xl mx-auto space-y-8 px-15 ">
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account, settings and preferences.</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          {/* Refined tabs container */}
          <div className="rounded-2xl   mb-6">
            <TabsList className="flex justify-start w-fit gap-2 p-5 h-12 bg-transparent bg-muted">
              <TabsTrigger
                value="general"
                className="px-4 py-2 rounded-full border border-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:bg-transparent data-[state=inactive]:hover:border-gray-200 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="px-4 py-2 rounded-full border border-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:bg-transparent data-[state=inactive]:hover:border-gray-200 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="px-4 py-2 rounded-full border border-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:bg-transparent data-[state=inactive]:hover:border-gray-200 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors"
              >
                Password
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="px-4 py-2 rounded-full border border-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:bg-transparent data-[state=inactive]:hover:border-gray-200 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors"
              >
                Appearance
              </TabsTrigger>
            </TabsList>
          </div>

          {/* General */}
          <TabsContent value="general" className="w-full">
            <div className="space-y-6">
              {isLoading && !user ? (
                <div className="bg-white rounded-2xl border p-6 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                  <span className="ml-2 text-gray-600">Loading account information...</span>
                </div>
              ) : !user ? (
                <div className="bg-white rounded-2xl border p-6 text-center">
                  <p className="text-gray-600">Please log in to view your account information.</p>
                </div>
              ) : (
                <>
                  {/* Pharmacy Information - Show only if user is a pharmacy/admin */}
                  {isPharmacy && (
                    <div className="bg-white rounded-2xl border shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_rgba(16,185,129,0.06)]">
                      <div className="p-6">
                        <div className="mb-4">
                          <div className="text-base font-semibold">Pharmacy Information</div>
                          <div className="text-sm text-muted-foreground">Update your pharmacy details</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm">Pharmacy Name</Label>
                            <Input 
                              value={formData.businessName} 
                              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                              placeholder="Enter pharmacy name" 
                              className="mt-1 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]" 
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Pharmacy Licence Number</Label>
                            <Input 
                              value={formData.licenceNumber} 
                              onChange={(e) => setFormData({...formData, licenceNumber: e.target.value})}
                              placeholder="Enter pharmacy licence number" 
                              className="mt-1 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]" 
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Pharmacy Location</Label>
                            <Input 
                              value={formData.location} 
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              placeholder="Enter location" 
                              className="mt-1 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]" 
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Total Branches</Label>
                            <Input 
                              type="number"
                              value={formData.branch} 
                              onChange={(e) => setFormData({...formData, branch: parseInt(e.target.value) || 1})}
                              placeholder="Enter total number of branches" 
                              className="mt-1 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]" 
                              disabled={!isEditing}
                            />
                          </div>
                          {formData.region && (
                            <div>
                              <Label className="text-sm">Region</Label>
                              <Input 
                                value={formData.region} 
                                onChange={(e) => setFormData({...formData, region: e.target.value})}
                                placeholder="Enter region" 
                                className="mt-1 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]" 
                                disabled={!isEditing}
                              />
                            </div>
                          )}
                          {formData.city && (
                            <div>
                              <Label className="text-sm">City</Label>
                              <Input 
                                value={formData.city} 
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                placeholder="Enter city" 
                                className="mt-1 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]" 
                                disabled={!isEditing}
                              />
                            </div>
                          )}
                          {formData.pharmacyId && (
                            <div>
                              <Label className="text-sm">Pharmacy ID</Label>
                              <Input 
                                value={formData.pharmacyId} 
                                className="mt-1 h-11 rounded-xl border-gray-200 bg-gray-50" 
                                disabled
                              />
                            </div>
                          )}
                          {formData.registrationDate && (
                            <div>
                              <Label className="text-sm">Registration Date</Label>
                              <Input 
                                value={new Date(formData.registrationDate).toLocaleDateString()} 
                                className="mt-1 h-11 rounded-xl border-gray-200 bg-gray-50" 
                                disabled
                              />
                            </div>
                          )}
                        </div>
                        <div className="mt-4">
                          <Label className="text-sm mb-2 block">Role</Label>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="px-3 py-1">
                              {formData.role || 'N/A'}
                            </Badge>
                            {formData.verifiedUser && (
                              <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="border-t p-4 flex justify-end gap-3">
                        {!isEditing ? (
                          <Button onClick={handleEdit} className="bg-emerald-600 hover:bg-emerald-700">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        ) : (
                          <>
                            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* User Account */}
                  <div className="bg-white rounded-2xl border shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_rgba(16,185,129,0.06)]">
                    <div className="p-6">
                      <div className="mb-4">
                        <div className="text-base font-semibold">User Account</div>
                        <div className="text-sm text-muted-foreground">Update your account information</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">First Name</Label>
                          <Input 
                            value={formData.firstName} 
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            placeholder="Enter first name" 
                            className="mt-1 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]" 
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Last Name</Label>
                          <Input 
                            value={formData.lastName} 
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            placeholder="Enter last name" 
                            className="mt-1 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]" 
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Email</Label>
                          <Input 
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="Enter email" 
                            className="mt-1 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]" 
                            disabled={!isEditing}
                            type="email"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Phone Number</Label>
                          <Input 
                            value={formData.phone} 
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="eg. 0540977343" 
                            className="mt-1 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]" 
                            disabled={!isEditing}
                          />
                        </div>
                        {formData.staffId && (
                          <div>
                            <Label className="text-sm">Staff ID</Label>
                            <Input 
                              value={formData.staffId} 
                              className="mt-1 h-11 rounded-xl border-gray-200 bg-gray-50" 
                              disabled
                            />
                          </div>
                        )}
                        {formData.location && !isPharmacy && (
                          <div>
                            <Label className="text-sm">Location</Label>
                            <Input 
                              value={formData.location} 
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              placeholder="Enter location" 
                              className="mt-1 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]" 
                              disabled={!isEditing}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border-t p-4 flex justify-end gap-3">
                      {!isEditing ? (
                        <Button onClick={handleEdit} className="bg-emerald-600 hover:bg-emerald-700">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="w-full">
            <div className="bg-white rounded-2xl border shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_rgba(16,185,129,0.06)]">
              <div className="p-6 space-y-4">
                <div className="text-base font-semibold">Notification Preferences</div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive updates via email</div>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-emerald-600" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive updates via SMS</div>
                  </div>
                  <Switch className="data-[state=checked]:bg-emerald-600" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive push notifications in browser</div>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-emerald-600" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Password */}
          <TabsContent value="password" className="w-full">
            <div className="bg-white rounded-2xl border shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_rgba(16,185,129,0.06)]">
              <div className="p-6">
                <div className="mb-2 text-base font-semibold">Password</div>
                <div className="text-sm text-muted-foreground mb-6">Kindly provide your current and new passwords to successfully update your password</div>
                <div className="space-y-4 max-w-2xl">
                  <div>
                    <Label className="text-sm">Current Password</Label>
                    <div className="relative mt-1">
                      <Input type={showPasswords.current ? "text" : "password"} placeholder="***********" className="pr-10 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-200" value={passwordData.currentPassword} onChange={(e)=>setPasswordData({...passwordData,currentPassword:e.target.value})} />
                      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-10 px-3" onClick={()=>togglePasswordVisibility('current')}>{showPasswords.current ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">New Password</Label>
                    <div className="relative mt-1">
                      <Input type={showPasswords.new ? "text" : "password"} placeholder="***********" className="pr-10 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-200" value={passwordData.newPassword} onChange={(e)=>setPasswordData({...passwordData,newPassword:e.target.value})} />
                      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-10 px-3" onClick={()=>togglePasswordVisibility('new')}>{showPasswords.new ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Confirm New Password</Label>
                    <div className="relative mt-1">
                      <Input type={showPasswords.confirm ? "text" : "password"} placeholder="***********" className="pr-10 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-200" value={passwordData.confirmPassword} onChange={(e)=>setPasswordData({...passwordData,confirmPassword:e.target.value})} />
                      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-10 px-3" onClick={()=>togglePasswordVisibility('confirm')}>{showPasswords.confirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t p-4 flex items-center justify-end gap-3">
                <Button variant="outline" onClick={handlePasswordCancel}>Cancel</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handlePasswordSave}>Update Password</Button>
              </div>
            </div>

            {/* MFA Section */}
            <div className="mt-6 bg-white rounded-2xl border shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_rgba(16,185,129,0.06)]">
              <div className="p-6 space-y-4">
                <div className="text-base font-semibold">Multi‑Factor Authentication</div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/60">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Authenticator App</div>
                      <div className="text-sm text-muted-foreground">Use an app like Google Authenticator</div>
                    </div>
                  </div>
                  <Switch checked={mfaEnabled} onCheckedChange={handleMfaToggle} className="data-[state=checked]:bg-emerald-600" />
                </div>

                {mfaEnabled && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">MFA is enabled. Your account is now more secure.</AlertDescription>
                  </Alert>
                )}

                {showBackupCodes && (
                  <div className="space-y-4 p-4 rounded-lg border bg-white">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <div className="font-medium">Backup Codes</div>
                    </div>
                    <p className="text-sm text-muted-foreground">Store these codes securely. Each code can be used once.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {backupCodes.map((code, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 rounded-md border bg-gray-50">
                          <code className="text-sm font-mono">{code}</code>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copyBackupCode(code)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" onClick={downloadBackupCodes}>
                      <Download className="w-4 h-4" /> Download Codes
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Account Deletion */}
            <div className="mt-6 bg-white rounded-2xl border shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_rgba(239,68,68,0.06)]">
              <div className="p-6 space-y-3">
                <div className="text-base font-semibold text-red-700 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" /> Delete Account
                </div>
                <p className="text-sm text-muted-foreground">This action is permanent and cannot be undone. To confirm, type DELETE below.</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Input value={deleteConfirm} onChange={(e)=>setDeleteConfirm(e.target.value)} placeholder="Type DELETE to confirm" className="h-11 rounded-xl border-red-200/80 focus:border-red-500 focus:ring-red-200 w-full sm:max-w-sm" />
                  <Button
                    variant="destructive"
                    disabled={deleteConfirm !== "DELETE"}
                    onClick={()=>{ toast.success("Request to delete account captured."); setDeleteConfirm(""); }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Permanently Delete
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="w-full">
            <div className="bg-white rounded-2xl border shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_rgba(16,185,129,0.06)]">
              <div className="p-6">
                <div className="mb-4">
                  <div className="text-base font-semibold">Appearance Settings</div>
                  <div className="text-sm text-muted-foreground">Customize the look and feel of the application</div>
                </div>
                <div>
                  <Label className="text-sm mb-2 block">Theme</Label>
                  <RadioGroup defaultValue="light" className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light">Light</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark">Dark</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" />
                      <Label htmlFor="theme-system">System</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="border-t p-4 flex justify-end">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Save Preference</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}