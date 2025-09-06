import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { AuthForm } from '@/components/auth/AuthForm';
import { ProfileSetup } from '@/components/profile/ProfileSetup';

const Profile = () => {
  const { user, loading } = useAuth();

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
      <ProfileSetup />
    </div>
  );
};

export default Profile;