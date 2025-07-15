import { useState, useEffect } from "react";
import { Plus, Check, Clock, Calendar, ChevronLeft, ChevronRight, Save, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { dataService, TaskData } from "@/lib/dataService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskManagerProps {
  userName?: string;
}

export function TaskManager({ userName }: TaskManagerProps = {}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  useEffect(() => {
    loadTasks();
    loadRecurringTasks();
  }, [selectedDate]);

  const loadTasks = () => {
    const dateStr = dataService.formatDate(selectedDate);
    const savedTasks = dataService.getTasks(dateStr);
    setTasks(savedTasks);
  };

  const loadRecurringTasks = () => {
    const dateStr = dataService.formatDate(selectedDate);
    const existingTasks = dataService.getTasks(dateStr);
    const recurringTasks = dataService.getRecurringTasks();
    
    // Add recurring tasks if they don't exist for this date
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    if (isToday && recurringTasks.length > 0) {
      const existingTaskTitles = existingTasks.map(t => t.title);
      const newRecurringTasks = recurringTasks
        .filter(rt => rt.frequency === 'daily' && !existingTaskTitles.includes(rt.title))
        .map(rt => ({
          ...rt,
          id: `recurring_${Date.now()}_${Math.random()}`,
          date: dateStr,
          completed: false
        }));

      if (newRecurringTasks.length > 0) {
        const allTasks = [...existingTasks, ...newRecurringTasks];
        setTasks(allTasks);
        dataService.saveTasks(dateStr, allTasks);
      }
    }
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    );
    setTasks(updatedTasks);
    
    const dateStr = dataService.formatDate(selectedDate);
    dataService.saveTasks(dateStr, updatedTasks);
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: task.completed ? "Task reopened" : "Task completed! ✅",
        description: task.completed ? "Keep going!" : "Great progress!",
      });
    }
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const dateStr = dataService.formatDate(selectedDate);
      const newTask: TaskData = {
        id: `task_${Date.now()}_${Math.random()}`,
        title: newTaskTitle.trim(),
        completed: false,
        date: dateStr,
        dueTime: newTaskTime || undefined
      };
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      dataService.saveTasks(dateStr, updatedTasks);
      
      setNewTaskTitle('');
      setNewTaskTime('');
      setShowAddForm(false);
      
      toast({
        title: "Task added! 📝",
        description: "Your new task has been created",
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = userName || 'Friend';
    if (hour < 12) return `Good morning, ${name}! 🌸`;
    if (hour < 17) return `Good afternoon, ${name}! 🌺`;
    return `Good evening, ${name}! 🌙`;
  };

  const getMotivationalMessage = () => {
    if (totalTasks === 0) return "Ready to add some tasks and make today productive?";
    if (progressPercentage === 100) return "Amazing! You've completed everything today! 🎉";
    if (progressPercentage >= 75) return "You're almost there! Keep going! 💪";
    if (progressPercentage >= 50) return "Great progress! You're halfway done! 🌟";
    if (progressPercentage >= 25) return "Good start! Keep building momentum! 🚀";
    return "Let's get started and make today beautiful! ✨";
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Greeting Card */}
      <Card className="bg-gradient-sakura text-primary-foreground shadow-sakura border-0">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">{getGreeting()}</h2>
          <p className="opacity-90">{getMotivationalMessage()}</p>
        </CardContent>
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

      {/* Progress Card */}
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            {isToday() ? "Today's Progress" : `Progress for ${format(selectedDate, "MMM d")}`}
            <Badge variant="outline" className="ml-auto">
              {completedTasks}/{totalTasks}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress 
            value={progressPercentage} 
            className="h-3 mb-3" 
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{Math.round(progressPercentage)}% Complete</span>
            <span>{totalTasks - completedTasks} remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Add Task Button */}
      <Button
        onClick={() => setShowAddForm(!showAddForm)}
        variant="sakura"
        size="lg"
        className="w-full"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add New Task
      </Button>

      {/* Add Task Form */}
      {showAddForm && (
        <Card className="shadow-soft animate-fade-in">
          <CardContent className="p-4 space-y-3">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              className="shadow-soft focus:shadow-sakura transition-shadow"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <div className="flex gap-2">
              <Input
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                placeholder="Due time (optional)"
                className="flex-1 shadow-soft focus:shadow-sakura transition-shadow"
              />
              <Button onClick={addTask} variant="sakura" disabled={!newTaskTitle.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {isToday() ? "Today's Tasks" : `Tasks for ${format(selectedDate, "MMM d, yyyy")}`}
        </h3>
        
        {tasks.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No tasks for this date. Add one to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card 
              key={task.id}
              className={cn(
                "shadow-soft transition-all duration-200 hover:shadow-sakura cursor-pointer",
                task.completed && "opacity-75 bg-secondary/50"
              )}
              onClick={() => toggleTask(task.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    task.completed 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "border-primary hover:bg-primary/10"
                  )}>
                    {task.completed && <Check className="h-4 w-4" />}
                  </div>
                  
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium transition-all duration-200",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      {task.isRecurring && (
                        <Badge variant="secondary" className="text-xs">
                          Daily
                        </Badge>
                      )}
                      {task.dueTime && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {task.dueTime}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Completion Message */}
      {completedTasks === totalTasks && totalTasks > 0 && (
        <Card className="bg-gradient-rose shadow-sakura border-primary/20 animate-fade-in">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold mb-2">Congratulations!</h3>
            <p className="text-muted-foreground">
              You've completed all your tasks {isToday() ? 'today' : `for ${format(selectedDate, "MMM d")}`}. Great job! 🌸
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}