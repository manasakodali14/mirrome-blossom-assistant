import { useState } from "react";
import { Plus, Check, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  isRecurring?: boolean;
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Take morning vitamins', completed: false, isRecurring: true },
    { id: '2', title: 'Drink 8 glasses of water', completed: false, isRecurring: true },
    { id: '3', title: 'Write in diary', completed: false, isRecurring: true },
    { id: '4', title: 'Review weekly goals', completed: false, dueDate: new Date() },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const toggleTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
        dueDate: new Date()
      };
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle('');
      setShowAddForm(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! 🌸";
    if (hour < 17) return "Good afternoon! 🌺";
    return "Good evening! 🌙";
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Greeting Card */}
      <Card className="bg-gradient-sakura text-primary-foreground shadow-sakura border-0">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">{getGreeting()}</h2>
          <p className="opacity-90">Let's make today beautiful and productive!</p>
        </CardContent>
      </Card>

      {/* Progress Card */}
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Today's Progress
          </CardTitle>
          <CardDescription>
            {completedTasks} of {totalTasks} tasks completed
          </CardDescription>
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
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <Button onClick={addTask} variant="sakura">
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Today's Tasks</h3>
        
        {tasks.map((task) => (
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
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Today
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completion Message */}
      {completedTasks === totalTasks && totalTasks > 0 && (
        <Card className="bg-gradient-rose shadow-sakura border-primary/20 animate-fade-in">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold mb-2">Congratulations!</h3>
            <p className="text-muted-foreground">
              You've completed all your tasks today. Great job! 🌸
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}