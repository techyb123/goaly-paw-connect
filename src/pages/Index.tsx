import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { Navigation } from '@/components/layout/Navigation';
import { ProfileSetup } from '@/components/profile/ProfileSetup';

const Index = () => {
  const { user, userProfile, loading } = useAuth();

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

  const needsSetup = !userProfile?.animalPhoto || !userProfile?.petfinderLink;

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Navigation />
      
      {needsSetup ? (
        <ProfileSetup />
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-text-primary">Welcome to Goaly</h1>
            <p className="text-text-secondary">
              A platform connecting people with rescue animals in need
            </p>
          </div>
          
          {/* Main Feed will go here */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 border border-border-soft shadow-sm">
              <p className="text-text-secondary text-center">
                Your personalized feed will appear here once you start following users and creating posts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
