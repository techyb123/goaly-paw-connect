import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, Upload, Link as LinkIcon, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ProfileSetup = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  
  const [formData, setFormData] = useState({
    username: userProfile?.username || '',
    bio: userProfile?.bio || 'Thanks for checking out my profile!',
    personalLink: userProfile?.personalLink || '',
    animalName: userProfile?.animalName || '',
    animalLocation: userProfile?.animalLocation || '',
    petfinderLink: userProfile?.petfinderLink || '',
  });

  const canEditProfile = userProfile?.animalPhoto && userProfile?.petfinderLink;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile(formData);
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
    if (!formData.petfinderLink.includes('petfinder.com')) {
      toast({
        title: "Invalid link",
        description: "Please enter a valid Petfinder.com link.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile({
        animalName: formData.animalName,
        animalLocation: formData.animalLocation,
        petfinderLink: formData.petfinderLink,
        animalPhoto: 'placeholder', // Would handle file upload here
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

  if (!canEditProfile && !showAnimalForm) {
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
            <div className="bg-accent-soft p-4 rounded-lg border border-accent/20">
              <p className="text-text-primary font-medium mb-2">Getting Started</p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Please go to Petfinder.com and find a rescue animal you'd like to feature. 
                You can edit yourself in the photo with them, but the rescue animal must be 
                in the foreground of the photo.
              </p>
            </div>
            
            <Button 
              onClick={() => setShowAnimalForm(true)}
              variant="premium"
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Set Up Animal Profile
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
                <Label className="text-text-primary">Animal Photo</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="mx-auto w-8 h-8 text-text-muted mb-2" />
                  <p className="text-text-secondary text-sm">
                    Upload a photo with the rescue animal in the foreground
                  </p>
                </div>
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
                <Label htmlFor="animalLocation" className="text-text-primary">Location (City, State)</Label>
                <Input
                  id="animalLocation"
                  value={formData.animalLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, animalLocation: e.target.value }))}
                  placeholder="e.g., Austin, TX"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="petfinderLink" className="text-text-primary">Petfinder Link</Label>
                <Input
                  id="petfinderLink"
                  value={formData.petfinderLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, petfinderLink: e.target.value }))}
                  placeholder="https://www.petfinder.com/..."
                  className="mt-1"
                />
                <p className="text-text-muted text-xs mt-1">
                  Must be a valid Petfinder.com link
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
                disabled={saving || !formData.animalName || !formData.animalLocation || !formData.petfinderLink}
                variant="premium"
                className="flex-1"
              >
                {saving ? 'Saving...' : 'Save Animal Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Premium Upgrade Banner */}
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

      {/* Profile Form */}
      <Card className="border-border-soft shadow-lg">
        <CardHeader>
          <CardTitle className="text-text-primary">Profile Settings</CardTitle>
          <CardDescription className="text-text-secondary">
            Customize your profile information
          </CardDescription>
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
            />
            <p className="text-text-muted text-xs mt-1">
              {userProfile?.isPremium 
                ? "Premium users can change anytime" 
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
              placeholder="Tell people about yourself..."
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
                placeholder="https://yourwebsite.com"
                className="pl-10"
              />
            </div>
          </div>

          {userProfile?.isPremium && (
            <div>
              <Label htmlFor="onPostLink" className="text-text-primary flex items-center space-x-2">
                <span>Bonus Link on Posts!</span>
                <Crown className="w-4 h-4 text-accent" />
              </Label>
              <Input
                id="onPostLink"
                placeholder="https://bonus-link.com"
                className="mt-1"
              />
              <p className="text-text-muted text-xs mt-1">
                Premium feature: Add a clickable link to all your posts
              </p>
            </div>
          )}
          
          <Separator className="bg-border-soft" />
          
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
    </div>
  );
};