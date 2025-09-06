import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { AuthForm } from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield, Users, MessageSquare, Ban, Eye, EyeOff, Snowflake, Trash2, Settings, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminPanel = () => {
  const { user, userProfile, loading } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    signupsEnabled: true,
    postsEnabled: true,
  });

  const [blacklistData, setBlacklistData] = useState({
    usernames: '',
    phrases: '',
    emails: '',
  });

  // Mock data for demonstration
  const mockPosts = [
    {
      id: '1',
      phrase: 'Having an amazing day today!',
      author: { username: 'user123', email: 'user@example.com' },
      category: 'Gratitude',
      tags: ['happy', 'blessed'],
      status: 'pending',
    },
    {
      id: '2',
      phrase: 'Never give up on your dreams',
      author: { username: 'dreamer', email: 'dreamer@example.com' },
      category: 'Motivation',
      tags: ['inspiration', 'dreams'],
      status: 'approved',
    },
  ];

  const mockUsers = [
    {
      id: '1',
      username: 'user123',
      email: 'user@example.com',
      isPremium: false,
      isFrozen: false,
      isHidden: false,
    },
    {
      id: '2',
      username: 'premiumuser',
      email: 'premium@example.com',
      isPremium: true,
      isFrozen: false,
      isHidden: false,
    },
  ];

  const handlePostAction = async (postId: string, action: string) => {
    try {
      // TODO: Implement Firebase actions
      toast({
        title: "Action completed",
        description: `Post ${action} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete action.",
        variant: "destructive",
      });
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      // TODO: Implement Firebase actions
      toast({
        title: "Action completed",
        description: `User ${action} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete action.",
        variant: "destructive",
      });
    }
  };

  const saveBlacklist = async () => {
    try {
      // TODO: Save to Firebase
      toast({
        title: "Blacklist updated",
        description: "Changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save blacklist.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !userProfile?.isAdmin) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-text-primary">Admin Panel</h1>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="blacklist">Blacklist</TabsTrigger>
          </TabsList>

          {/* Posts Management */}
          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Post Moderation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockPosts.map((post) => (
                  <div key={post.id} className="border border-border-soft rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-text-primary font-medium">"{post.phrase}"</p>
                        <p className="text-text-secondary text-sm mt-1">
                          by @{post.author.username} ({post.author.email})
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{post.category}</Badge>
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">#{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      <Badge variant={post.status === 'pending' ? 'destructive' : 'default'}>
                        {post.status}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Ban className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will reject the post and notify the user to review community guidelines.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handlePostAction(post.id, 'rejected')}>
                              Reject Post
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <EyeOff className="w-4 h-4 mr-1" />
                            Hide
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hide Posts</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will hide all posts from this user without notifying them.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handlePostAction(post.id, 'hidden')}>
                              Hide Posts
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Button variant="soft" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>User Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockUsers.map((user) => (
                  <div key={user.id} className="border border-border-soft rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-text-primary font-medium">@{user.username}</p>
                          {user.isPremium && (
                            <Badge variant="default" className="bg-gradient-accent">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-text-secondary text-sm">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="accent" size="sm">
                        <Crown className="w-4 h-4 mr-1" />
                        Upgrade to Premium
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Snowflake className="w-4 h-4 mr-1" />
                            Freeze
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Freeze Account</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will temporarily lock the account and hide all their posts.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleUserAction(user.id, 'frozen')}>
                              Freeze Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Account</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the account and send an email notification.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleUserAction(user.id, 'deleted')}>
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platform Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Platform Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="signups" className="text-text-primary font-medium">Enable New Signups</Label>
                    <p className="text-text-secondary text-sm">
                      When disabled, shows upgrade message to new users
                    </p>
                  </div>
                  <Switch
                    id="signups"
                    checked={settings.signupsEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, signupsEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="posts" className="text-text-primary font-medium">Enable New Posts</Label>
                    <p className="text-text-secondary text-sm">
                      When disabled, shows system upgrade message
                    </p>
                  </div>
                  <Switch
                    id="posts"
                    checked={settings.postsEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, postsEnabled: checked }))}
                  />
                </div>

                <Button variant="premium" className="w-full">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blacklist Management */}
          <TabsContent value="blacklist">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Ban className="w-5 h-5" />
                  <span>Content Blacklist</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="usernames" className="text-text-primary">Blocked Usernames</Label>
                  <Textarea
                    id="usernames"
                    value={blacklistData.usernames}
                    onChange={(e) => setBlacklistData(prev => ({ ...prev, usernames: e.target.value }))}
                    placeholder="Enter usernames separated by commas"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phrases" className="text-text-primary">Blocked Phrases</Label>
                  <Textarea
                    id="phrases"
                    value={blacklistData.phrases}
                    onChange={(e) => setBlacklistData(prev => ({ ...prev, phrases: e.target.value }))}
                    placeholder="Enter phrases separated by commas"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="emails" className="text-text-primary">Blocked Emails & Domains</Label>
                  <Textarea
                    id="emails"
                    value={blacklistData.emails}
                    onChange={(e) => setBlacklistData(prev => ({ ...prev, emails: e.target.value }))}
                    placeholder="Enter emails and domains separated by commas"
                    className="mt-1"
                  />
                </div>

                <Button onClick={saveBlacklist} variant="premium" className="w-full">
                  Save Blacklist
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;