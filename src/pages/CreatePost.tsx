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
import { X, Sparkles, Heart, Star, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categories = [
  'Motivation',
  'Gratitude', 
  'Achievement',
  'Inspiration',
  'Mindfulness',
  'Personal Growth',
  'Kindness',
  'Adventure'
];

const burstAnimations = [
  { id: 'sparkles', name: 'Sparkles', icon: Sparkles },
  { id: 'hearts', name: 'Hearts', icon: Heart },
  { id: 'stars', name: 'Stars', icon: Star },
  { id: 'energy', name: 'Energy', icon: Zap },
];

const CreatePost = () => {
  const { user, userProfile, loading } = useAuth();
  const { toast } = useToast();
  const [posting, setPosting] = useState(false);
  
  const [formData, setFormData] = useState({
    phrase: '',
    category: '',
    tags: [] as string[],
    burstAnimation: 'sparkles',
    tagInput: '',
  });

  const addTag = () => {
    if (formData.tagInput.trim() && formData.tags.length < (userProfile?.isPremium ? 6 : 3)) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phrase.trim() || !formData.category) return;
    
    setPosting(true);
    try {
      // TODO: Save post to Firebase
      toast({
        title: "Post submitted!",
        description: "Your post will appear in the feed shortly after review.",
      });
      
      // Reset form
      setFormData({
        phrase: '',
        category: '',
        tags: [],
        burstAnimation: 'sparkles',
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
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card className="border-border-soft shadow-lg">
          <CardHeader>
            <CardTitle className="text-text-primary">Create a Post</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phrase Input */}
              <div>
                <Label htmlFor="phrase" className="text-text-primary">Your Phrase</Label>
                <Textarea
                  id="phrase"
                  value={formData.phrase}
                  onChange={(e) => setFormData(prev => ({ ...prev, phrase: e.target.value }))}
                  placeholder="Share something positive..."
                  className="mt-1 min-h-[100px]"
                  maxLength={280}
                  required
                />
                <p className="text-text-muted text-xs mt-1">
                  {formData.phrase.length}/280 characters
                </p>
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

              {/* Tags Input */}
              <div>
                <Label htmlFor="tags" className="text-text-primary">
                  Tags ({formData.tags.length}/{userProfile?.isPremium ? 6 : 3})
                </Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="tags"
                    value={formData.tagInput}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    disabled={formData.tags.length >= (userProfile?.isPremium ? 6 : 3)}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    disabled={!formData.tagInput.trim() || formData.tags.length >= (userProfile?.isPremium ? 6 : 3)}
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

              {/* Burst Animation Selection */}
              <div>
                <Label className="text-text-primary">Burst Animation</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {burstAnimations.map((animation) => {
                    const Icon = animation.icon;
                    return (
                      <button
                        key={animation.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, burstAnimation: animation.id }))}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                          formData.burstAnimation === animation.id
                            ? 'border-primary bg-primary-soft text-primary'
                            : 'border-border hover:border-border-strong'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{animation.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={posting || !formData.phrase.trim() || !formData.category}
                variant="premium"
                className="w-full"
              >
                {posting ? 'Posting...' : 'Share Post'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;