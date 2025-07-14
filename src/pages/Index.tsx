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
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('tasks'); // Default to tasks as specified
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { toast } = useToast();

  const handleAuth = (authData: any) => {
    setUserData(authData);
    setIsAuthenticated(true);
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

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'physical':
        return <PhysicalTracker />;
      case 'food':
        return <FoodTracker />;
      case 'tasks':
        return <TaskManager />;
      case 'diary':
        return <DiaryTab />;
      case 'review':
        return <ReviewDashboard />;
      default:
        return <TaskManager />;
    }
  };

  if (!isAuthenticated) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={userData?.fullName?.split(' ')[0] || 'Guest'} 
        onMenuToggle={() => setSidebarOpen(true)}
        onNotificationsToggle={() => setNotificationsOpen(true)}
      />
      
      <main className="pt-20 px-4 max-w-md mx-auto">
        {renderActiveTab()}
      </main>

      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userData?.fullName?.split(' ')[0] || 'Guest'}
      />

      <NotificationPanel 
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
};

export default Index;
