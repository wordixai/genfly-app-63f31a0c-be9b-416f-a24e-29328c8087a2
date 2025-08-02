import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

interface CharacterSelectionProps {
  open: boolean;
  onClose: () => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({ open, onClose }) => {
  const { characters, selectCharacter } = useStore();

  const handleCharacterSelect = (character: any) => {
    selectCharacter(character);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="maori-card max-w-2xl mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            Choose Your Journey Companion
          </DialogTitle>
          <p className="text-muted-foreground text-center">
            Select a character to guide you through your cultural adventure
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                character.unlocked
                  ? 'border-primary/30 hover:border-primary bg-card/50 hover:bg-card/70'
                  : 'border-muted bg-muted/10 cursor-not-allowed opacity-50'
              }`}
              onClick={() => character.unlocked && handleCharacterSelect(character)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{character.avatar}</div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{character.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{character.description}</p>
                
                {character.unlocked ? (
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCharacterSelect(character);
                    }}
                  >
                    Choose {character.name}
                  </Button>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    🔒 Unlock by completing more activities
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-accent/10 rounded-lg">
          <p className="text-sm text-center text-muted-foreground">
            💡 Each character offers a unique perspective on Māori culture. 
            You can change your character later by completing special activities!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};