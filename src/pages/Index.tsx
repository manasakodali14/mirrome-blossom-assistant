import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import { TaskManager } from "@/components/tasks/TaskManager";
import { PhysicalTracker } from "@/components/tabs/PhysicalTracker";
import { FoodTracker } from "@/components/tabs/FoodTracker";
import { DiaryTab } from "@/components/tabs/DiaryTab";
import { ReviewDashboard } from "@/components/tabs/ReviewDashboard";
import { Profile } from "@/components/pages/Profile";
import { PeriodTracker } from "@/components/pages/PeriodTracker";
import { FinancialTracker } from "@/components/pages/FinancialTracker";
import { NotificationManager } from "@/components/pages/NotificationManager";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("tasks");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAuth = (authData: any) => {
    setUser(authData);
    toast({
      title: authData.isGuest 
        ? "Welcome Guest! 🌸" 
        : (authData.isLogin ? "Welcome back! 🌸" : "Account created! 🌺"),
      description: authData.isGuest
        ? "Exploring with limited features. Sign up for full access!"
        : (authData.isLogin 
          ? "Ready to make today beautiful?" 
          : "Welcome to your personal cherry blossom assistant!"),
    });
  };

  const handleSidebarItemClick = (itemId: string) => {
    setCurrentPage(itemId);
    setIsSidebarOpen(false);
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentPage(null);
  };

  const renderCurrentContent = () => {
    // If a sidebar page is selected, render it
    if (currentPage) {
      switch (currentPage) {
        case "profile":
          return <Profile userData={user} onSignOut={handleSignOut} />;
        case "period-tracker":
          return <PeriodTracker />;
        case "financial":
          return <FinancialTracker />;
        case "notifications":
          return <NotificationManager />;
        default:
          return (
            <div className="p-6">
              <h2 className="text-xl font-semibold">Feature Coming Soon</h2>
              <p className="text-muted-foreground mt-2">
                This feature is under development and will be available soon.
              </p>
            </div>
          );
      }
    }

    // Otherwise render the current tab
    switch (currentTab) {
      case "physical":
        return <PhysicalTracker />;
      case "food":
        return <FoodTracker />;
      case "diary":
        return <DiaryTab />;
      case "review":
        return <ReviewDashboard />;
      case "tasks":
      default:
        return <TaskManager userName={user?.fullName} />;
    }
  };

  if (!user) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={user?.fullName?.split(' ')[0] || 'Guest'} 
        onMenuToggle={() => setIsSidebarOpen(true)}
        onNotificationsToggle={() => setIsNotificationOpen(true)}
      />
      
      <div className="pt-16">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          userName={user?.fullName}
          onItemClick={handleSidebarItemClick}
        />
        
        <NotificationPanel 
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />

        <main className="flex-1">
          {renderCurrentContent()}
        </main>

        {/* Only show bottom navigation when not on a sidebar page */}
        {!currentPage && (
          <BottomNavigation 
            currentTab={currentTab}
            onTabChange={setCurrentTab}
          />
        )}

        {/* Back button for sidebar pages */}
        {currentPage && (
          <div className="fixed bottom-6 left-6 z-50">
            <button
              onClick={() => setCurrentPage(null)}
              className="bg-primary text-primary-foreground rounded-full p-3 shadow-sakura hover:bg-primary/90 transition-colors"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
