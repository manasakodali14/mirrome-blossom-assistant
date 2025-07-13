import { useState } from "react";
import { BookOpen, Calendar, Heart, Smile } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function DiaryTab() {
  const [diaryEntry, setDiaryEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '😄', label: 'Excited', value: 'excited' }
  ];

  const saveEntry = () => {
    if (diaryEntry.trim()) {
      // Save logic here
      console.log('Saving diary entry:', { entry: diaryEntry, mood: selectedMood });
      setDiaryEntry('');
      setSelectedMood('');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <Card className="bg-gradient-soft shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Diary & Mental Health
          </CardTitle>
          <CardDescription>
            How are you feeling today? Share your thoughts 🌸
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Today's Entry */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Entry
          </CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">How are you feeling?</label>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedMood === mood.value
                      ? 'border-primary bg-primary/10 shadow-sakura'
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs font-medium">{mood.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Write your thoughts...</label>
            <Textarea
              value={diaryEntry}
              onChange={(e) => setDiaryEntry(e.target.value)}
              placeholder="Dear diary, today I feel..."
              className="min-h-32 shadow-soft focus:shadow-sakura transition-shadow resize-none"
            />
          </div>

          <Button 
            onClick={saveEntry}
            variant="sakura" 
            size="lg" 
            className="w-full"
            disabled={!diaryEntry.trim()}
          >
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {/* Quick Reflection */}
      <Card className="shadow-soft bg-gradient-rose">
        <CardContent className="p-6 text-center">
          <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Daily Reflection</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Take a moment to reflect on three things you're grateful for today
          </p>
          <Badge variant="secondary" className="shadow-soft">
            Gratitude Practice
          </Badge>
        </CardContent>
      </Card>

      {/* Recent Entries Preview */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Your recent diary entries will appear here 📖
          </p>
        </CardContent>
      </Card>
    </div>
  );
}