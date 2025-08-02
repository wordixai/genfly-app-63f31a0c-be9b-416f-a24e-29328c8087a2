import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const JourneyMap: React.FC = () => {
  const { 
    activities, 
    selectedCharacter, 
    scrollPosition, 
    setScrollPosition, 
    setCurrentActivity, 
    user 
  } = useStore();
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [characterPosition, setCharacterPosition] = useState(0);
  const [showActivityCard, setShowActivityCard] = useState<string | null>(null);

  useEffect(() => {
    // Auto-scroll to current progress
    const completedActivities = activities.filter(a => a.completed).length;
    const targetPosition = Math.max(0, (completedActivities * 300) - 200);
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: targetPosition,
        behavior: 'smooth'
      });
      setCharacterPosition(targetPosition + 50);
    }
  }, [activities]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleActivityClick = (activity: any) => {
    if (!activity.unlocked) {
      return;
    }
    
    setShowActivityCard(activity.id);
    setCurrentActivity(activity);
  };

  const completedCount = activities.filter(a => a.completed).length;
  const progress = (completedCount / activities.length) * 100;

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-moana-50 to-whenua-100">
      {/* Progress Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-background/90 backdrop-blur-sm p-4 border-b border-primary/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-primary">
              {user?.name}'s Cultural Journey
            </h2>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Day {completedCount + 1} of 30
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Progress value={progress} className="flex-1 h-3" />
            <span className="text-sm font-medium text-muted-foreground">
              {completedCount}/30 Activities Complete
            </span>
          </div>
        </div>
      </div>

      {/* Journey Path */}
      <div 
        ref={scrollContainerRef}
        className="horizontal-scroll overflow-x-auto overflow-y-hidden h-full pt-24 pb-8"
        onScroll={handleScroll}
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="relative h-full" style={{ width: `${activities.length * 300 + 400}px` }}>
          {/* Path Line */}
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
            <div className="journey-path w-full"></div>
          </div>

          {/* Character */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-out z-20"
            style={{ left: characterPosition }}
          >
            <div className="relative">
              <div className="text-4xl animate-bounce-slow bg-background/80 rounded-full p-2 shadow-lg">
                {selectedCharacter?.avatar || '🎭'}
              </div>
              <div className="absolute -bottom-8 -left-4 whitespace-nowrap bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-medium">
                {selectedCharacter?.name || 'Traveler'}
              </div>
            </div>
          </div>

          {/* Activity Nodes */}
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="absolute transform -translate-x-1/2"
              style={{ 
                left: activity.position.x, 
                top: `calc(50% + ${activity.position.y}px)` 
              }}
            >
              <div
                className={`activity-node ${
                  activity.completed 
                    ? 'completed' 
                    : activity.unlocked 
                      ? 'unlocked' 
                      : 'locked'
                }`}
                onClick={() => handleActivityClick(activity)}
              >
                {activity.completed ? '✓' : activity.day}
              </div>

              {/* Activity Info Card */}
              {showActivityCard === activity.id && activity.unlocked && (
                <Card className="absolute top-20 left-1/2 transform -translate-x-1/2 w-80 z-30 maori-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-primary">
                      {activity.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {activity.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      {activity.description}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          // Handle start activity
                          console.log('Start activity:', activity.id);
                        }}
                      >
                        {activity.completed ? 'Review' : 'Start Activity'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowActivityCard(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}

          {/* Cultural Landmarks */}
          {[5, 10, 15, 20, 25].map((milestone) => {
            const activity = activities.find(a => a.day === milestone);
            if (!activity) return null;
            
            return (
              <div
                key={`landmark-${milestone}`}
                className="absolute transform -translate-x-1/2"
                style={{ 
                  left: activity.position.x, 
                  top: 'calc(50% - 80px)' 
                }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">🏔️</div>
                  <div className="text-xs font-medium text-primary">
                    Milestone {milestone}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        <Button
          variant="outline"
          onClick={() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
            }
          }}
        >
          ← Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
            }
          }}
        >
          Next →
        </Button>
      </div>
    </div>
  );
};