import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Heart, Crown, Upload, Globe, AlertCircle, Link as LinkIcon, Camera, ExternalLink } from 'lucide-react';
import { AnimalModal } from './AnimalModal';

export const ProfileSetup = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [animalPhoto, setAnimalPhoto] = useState<File | null>(null);
  const [animalPhotoPreview, setAnimalPhotoPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLinkWarning, setShowLinkWarning] = useState(false);
  const [pendingLink, setPendingLink] = useState('');
  
  const [formData, setFormData] = useState({
    username: userProfile?.username || '',
    bio: userProfile?.bio || 'Thanks for checking out my profile!',
    personalLink: userProfile?.personalLink || 'Link (Optional)',
    onPostLink: userProfile?.onPostLink || '',
    animalName: userProfile?.animalName || '',
    animalLocation: userProfile?.animalLocation || '',
    petfinderLink: userProfile?.petfinderLink || '',
  });

  const hasAnimalProfile = userProfile?.animalPhoto && userProfile?.petfinderLink;
  const canUsePremiumFeatures = userProfile?.isPremium;
  const canChangeUsername = userProfile?.isPremium || !userProfile?.usernameChangedAt || 
    (userProfile?.usernameChangedAt && 
     new Date().getTime() - new Date(userProfile.usernameChangedAt).getTime() > 7 * 24 * 60 * 60 * 1000);

  const validatePetfinderLink = (link: string) => {
    return link.includes('petfinder.com') && link.startsWith('https://');
  };

  const validateUsername = (username: string) => {
    return username.length >= 5 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAnimalPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAnimalPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLinkClick = (link: string) => {
    if (link && link !== 'Link (Optional)' && !link.startsWith('http')) {
      setShowLinkWarning(true);
      setPendingLink(link.startsWith('http') ? link : `https://${link}`);
    } else if (link.startsWith('http')) {
      window.open(link, '_blank');
    }
  };

  const handleSave = async () => {
    if (!hasAnimalProfile) {
      toast({
        title: "Animal profile required",
        description: "Please set up your animal rescue profile first before editing your bio or personal link.",
        variant: "destructive",
      });
      return;
    }

    if (formData.username !== userProfile?.username && !canChangeUsername) {
      toast({
        title: "Username change restricted",
        description: "Free users can only change their username once every 7 days.",
        variant: "destructive",
      });
      return;
    }

    if (!validateUsername(formData.username)) {
      toast({
        title: "Invalid username",
        description: "Username must be 5-20 characters and contain only letters, numbers, and underscores.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const updates: any = {
        username: formData.username,
        bio: formData.bio,
        personalLink: formData.personalLink,
      };

      if (canUsePremiumFeatures) {
        updates.onPostLink = formData.onPostLink;
      }

      if (formData.username !== userProfile?.username) {
        updates.usernameChangedAt = new Date();
      }

      await updateUserProfile(updates);
      toast({
        title: "Profile updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAnimalSave = async () => {
    if (!validatePetfinderLink(formData.petfinderLink)) {
      toast({
        title: "Invalid Petfinder link",
        description: "Please enter a valid Petfinder.com link starting with https://",
        variant: "destructive",
      });
      return;
    }

    if (!animalPhoto) {
      toast({
        title: "Photo required",
        description: "Please upload a photo of the rescue animal.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // In a real app, you'd upload the photo to Firebase Storage here
      const photoUrl = animalPhotoPreview; // Placeholder for uploaded photo URL
      
      await updateUserProfile({
        animalName: formData.animalName,
        animalLocation: formData.animalLocation,
        petfinderLink: formData.petfinderLink,
        animalPhoto: photoUrl,
      });
      
      setShowAnimalForm(false);
      toast({
        title: "Animal profile saved!",
        description: "You can now edit your bio and personal link.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save animal profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Show welcome message for new users without animal profile
  if (!hasAnimalProfile && !showAnimalForm) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card className="border-border-soft shadow-lg">
          <CardHeader className="text-center space-y-4">
            <Heart className="mx-auto w-12 h-12 text-accent" />
            <div>
              <CardTitle className="text-text-primary">Welcome to Goaly!</CardTitle>
              <CardDescription className="text-text-secondary mt-2">
                Every Goaly user shares their profile with a rescue animal in need
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert className="border-accent/20 bg-accent-soft">
              <Heart className="w-4 h-4" />
              <AlertDescription className="text-text-primary">
                <strong>Welcome!</strong> Every Goaly user shares their profile with a rescue animal available in need, 
                as well as a link to where a person can find them. Please go to Petfinder.com and find a rescue animal 
                you'd like to feature. You can also edit yourself in the photo with them, but the rescue animal must be 
                in the forefront of the photo.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <p className="text-text-secondary text-sm">
                Please share the photo, name, and location (City, State) of an animal on Petfinder attached to a rescue. 
                To save a photo just right-click and "Save As"
              </p>
            </div>
            
            <Button 
              onClick={() => setShowAnimalForm(true)}
              variant="premium"
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Profile Photo & Animal Rescue Link
            </Button>
            
            <div className="text-center">
              <p className="text-text-muted text-sm">
                Once you complete this step, you'll be able to customize your bio and add links
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Animal profile setup form
  if (showAnimalForm) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card className="border-border-soft shadow-lg">
          <CardHeader>
            <CardTitle className="text-text-primary">Animal Profile Setup</CardTitle>
            <CardDescription className="text-text-secondary">
              Share a rescue animal's story with your profile
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-text-primary">Rescue Animal Photo</Label>
                <p className="text-text-muted text-sm mb-2">
                  You may include yourself in background, if you wish, but rescue animal must be in foreground
                </p>
                <div 
                  className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {animalPhotoPreview ? (
                    <div className="space-y-2">
                      <img 
                        src={animalPhotoPreview} 
                        alt="Animal preview" 
                        className="mx-auto max-h-32 rounded-lg object-cover"
                      />
                      <p className="text-text-secondary text-sm">Click to change photo</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto w-8 h-8 text-text-muted mb-2" />
                      <p className="text-text-secondary text-sm">
                        Click to upload a photo with the rescue animal in the foreground
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              <div>
                <Label htmlFor="animalName" className="text-text-primary">Animal Name</Label>
                <Input
                  id="animalName"
                  value={formData.animalName}
                  onChange={(e) => setFormData(prev => ({ ...prev, animalName: e.target.value }))}
                  placeholder="Enter the animal's name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="animalLocation" className="text-text-primary">Animal Location (City, State)</Label>
                <Input
                  id="animalLocation"
                  value={formData.animalLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, animalLocation: e.target.value }))}
                  placeholder="e.g., Silver Spring, MD"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="petfinderLink" className="text-text-primary">Petfinder Link</Label>
                <Input
                  id="petfinderLink"
                  value={formData.petfinderLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, petfinderLink: e.target.value }))}
                  placeholder="https://www.petfinder.com/dog/squeak-77421213/md/silver-spring/lizzys-lodge-md270/"
                  className="mt-1"
                />
                <p className="text-text-muted text-xs mt-1">
                  Must be a valid Petfinder.com link starting with https://
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowAnimalForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAnimalSave}
                disabled={saving || !formData.animalName || !formData.animalLocation || !formData.petfinderLink || !animalPhoto}
                variant="premium"
                className="flex-1"
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main profile form (only shown after animal profile is complete)
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Premium Upgrade Banner - only show for free users */}
      {!userProfile?.isPremium && (
        <Card className="bg-gradient-primary border-0 text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6" />
              <div className="flex-1">
                <p className="font-medium">Get Featured with Lifetime Perks!</p>
                <p className="text-sm opacity-90">Unlock premium features and support rescue animals</p>
              </div>
              <Button variant="accent" size="sm">
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Animal Profile Display */}
      <Card className="border-border-soft shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-text-primary">Profile Settings</CardTitle>
              <CardDescription className="text-text-secondary">
                @{userProfile?.username} • {userProfile?.isPremium ? 'Premium' : 'Free'} Account
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowAnimalForm(true)}
                variant="outline"
                size="sm"
              >
                <Camera className="w-4 h-4 mr-1" />
                Update Animal
              </Button>
              <AnimalModal 
                animalName={userProfile?.animalName || ''}
                animalLocation={userProfile?.animalLocation || ''}
                animalPhoto={userProfile?.animalPhoto || ''}
                petfinderLink={userProfile?.petfinderLink || ''}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="username" className="text-text-primary">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="@yourusername"
              className="mt-1"
              disabled={!canChangeUsername}
            />
            <p className="text-text-muted text-xs mt-1">
              {userProfile?.isPremium 
                ? "Premium users can change anytime" 
                : canChangeUsername 
                  ? "You can change your username"
                  : "Free users can change once every 7 days"
              }
            </p>
          </div>
          
          <div>
            <Label htmlFor="bio" className="text-text-primary">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Thanks for checking out my profile!"
              className="mt-1 min-h-[80px]"
              maxLength={80}
            />
            <p className="text-text-muted text-xs mt-1">
              {formData.bio.length}/80 characters
            </p>
          </div>
          
          <div>
            <Label htmlFor="personalLink" className="text-text-primary">Personal Link</Label>
            <div className="relative mt-1">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                id="personalLink"
                value={formData.personalLink}
                onChange={(e) => setFormData(prev => ({ ...prev, personalLink: e.target.value }))}
                placeholder="Link (Optional)"
                className="pl-10"
              />
              {formData.personalLink && formData.personalLink !== 'Link (Optional)' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => handleLinkClick(formData.personalLink)}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {userProfile?.isPremium ? (
            <div>
              <Label htmlFor="onPostLink" className="text-text-primary flex items-center space-x-2">
                <span>Bonus Link on Posts!</span>
                <Crown className="w-4 h-4 text-accent" />
              </Label>
              <div className="relative mt-1">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input
                  id="onPostLink"
                  value={formData.onPostLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, onPostLink: e.target.value }))}
                  placeholder="https://your-website.com"
                  className="pl-10"
                />
              </div>
              <p className="text-text-muted text-xs mt-1">
                Premium feature: Add a clickable link to all your posts (Code of conduct applies, must be safe for work. Linktrees ok.)
              </p>
            </div>
          ) : (
            <div>
              <Label className="text-text-primary flex items-center space-x-2">
                <span>Bonus Link on Posts!</span>
                <Crown className="w-4 h-4 text-accent" />
              </Label>
              <div className="mt-1 p-4 border border-accent/20 rounded-lg bg-accent-soft">
                <p className="text-text-secondary text-sm mb-2">
                  Get our special lifetime deal, and let people click directly to your website straight from your posts! 
                  (Code of conduct applies, must be safe for work. Linktrees ok.)
                </p>
                <Button variant="accent" size="sm">
                  Click here to grab our special lifetime deal during our beta launch!
                </Button>
              </div>
            </div>
          )}
          
          <Separator className="bg-border-soft" />
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Button variant="ghost" size="sm" className="justify-start">
              FAQ
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start"
              onClick={() => window.open('https://goaly.ladesk.com', '_blank')}
            >
              Support
            </Button>
            <Button variant="ghost" size="sm" className="justify-start">
              PW Reset
            </Button>
            <Button variant="ghost" size="sm" className="justify-start">
              Log Out
            </Button>
          </div>
          
          <div className="text-center">
            <Button variant="ghost" size="sm" className="text-accent">
              Bookmarks
            </Button>
            <p className="text-text-muted text-xs mt-1">View your saved posts</p>
          </div>
          
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="premium"
            className="w-full"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Link Warning Dialog */}
      <Dialog open={showLinkWarning} onOpenChange={setShowLinkWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>External Link Warning</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-text-secondary">
              This link is taking you to another site. Is this ok?
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowLinkWarning(false)}
                className="flex-1"
              >
                No, Take Me Back
              </Button>
              <Button
                variant="premium"
                onClick={() => {
                  window.open(pendingLink, '_blank');
                  setShowLinkWarning(false);
                }}
                className="flex-1"
              >
                Yes, that's Ok
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};