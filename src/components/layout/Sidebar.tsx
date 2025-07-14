import { useState } from "react";
import { 
  Calendar, 
  Heart, 
  DollarSign, 
  Pill, 
  User, 
  Settings, 
  FileText, 
  Download,
  X,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  onItemClick?: (itemId: string) => void;
}

const menuItems = [
  { 
    id: "profile", 
    label: "Profile & Settings", 
    icon: User, 
    description: "Manage your account" 
  },
  { 
    id: "calendar", 
    label: "Calendar", 
    icon: Calendar, 
    description: "Add birthdays & reminders" 
  },
  { 
    id: "recurring-tasks", 
    label: "Recurring Tasks", 
    icon: FileText, 
    description: "Manage daily tasks" 
  },
  { 
    id: "medications", 
    label: "Medication Manager", 
    icon: Pill, 
    description: "Set meal medications" 
  },
  { 
    id: "period-tracker", 
    label: "Period Tracker", 
    icon: Heart, 
    description: "Track your cycle" 
  },
  { 
    id: "financial", 
    label: "Financial Tracker", 
    icon: DollarSign, 
    description: "Manage expenses & goals" 
  },
  { 
    id: "notifications", 
    label: "Notification Manager", 
    icon: Settings, 
    description: "Manage notifications" 
  },
  { 
    id: "export", 
    label: "Export Data", 
    icon: Download, 
    description: "Export to doctor or backup" 
  },
];

export function Sidebar({ isOpen, onClose, userName = "Guest", onItemClick }: SidebarProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    setSelectedItem(itemId);
    onItemClick?.(itemId);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-card border-r border-border shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <p className="text-sm text-muted-foreground">Welcome, {userName}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu Items */}
        <div className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  "w-full p-3 rounded-lg text-left transition-colors hover:bg-secondary group",
                  selectedItem === item.id && "bg-primary/10 text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn(
                    "h-5 w-5",
                    selectedItem === item.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                  )} />
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}