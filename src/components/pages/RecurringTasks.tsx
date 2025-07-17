import { useState, useEffect } from "react";
import { RotateCcw, Plus, Trash2, Clock, Save, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { dataService, TaskData } from "@/lib/dataService";
import { useToast } from "@/hooks/use-toast";

export function RecurringTasks() {
  const [recurringTasks, setRecurringTasks] = useState<TaskData[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    frequency: '',
    dueTime: '',
    description: '',
    isActive: true
  });
  const { toast } = useToast();

  const frequencyOptions = [
    { value: 'daily', label: 'Daily', description: 'Every day' },
    { value: 'weekly', label: 'Weekly', description: 'Every week' },
    { value: 'weekdays', label: 'Weekdays', description: 'Monday to Friday' },
    { value: 'weekends', label: 'Weekends', description: 'Saturday & Sunday' },
    { value: 'monday', label: 'Every Monday', description: 'Weekly on Monday' },
    { value: 'tuesday', label: 'Every Tuesday', description: 'Weekly on Tuesday' },
    { value: 'wednesday', label: 'Every Wednesday', description: 'Weekly on Wednesday' },
    { value: 'thursday', label: 'Every Thursday', description: 'Weekly on Thursday' },
    { value: 'friday', label: 'Every Friday', description: 'Weekly on Friday' },
    { value: 'saturday', label: 'Every Saturday', description: 'Weekly on Saturday' },
    { value: 'sunday', label: 'Every Sunday', description: 'Weekly on Sunday' }
  ];

  useEffect(() => {
    loadRecurringTasks();
  }, []);

  const loadRecurringTasks = () => {
    const savedTasks = dataService.getRecurringTasks();
    setRecurringTasks(savedTasks);
  };

  const addRecurringTask = () => {
    if (!newTask.title.trim() || !newTask.frequency) {
      toast({
        title: "Missing information",
        description: "Please fill in task title and frequency",
        variant: "destructive"
      });
      return;
    }

    const task: TaskData = {
      id: `recurring_${Date.now()}_${Math.random()}`,
      title: newTask.title.trim(),
      completed: false,
      date: '',
      dueTime: newTask.dueTime,
      isRecurring: true,
      frequency: newTask.frequency as 'daily' | 'weekly' | 'monthly',
      isActive: newTask.isActive
    };

    const updatedTasks = [...recurringTasks, task];
    setRecurringTasks(updatedTasks);
    dataService.saveRecurringTasks(updatedTasks);

    // Reset form
    setNewTask({
      title: '',
      frequency: '',
      dueTime: '',
      description: '',
      isActive: true
    });

    toast({
      title: "Recurring task added! 🔄",
      description: "This task will automatically appear based on its frequency",
    });
  };

  const deleteRecurringTask = (taskId: string) => {
    const updatedTasks = recurringTasks.filter(task => task.id !== taskId);
    setRecurringTasks(updatedTasks);
    dataService.saveRecurringTasks(updatedTasks);

    toast({
      title: "Recurring task deleted",
      description: "The task has been removed from your recurring schedule",
    });
  };

  const toggleTaskStatus = (taskId: string) => {
    const updatedTasks = recurringTasks.map(task =>
      task.id === taskId ? { ...task, isActive: !task.isActive } : task
    );
    setRecurringTasks(updatedTasks);
    dataService.saveRecurringTasks(updatedTasks);

    const task = recurringTasks.find(t => t.id === taskId);
    toast({
      title: task?.isActive ? "Task deactivated" : "Task activated",
      description: task?.isActive
        ? "This task will no longer appear automatically"
        : "This task will start appearing automatically again",
    });
  };

  const getFrequencyInfo = (frequency: string) => {
    return frequencyOptions.find(opt => opt.value === frequency) || { label: frequency, description: '' };
  };

  const generateTasksForToday = () => {
    const today = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[today.getDay()];
    const isWeekday = today.getDay() >= 1 && today.getDay() <= 5;
    const isWeekend = today.getDay() === 0 || today.getDay() === 6;

    const todayStr = dataService.formatDate(today);
    const existingTasks = dataService.getTasks(todayStr);
    const existingTaskTitles = existingTasks.map(t => t.title);

    const tasksToAdd = recurringTasks.filter(task => {
      if (!task.isActive) return false;
      if (existingTaskTitles.includes(task.title)) return false;

      switch (task.frequency) {
        case 'daily':
          return true;
        case 'weekdays':
          return isWeekday;
        case 'weekends':
          return isWeekend;
        case currentDay:
          return true;
        default:
          return false;
      }
    }).map(task => ({
      ...task,
      id: `task_${Date.now()}_${Math.random()}`,
      date: todayStr,
      completed: false
    }));

    if (tasksToAdd.length > 0) {
      const allTasks = [...existingTasks, ...tasksToAdd];
      dataService.saveTasks(todayStr, allTasks);
      
      toast({
        title: `${tasksToAdd.length} recurring tasks added!`,
        description: "Check your tasks tab to see them",
      });
    } else {
      toast({
        title: "No new recurring tasks",
        description: "All applicable recurring tasks are already in today's list",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="bg-gradient-soft shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-primary" />
            Recurring Tasks
          </CardTitle>
          <CardDescription>
            Set up tasks that repeat automatically based on schedule 🔄
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Generate Today's Tasks */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Generate Today's Recurring Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Add all applicable recurring tasks to today's task list
              </p>
            </div>
            <Button onClick={generateTasksForToday} variant="sakura">
              <Target className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add New Recurring Task */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add New Recurring Task
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taskTitle">Task Title</Label>
              <Input
                id="taskTitle"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Morning Exercise"
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={newTask.frequency}
                onValueChange={(value) => setNewTask(prev => ({ ...prev, frequency: value }))}
              >
                <SelectTrigger className="shadow-soft focus:shadow-sakura transition-shadow">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueTime">Preferred Time (Optional)</Label>
              <Input
                id="dueTime"
                type="time"
                value={newTask.dueTime}
                onChange={(e) => setNewTask(prev => ({ ...prev, dueTime: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={newTask.isActive}
                  onCheckedChange={(checked) => setNewTask(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Only active tasks will be automatically generated
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional details about this task..."
              className="shadow-soft focus:shadow-sakura transition-shadow"
              rows={3}
            />
          </div>

          <Button 
            onClick={addRecurringTask}
            variant="sakura" 
            className="w-full"
            disabled={!newTask.title.trim() || !newTask.frequency}
          >
            <Save className="h-4 w-4 mr-2" />
            Add Recurring Task
          </Button>
        </CardContent>
      </Card>

      {/* Existing Recurring Tasks */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Your Recurring Tasks
            <Badge variant="secondary" className="ml-auto">
              {recurringTasks.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recurringTasks.length === 0 ? (
            <div className="text-center py-8">
              <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No recurring tasks yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first recurring task to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recurringTasks.map((task) => {
                const frequencyInfo = getFrequencyInfo(task.frequency || '');

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border transition-all hover:shadow-sakura ${
                      task.isActive ? 'bg-background' : 'bg-secondary/50 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{task.title}</h4>
                          <Badge variant={task.isActive ? "default" : "secondary"} className="text-xs">
                            {frequencyInfo.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-1">
                          {frequencyInfo.description}
                        </p>
                        
                        {task.dueTime && (
                          <p className="text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Preferred time: {task.dueTime}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTaskStatus(task.id)}
                          className={task.isActive ? "text-green-600" : "text-muted-foreground"}
                        >
                          {task.isActive ? "Active" : "Inactive"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRecurringTask(task.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="shadow-soft bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <h4 className="font-medium">How Recurring Tasks Work</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Daily tasks appear every day automatically</p>
              <p>• Weekly tasks appear based on the specific day you choose</p>
              <p>• Use "Generate" button to add today's recurring tasks manually</p>
              <p>• Deactivate tasks to temporarily stop them from appearing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
