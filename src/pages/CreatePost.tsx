import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { AuthForm } from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Sparkles, Heart, Star, DollarSign, User, Mic, Crown, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categories = [
  'Love',
  'Wealth',
  'Health',
  'Learn',
  'Speech',
  'Luck',
  'Humor',
  'Other'
];

const burstAnimations = [
  { id: 'heart', name: 'Pink Heart', icon: Heart, color: 'text-pink-500' },
  { id: 'money', name: 'Dollar Bills', icon: DollarSign, color: 'text-green-500' },
  { id: 'person', name: 'Person Outline', icon: User, color: 'text-blue-500' },
  { id: 'stars', name: 'Yellow Stars', icon: Star, color: 'text-yellow-500' },
  { id: 'clover', name: 'Four Leaf Clover', icon: Sparkles, color: 'text-green-400' },
];

const CreatePost = () => {
  const { user, userProfile, loading } = useAuth();
  const { toast } = useToast();
  const [posting, setPosting] = useState(false);
  const [showMicInstructions, setShowMicInstructions] = useState(false);
  const [showPostSuccess, setShowPostSuccess] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [continuousListening, setContinuousListening] = useState(false);
  
  const [formData, setFormData] = useState({
    phrase: '',
    category: '',
    tags: [] as string[],
    burstAnimation: 'heart',
    tagInput: '',
  });

  const maxTags = userProfile?.isPremium ? 6 : 2;
  const maxPhraseLength = 101;

  // Check if user can post (premium can post anytime, free users have 24hr limit)
  const canPost = userProfile?.isPremium || true; // TODO: Implement 24hr check for free users

  const addTag = () => {
    if (formData.tagInput.trim() && formData.tags.length < maxTags) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: '',
      }));
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleMicClick = () => {
    if (!showMicInstructions) {
      setShowMicInstructions(true);
      return;
    }
    
    // Toggle listening state
    setIsListening(!isListening);
  };

  const handleMicLongPress = () => {
    setContinuousListening(true);
    setIsListening(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile?.animalPhoto || !userProfile?.petfinderLink) {
      toast({
        title: "Complete your profile first",
        description: "Please set up your animal rescue profile before posting.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phrase.trim() || !formData.category) return;
    
    setPosting(true);
    try {
      // TODO: Save post to Firebase with moderation status = 'pending'
      setShowPostSuccess(true);
      
      // Reset form
      setFormData({
        phrase: '',
        category: '',
        tags: [],
        burstAnimation: 'heart',
        tagInput: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-border-soft shadow-lg">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Post or Save Affirmations & Goals with a Free Account!
              </h2>
              <p className="text-text-secondary text-sm">
                Login or Create free account, Post Your Goal or Affirmation!
              </p>
            </div>
            <AuthForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if posting is disabled by admin
  const postsDisabled = false; // TODO: Get from admin settings
  if (postsDisabled) {
    return (
      <div className="min-h-screen bg-gradient-surface">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Card className="border-border-soft shadow-lg">
            <CardContent className="p-6 text-center space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-accent" />
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-2">
                  Posts Temporarily Paused
                </h2>
                <p className="text-text-secondary">
                  We are currently pausing posts in order to upgrade our system. Please check back later. Thanks!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card className="border-border-soft shadow-lg">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center justify-between">
              <span>Create a Post</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMicClick}
                  onMouseDown={handleMicLongPress}
                  className={`p-2 ${isListening ? 'bg-green-500 text-white' : ''} ${continuousListening ? 'bg-green-600' : ''}`}
                >
                  <Mic className="w-5 h-5" />
                </Button>
                {userProfile?.isPremium && (
                  <Badge variant="default" className="bg-gradient-accent">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phrase Input */}
              <div>
                <Label htmlFor="phrase" className="text-text-primary">
                  The phrase you want to show
                </Label>
                <Textarea
                  id="phrase"
                  value={formData.phrase}
                  onChange={(e) => setFormData(prev => ({ ...prev, phrase: e.target.value }))}
                  placeholder="Enter your positive phrase..."
                  className="mt-1 min-h-[100px] font-['Fredoka_One'] text-lg"
                  maxLength={maxPhraseLength}
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-text-muted text-xs">
                    {formData.phrase.length}/{maxPhraseLength} Characters Used
                  </p>
                </div>
                <div className="mt-2 text-xs text-text-muted">
                  Must be positive, nothing copyrighted or trademarks, no references real people or business. See FAQ for more...
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <Label htmlFor="category" className="text-text-primary">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Burst Animation Selection */}
              <div>
                <Label className="text-text-primary">
                  Choose Animation "Burst from Center" Image
                </Label>
                <p className="text-text-muted text-xs mt-1 mb-3">
                  This image "bursts" from center of your text when they finish tracing or saying the phrase.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {burstAnimations.map((animation) => {
                    const Icon = animation.icon;
                    return (
                      <button
                        key={animation.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, burstAnimation: animation.id }))}
                        className={`p-4 rounded-lg border-2 transition-all flex items-center space-x-3 ${
                          formData.burstAnimation === animation.id
                            ? 'border-primary bg-primary-soft text-primary'
                            : 'border-border hover:border-border-strong'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${animation.color}`} />
                        <span className="text-sm font-medium">{animation.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <Label htmlFor="tags" className="text-text-primary">
                  Tags ({formData.tags.length}/{maxTags})
                </Label>
                <p className="text-text-muted text-xs mt-1 mb-2">
                  Things helps users find your posts when they search. Free users can enter 2 tags, Premium users can submit up to 6
                </p>
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    value={formData.tagInput}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                    placeholder="running, biking..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    disabled={formData.tags.length >= maxTags}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    disabled={!formData.tagInput.trim() || formData.tags.length >= maxTags}
                  >
                    Add
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={posting || !formData.phrase.trim() || !formData.category || !canPost}
                variant="premium"
                className="w-full"
              >
                {posting ? 'Posting...' : 'Submit Post'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Microphone Instructions Dialog */}
      <Dialog open={showMicInstructions} onOpenChange={setShowMicInstructions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Voice Input Instructions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-text-secondary">
              Say the phrase aloud to activate the animation! (This currently works best in the Chrome browser)
            </p>
            <p className="text-text-secondary">
              Also, if you hold down the microphone for three seconds, it will turn green and you can keep saying phrases without having to click it again.
            </p>
            <p className="text-text-secondary">
              Just click the green microphone again when it to stop listening.
            </p>
            <Button
              onClick={() => setShowMicInstructions(false)}
              variant="premium"
              className="w-full"
            >
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Post Success Dialog */}
      <Dialog open={showPostSuccess} onOpenChange={setShowPostSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post Submitted!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-text-secondary">
              Thank you for submitting your post! Provided it meets our code of conduct (respectful & family friendly, 
              no copyrighted content or mentioning real people or businesses) it should enter the feed shortly.
            </p>
            {!userProfile?.isPremium && (
              <div className="p-4 bg-accent-soft rounded-lg border border-accent/20">
                <p className="text-text-secondary text-sm mb-3">
                  P.S. If you want your posts to get approved more quickly consider our exclusive lifetime deal, 
                  with tons of perks, we are offering with this launch!
                </p>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => {
                    // TODO: Navigate to Stripe checkout
                    window.open('/upgrade', '_blank');
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Check out our lifetime deal
                </Button>
              </div>
            )}
            <Button
              onClick={() => setShowPostSuccess(false)}
              variant="premium"
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;