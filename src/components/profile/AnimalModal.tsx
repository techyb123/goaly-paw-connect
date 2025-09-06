import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/enhanced-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, ExternalLink } from 'lucide-react';

interface AnimalModalProps {
  animalName: string;
  animalLocation: string;
  animalPhoto: string;
  petfinderLink: string;
}

export const AnimalModal = ({ animalName, animalLocation, animalPhoto, petfinderLink }: AnimalModalProps) => {
  const handleLinkClick = () => {
    if (petfinderLink) {
      window.open(petfinderLink, '_blank');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <Avatar className="w-12 h-12 border-2 border-accent/20">
            <AvatarImage src={animalPhoto} alt={animalName} className="object-cover" />
            <AvatarFallback className="bg-accent-soft text-accent">
              <Heart className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Animal Rescue Information</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-center">
          {/* Large animal photo */}
          <div className="mx-auto w-48 h-48 rounded-lg overflow-hidden bg-accent-soft">
            {animalPhoto ? (
              <img 
                src={animalPhoto} 
                alt={animalName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-accent" />
              </div>
            )}
          </div>
          
          {/* Animal message */}
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              Hi! I'm <span className="font-medium text-text-primary">{animalName}</span> and I'm one of the animals available for adoption at the time of posting.
            </p>
            
            <p>
              I'm currently in <span className="font-medium text-text-primary">{animalLocation}</span> but if you check out my link, it will share whether I can be transported out of the area.
            </p>
            
            <p>
              If you think I may be a good fit for someone you know, I hope you'll share my information. Thanks for checking me out!
            </p>
            
            {petfinderLink && (
              <div className="pt-2">
                <Button 
                  onClick={handleLinkClick}
                  variant="premium"
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Here's the link!
                </Button>
              </div>
            )}
            
            <div className="text-xs text-text-muted space-y-2 pt-4 border-t border-border-soft">
              <p>
                P.S. If the link is no longer active, it probably just indicates that I've been adopted and the user hasn't updated the post yet :)
              </p>
              <p>
                P.S.S. If you want to learn more about the user, you can close this message and click their username on the post :)
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};