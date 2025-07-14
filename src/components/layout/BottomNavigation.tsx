import { Activity, Apple, CheckSquare, BookOpen, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  {
    id: 'physical',
    label: 'Physical',
    icon: Activity,
    color: 'text-primary'
  },
  {
    id: 'food',
    label: 'Food',
    icon: Apple,
    color: 'text-primary'
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: CheckSquare,
    color: 'text-primary'
  },
  {
    id: 'diary',
    label: 'Diary',
    icon: BookOpen,
    color: 'text-primary'
  },
  {
    id: 'review',
    label: 'Review',
    icon: BarChart3,
    color: 'text-primary'
  }
];

export function BottomNavigation({ currentTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-border/50 shadow-sakura z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1",
                isActive 
                  ? "bg-primary/10 text-primary transform scale-105" 
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 mb-1 transition-all duration-200",
                  isActive && "animate-gentle-bounce"
                )} 
              />
              <span className="text-xs font-medium truncate">{tab.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-primary rounded-full mt-1 animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}