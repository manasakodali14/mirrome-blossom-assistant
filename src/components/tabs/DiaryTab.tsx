import { useState, useEffect } from "react";
import { BookOpen, Calendar, Heart, Smile, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { dataService, DiaryEntry } from "@/lib/dataService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function DiaryTab() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryEntry, setDiaryEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [gratitude, setGratitude] = useState(['', '', '']);
  const { toast } = useToast();

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '😄', label: 'Excited', value: 'excited' }
  ];

  useEffect(() => {
    loadDiaryEntry();
  }, [selectedDate]);

  const loadDiaryEntry = () => {
    const dateStr = dataService.formatDate(selectedDate);
    const savedEntry = dataService.getDiaryEntry(dateStr);
    
    if (savedEntry) {
      setDiaryEntry(savedEntry.entry);
      setSelectedMood(savedEntry.mood || '');
      setGratitude(savedEntry.gratitude || ['', '', '']);
    } else {
      setDiaryEntry('');
      setSelectedMood('');
      setGratitude(['', '', '']);
    }
  };

  const saveEntry = () => {
    if (diaryEntry.trim() || selectedMood || gratitude.some(g => g.trim())) {
      const dateStr = dataService.formatDate(selectedDate);
      const entry: DiaryEntry = {
        id: dateStr,
        date: dateStr,
        entry: diaryEntry,
        mood: selectedMood,
        gratitude: gratitude.filter(g => g.trim())
      };
      
      dataService.saveDiaryEntry(dateStr, entry);
      toast({
        title: "Diary entry saved! 📖",
        description: "Your thoughts have been recorded safely",
      });
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  const updateGratitude = (index: number, value: string) => {
    const newGratitude = [...gratitude];
    newGratitude[index] = value;
    setGratitude(newGratitude);
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

      {/* Date Navigation */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateDate('prev')}
              className="hover:shadow-sakura"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "min-w-[200px] justify-center text-center font-medium shadow-soft hover:shadow-sakura",
                      isToday() && "bg-primary/10 border-primary/30"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(selectedDate, "EEE, MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <CalendarComp
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {isToday() && <Badge variant="secondary">Today</Badge>}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateDate('next')}
              className="hover:shadow-sakura"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diary Entry */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {isToday() ? "Today's Entry" : `Entry for ${format(selectedDate, "MMM d, yyyy")}`}
          </CardTitle>
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
            disabled={!diaryEntry.trim() && !selectedMood && !gratitude.some(g => g.trim())}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {/* Gratitude Practice */}
      <Card className="shadow-soft bg-gradient-rose">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Gratitude Practice
          </CardTitle>
          <CardDescription>
            Three things you're grateful for today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-1">
              <label className="text-sm font-medium">Gratitude {index + 1}</label>
              <Textarea
                value={gratitude[index]}
                onChange={(e) => updateGratitude(index, e.target.value)}
                placeholder={`I'm grateful for...`}
                className="min-h-16 resize-none shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>
          ))}
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