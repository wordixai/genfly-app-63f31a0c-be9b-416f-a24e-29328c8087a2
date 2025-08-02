import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { AuthModal } from '@/components/AuthModal';
import { CharacterSelection } from '@/components/CharacterSelection';
import { JourneyMap } from '@/components/JourneyMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const { 
    isAuthenticated, 
    user, 
    showCharacterSelection, 
    activities,
    selectedCharacter,
    setShowCharacterSelection 
  } = useStore();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    // Update current day based on today's date
    // In a real app, this would check server time
    const today = new Date();
    const startDate = new Date('2024-12-01'); // Adventure start date
    const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    setCurrentDay(Math.max(1, Math.min(30, daysDiff)));
  }, []);

  const completedActivities = activities.filter(a => a.completed).length;
  const progressPercent = (completedActivities / 30) * 100;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background with Māori patterns */}
        <div className="absolute inset-0 maori-pattern-bg"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <Card className="maori-card w-full max-w-2xl mx-auto text-center">
            <CardHeader className="pb-6">
              <div className="text-6xl mb-4">🌿</div>
              <CardTitle className="text-4xl font-bold text-primary mb-2">
                Haere Mai - Welcome
              </CardTitle>
              <p className="text-xl text-muted-foreground">
                to your 30-Day Māori Cultural Adventure
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="text-3xl mb-2">📚</div>
                  <h3 className="font-semibold text-primary">Learn</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover Te Reo Māori, traditions, and cultural wisdom
                  </p>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-semibold text-accent">Complete</h3>
                  <p className="text-sm text-muted-foreground">
                    Daily activities unlock as you progress through time
                  </p>
                </div>
                <div className="p-4 bg-ahi-500/10 rounded-lg">
                  <div className="text-3xl mb-2">🏆</div>
                  <h3 className="font-semibold text-ahi-600">Win</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn achievements and compete for cultural prizes
                  </p>
                </div>
              </div>

              <div className="p-6 bg-whenua-100/50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-whenua-800">
                  🌟 Current Event: December Cultural Journey
                </h3>
                <p className="text-whenua-700 mb-3">
                  Join thousands of others learning about Aotearoa's rich heritage. 
                  Day {currentDay} is now available!
                </p>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  📅 Today: Rā {currentDay}
                </Badge>
              </div>

              <Button 
                onClick={() => setShowAuthModal(true)}
                size="lg"
                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-8 text-lg"
              >
                Start Your Journey →
              </Button>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>✨ Free to participate • 📧 Email verification required</p>
                <p>🏆 Prizes awarded weekly • 🎯 Certificate upon completion</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <AuthModal 
          open={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Character Selection Modal */}
      <CharacterSelection 
        open={showCharacterSelection} 
        onClose={() => setShowCharacterSelection(false)} 
      />

      {/* Main Journey Interface */}
      {selectedCharacter ? (
        <JourneyMap />
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="maori-card max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                Kia ora {user?.name}!
              </CardTitle>
              <p className="text-muted-foreground">
                Ready to choose your journey companion?
              </p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowCharacterSelection(true)}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Choose Your Character
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;