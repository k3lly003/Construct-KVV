'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GenericButton } from '@/components/ui/generic-button';
import { MapPin, Store } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useShop } from '@/app/hooks/useShop';
import { toast } from 'sonner';
import { getUserDataFromLocalStorage } from '@/app/utils/middlewares/UserCredentions';
import { UserData } from '@/utils/dtos/profile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProfileHeader() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { createShop, isCreating, myShop, isMyShopLoading, isUpdating } = useShop();
  
  useEffect(() => {
    const data = getUserDataFromLocalStorage();
    setUserData(data);
  }, []);

  const [shopData, setShopData] = useState({
    name: '',
    description: '',
    slug: '',
    logo: null as File | string | null,
    isActive: true,
  });

  // Edit Profile Form Data
  const [editFormData, setEditFormData] = useState({
    // Personal Info
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    location: '',
    
    // Shop Info
    shopName: myShop?.name || '',
    shopPhone: myShop?.phone || '',
    shopDescription: myShop?.description || '',
    workingDays: '',
    
    // Profile Content
    about: 'Hi I\'m Anna Adame, It will be as simple as Occidental; in fact, it will be Occidental. To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what Occidental is European languages are members of the same family.',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    }
  });

  // Update form data when userData or myShop changes
  useEffect(() => {
    if (userData) {
      setEditFormData(prev => ({
        ...prev,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
      }));
    }
  }, [userData]);

  useEffect(() => {
    if (myShop) {
      setEditFormData(prev => ({
        ...prev,
        shopName: myShop.name || '',
        shopPhone: myShop.phone || '',
        shopDescription: myShop.description || '',
      }));
    }
  }, [myShop]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShopData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setShopData(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const handleCreateShop = () => {
    const formData = new FormData();
    formData.append('name', shopData.name);
    formData.append('description', shopData.description);
    formData.append('slug', shopData.slug);
    if (shopData.logo) {
      formData.append('logo', shopData.logo);
    }
    formData.append('isActive', String(shopData.isActive));

    createShop(formData, {
      onSuccess: () => {
        toast.success('Shop created successfully!');
        setOpen(false);
        // Reset form
        setShopData({
            name: '',
            description: '',
            slug: '',
            logo: null as File | string | null,
            isActive: true,
        });
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create shop.');
      },
    });
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
    setEditOpen(false);
  };

  // Get user's full name and role
  const fullName = userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...';
  const userRole = userData?.role || 'User';

  return (
    <div className="relative bg-gradient-to-r from-amber-600 via-yellow-600 to-yellow-100 text-white max-w-9xl mx-auto h-80 z-10">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-9xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <Avatar className="w-24 h-24 border-4 border-white/20">
              <AvatarImage src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" />
              <AvatarFallback>AA</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{fullName}</h1>
              <p className="text-lg text-white/90">{userRole}</p>
              <div className="flex items-center space-x-4 text-sm text-white/80">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>California, United States</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Store className="w-4 h-6" />
                  <span>{myShop?.name || 'Themescraft'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-8 ">
            {/* Only show Create Shop button if no shop exists and not loading */}
            {!isMyShopLoading && !myShop && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                   <GenericButton className="text-right">Create a shop</GenericButton>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create a New Shop</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to set up your new shop.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input id="name" name="name" value={shopData.name} onChange={handleInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">Description</Label>
                      <Textarea id="description" name="description" value={shopData.description} onChange={handleInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="slug" className="text-right">Slug</Label>
                      <Input id="slug" name="slug" value={shopData.slug} onChange={handleInputChange} className="col-span-3" placeholder="e.g., my-awesome-shop" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="logo" className="text-right">Logo</Label>
                      <Input id="logo" name="logo" type="file" onChange={handleFileChange} className="col-span-3" accept="image/*" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="isActive" className="text-right">Active</Label>
                      <Switch id="isActive" checked={shopData.isActive} onCheckedChange={(checked) => setShopData(prev => ({ ...prev, isActive: checked }))} />
                    </div>
                  </div>
                  <DialogFooter>
                    <GenericButton type="submit" onClick={handleCreateShop} disabled={isCreating}>
                      {isCreating ? 'Creating...' : 'Create Shop'}
                    </GenericButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Edit Profile Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <GenericButton variant="secondary" className="bg-white/10 hover:bg-white/50 text-amber-600 border-2 border-amber-600/20">
                  Edit Profile
                </GenericButton>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your personal information, shop details, and profile content.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="shop">Shop Info</TabsTrigger>
                    <TabsTrigger value="content">Profile Content</TabsTrigger>
                  </TabsList>
                  {/* Personal Information */}
                  <TabsContent value="personal" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input 
                              id="firstName" 
                              name="firstName" 
                              value={editFormData.firstName} 
                              onChange={handleEditInputChange} 
                            />
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input 
                              id="lastName" 
                              name="lastName" 
                              value={editFormData.lastName} 
                              onChange={handleEditInputChange} 
                            />
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={editFormData.email} 
                            onChange={handleEditInputChange} 
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={editFormData.phone} 
                            onChange={handleEditInputChange} 
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            name="location" 
                            value={editFormData.location} 
                            onChange={handleEditInputChange} 
                            placeholder="e.g., California, United States"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  {/* Shop Information */}
                  <TabsContent value="shop" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Shop Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="shopName">Shop Name</Label>
                          <Input 
                            id="shopName" 
                            name="shopName" 
                            value={editFormData.shopName} 
                            onChange={handleEditInputChange} 
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="shopPhone">Shop Phone</Label>
                          <Input 
                            id="shopPhone" 
                            name="shopPhone" 
                            value={editFormData.shopPhone} 
                            onChange={handleEditInputChange} 
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="shopDescription">Shop Description</Label>
                          <Textarea 
                            id="shopDescription" 
                            name="shopDescription" 
                            value={editFormData.shopDescription} 
                            onChange={handleEditInputChange} 
                            rows={4}
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="workingDays">Working Days</Label>
                          <Input 
                            id="workingDays" 
                            name="workingDays" 
                            value={editFormData.workingDays} 
                            onChange={handleEditInputChange} 
                            placeholder="e.g., Monday - Friday, 9 AM - 6 PM"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  {/* Profile Content */}
                  <TabsContent value="content" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Content</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="about">About</Label>
                          <Textarea 
                            id="about" 
                            name="about" 
                            value={editFormData.about} 
                            onChange={handleEditInputChange} 
                            rows={6}
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Label>Social Media Links</Label>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="facebook" className="text-sm">Facebook</Label>
                              <Input 
                                id="facebook" 
                                value={editFormData.socialMedia.facebook} 
                                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)} 
                                placeholder="https://facebook.com/username"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="instagram" className="text-sm">Instagram</Label>
                              <Input 
                                id="instagram" 
                                value={editFormData.socialMedia.instagram} 
                                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)} 
                                placeholder="https://instagram.com/username"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="twitter" className="text-sm">Twitter</Label>
                              <Input 
                                id="twitter" 
                                value={editFormData.socialMedia.twitter} 
                                onChange={(e) => handleSocialMediaChange('twitter', e.target.value)} 
                                placeholder="https://twitter.com/username"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
                              <Input 
                                id="linkedin" 
                                value={editFormData.socialMedia.linkedin} 
                                onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)} 
                                placeholder="https://linkedin.com/in/username"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <GenericButton variant="outline" onClick={() => setEditOpen(false)}>
                    Cancel
                  </GenericButton>
                  <GenericButton onClick={handleSaveProfile} disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </GenericButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex space-x-8 my-8 py-5 border-b border-white mt-[-1px]"></div>
      </div>
    </div>
  );
}