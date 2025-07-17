import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Plus, Gift, Clock, Bell, Trash2, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { dataService, CalendarEvent } from "@/lib/dataService";
import { useToast } from "@/hooks/use-toast";

export function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: '',
    time: '',
    description: '',
    isRecurring: false,
    frequency: ''
  });
  const { toast } = useToast();

  const eventTypes = [
    { value: 'task', label: 'Task', icon: Clock, color: 'text-blue-500' },
    { value: 'reminder', label: 'Reminder', icon: Bell, color: 'text-yellow-500' },
    { value: 'birthday', label: 'Birthday', icon: Gift, color: 'text-pink-500' },
    { value: 'appointment', label: 'Appointment', icon: CalendarIcon, color: 'text-green-500' }
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const savedEvents = dataService.getCalendarEvents();
    setEvents(savedEvents);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const addEvent = () => {
    if (!newEvent.title.trim() || !newEvent.type) {
      toast({
        title: "Missing information",
        description: "Please fill in event title and type",
        variant: "destructive"
      });
      return;
    }

    const event: CalendarEvent = {
      id: `event_${Date.now()}_${Math.random()}`,
      title: newEvent.title.trim(),
      type: newEvent.type as 'task' | 'reminder' | 'birthday' | 'appointment',
      date: dataService.formatDate(selectedDate),
      time: newEvent.time,
      description: newEvent.description,
      isRecurring: newEvent.isRecurring,
      frequency: newEvent.isRecurring ? newEvent.frequency as 'daily' | 'weekly' | 'monthly' | 'yearly' : undefined,
      isCompleted: false
    };

    const updatedEvents = [...events, event];
    setEvents(updatedEvents);
    dataService.saveCalendarEvents(updatedEvents);

    // If it's a task for today, also add it to tasks
    if (event.type === 'task' && isSameDay(new Date(event.date), new Date())) {
      const taskData = {
        id: `task_${Date.now()}_${Math.random()}`,
        title: event.title,
        completed: false,
        date: event.date,
        dueTime: event.time,
        isRecurring: event.isRecurring,
        frequency: event.frequency
      };
      
      const todayTasks = dataService.getTasks(event.date);
      dataService.saveTasks(event.date, [...todayTasks, taskData]);
    }

    // Create notification for reminders and birthdays
    if (event.type === 'reminder' || event.type === 'birthday') {
      const notification = {
        id: `notif_${Date.now()}_${Math.random()}`,
        type: event.type,
        title: event.type === 'birthday' ? `🎂 ${event.title}` : `⏰ ${event.title}`,
        message: event.description || `Don't forget: ${event.title}`,
        time: event.time || format(new Date(), 'HH:mm'),
        isRead: false,
        date: event.date
      };

      const existingNotifications = dataService.getNotifications();
      dataService.saveNotifications([...existingNotifications, notification]);
    }

    // Reset form
    setNewEvent({
      title: '',
      type: '',
      time: '',
      description: '',
      isRecurring: false,
      frequency: ''
    });
    setShowAddForm(false);

    toast({
      title: "Event added! 📅",
      description: `Your ${newEvent.type} has been scheduled`,
    });
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    dataService.saveCalendarEvents(updatedEvents);

    toast({
      title: "Event deleted",
      description: "The event has been removed from your calendar",
    });
  };

  const toggleEventCompletion = (eventId: string) => {
    const updatedEvents = events.map(event =>
      event.id === eventId ? { ...event, isCompleted: !event.isCompleted } : event
    );
    setEvents(updatedEvents);
    dataService.saveCalendarEvents(updatedEvents);
  };

  const getDayEvents = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const modifiersStyles = {
    hasEvents: {
      backgroundColor: 'hsl(var(--primary) / 0.1)',
      color: 'hsl(var(--primary))',
      fontWeight: 'bold'
    }
  };

  const modifiers = {
    hasEvents: (date: Date) => getDayEvents(date).length > 0
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="space-y-6 p-6">
      <Card className="bg-gradient-soft shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Calendar & Events
          </CardTitle>
          <CardDescription>
            Schedule tasks, reminders, and special events 📅
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComp
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border shadow pointer-events-auto"
            />
          </CardContent>
        </Card>

        {/* Events for Selected Date */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Events for {format(selectedDate, "MMM d, yyyy")}
              </CardTitle>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No events for this date</p>
              </div>
            ) : (
              selectedDateEvents.map((event) => {
                const eventType = eventTypes.find(type => type.value === event.type);
                const IconComponent = eventType?.icon || CalendarIcon;

                return (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg border transition-all hover:shadow-sakura ${
                      event.isCompleted ? 'opacity-60 bg-secondary/50' : 'bg-background'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <IconComponent className={`h-5 w-5 mt-0.5 ${eventType?.color || 'text-gray-500'}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium ${event.isCompleted ? 'line-through' : ''}`}>
                              {event.title}
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              {eventType?.label}
                            </Badge>
                            {event.isRecurring && (
                              <Badge variant="outline" className="text-xs">
                                {event.frequency}
                              </Badge>
                            )}
                          </div>
                          {event.time && (
                            <p className="text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {event.time}
                            </p>
                          )}
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {event.type === 'task' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEventCompletion(event.id)}
                            className="p-1"
                          >
                            {event.isCompleted ? "↶" : "✓"}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEvent(event.id)}
                          className="p-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <Card className="shadow-soft animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Event
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventTitle">Event Title</Label>
                <Input
                  id="eventTitle"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Doctor Appointment"
                  className="shadow-soft focus:shadow-sakura transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="shadow-soft focus:shadow-sakura transition-shadow">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventTime">Time (Optional)</Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                  className="shadow-soft focus:shadow-sakura transition-shadow"
                />
              </div>

              {newEvent.isRecurring && (
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={newEvent.frequency}
                    onValueChange={(value) => setNewEvent(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger className="shadow-soft focus:shadow-sakura transition-shadow">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDescription">Description (Optional)</Label>
              <Textarea
                id="eventDescription"
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details..."
                className="shadow-soft focus:shadow-sakura transition-shadow"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recurring"
                checked={newEvent.isRecurring}
                onChange={(e) => setNewEvent(prev => ({ ...prev, isRecurring: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="recurring">Make this a recurring event</Label>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={addEvent}
                variant="sakura" 
                className="flex-1"
                disabled={!newEvent.title.trim() || !newEvent.type}
              >
                <Save className="h-4 w-4 mr-2" />
                Add Event
              </Button>
              <Button 
                onClick={() => setShowAddForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events Summary */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {events
              .filter(event => new Date(event.date) >= new Date() && !event.isCompleted)
              .slice(0, 5)
              .map((event) => {
                const eventType = eventTypes.find(type => type.value === event.type);
                const IconComponent = eventType?.icon || CalendarIcon;

                return (
                  <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50">
                    <IconComponent className={`h-4 w-4 ${eventType?.color || 'text-gray-500'}`} />
                    <span className="font-medium">{event.title}</span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {format(new Date(event.date), "MMM d")}
                    </Badge>
                  </div>
                );
              })}
            {events.filter(event => new Date(event.date) >= new Date() && !event.isCompleted).length === 0 && (
              <p className="text-muted-foreground text-center py-4">No upcoming events</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}