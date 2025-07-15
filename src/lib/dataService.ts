// Data service for managing app data storage
export interface UserData {
  fullName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  height?: number;
  weight?: number;
  healthConditions?: string[];
  medicationsSupplements?: string[];
}

export interface TaskData {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  dueTime?: string;
  isRecurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

export interface DiaryEntry {
  id: string;
  date: string;
  entry: string;
  mood?: string;
  gratitude?: string[];
}

export interface FoodEntry {
  id: string;
  date: string;
  breakfast: {
    food: string;
    medications: Array<{name: string; taken: boolean}>;
    sugar?: number;
    bp?: string;
  };
  lunch: {
    food: string;
    medications: Array<{name: string; taken: boolean}>;
    sugar?: number;
    bp?: string;
  };
  dinner: {
    food: string;
    medications: Array<{name: string; taken: boolean}>;
    sugar?: number;
    bp?: string;
  };
  snacks: {
    food: string;
    medications: Array<{name: string; taken: boolean}>;
    sugar?: number;
    bp?: string;
  };
  intermittentFasting: {
    startTime: string;
    endTime: string;
  };
}

export interface Medication {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'other';
  timing: 'before' | 'after' | 'with';
  dosage?: string;
}

export interface PeriodData {
  id: string;
  lastPeriodStart: string;
  cycleLength: number;
  flowType: 'light' | 'medium' | 'heavy';
  notes?: string;
}

export interface FinancialData {
  id: string;
  date: string;
  expenses: Array<{
    category: string;
    amount: number;
    description: string;
  }>;
  monthlyDefaults: Array<{
    type: string;
    amount: number;
  }>;
  salary?: number;
  savings?: number;
  goals: Array<{
    name: string;
    target: number;
    current: number;
    completed: boolean;
  }>;
}

export interface NotificationData {
  id: string;
  type: "birthday" | "task" | "diary" | "medication" | "health";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  date: string;
}

class DataService {
  private getStorageKey(type: string, date?: string): string {
    return date ? `mirrome_${type}_${date}` : `mirrome_${type}`;
  }

  // Generic storage methods
  save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  load<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }

  // User data
  saveUserData(userData: UserData): void {
    this.save(this.getStorageKey('user'), userData);
  }

  getUserData(): UserData | null {
    return this.load<UserData>(this.getStorageKey('user'));
  }

  // Tasks
  saveTasks(date: string, tasks: TaskData[]): void {
    this.save(this.getStorageKey('tasks', date), tasks);
  }

  getTasks(date: string): TaskData[] {
    return this.load<TaskData[]>(this.getStorageKey('tasks', date)) || [];
  }

  // Recurring tasks
  saveRecurringTasks(tasks: TaskData[]): void {
    this.save(this.getStorageKey('recurring_tasks'), tasks);
  }

  getRecurringTasks(): TaskData[] {
    return this.load<TaskData[]>(this.getStorageKey('recurring_tasks')) || [];
  }

  // Diary entries
  saveDiaryEntry(date: string, entry: DiaryEntry): void {
    this.save(this.getStorageKey('diary', date), entry);
  }

  getDiaryEntry(date: string): DiaryEntry | null {
    return this.load<DiaryEntry>(this.getStorageKey('diary', date));
  }

  // Food entries
  saveFoodEntry(date: string, entry: FoodEntry): void {
    this.save(this.getStorageKey('food', date), entry);
  }

  getFoodEntry(date: string): FoodEntry | null {
    return this.load<FoodEntry>(this.getStorageKey('food', date));
  }

  // Medications
  saveMedications(medications: Medication[]): void {
    this.save(this.getStorageKey('medications'), medications);
  }

  getMedications(): Medication[] {
    return this.load<Medication[]>(this.getStorageKey('medications')) || [];
  }

  // Period data
  savePeriodData(data: PeriodData): void {
    this.save(this.getStorageKey('period'), data);
  }

  getPeriodData(): PeriodData | null {
    return this.load<PeriodData>(this.getStorageKey('period'));
  }

  // Financial data
  saveFinancialData(date: string, data: FinancialData): void {
    this.save(this.getStorageKey('financial', date), data);
  }

  getFinancialData(date: string): FinancialData | null {
    return this.load<FinancialData>(this.getStorageKey('financial', date));
  }

  // Notifications
  saveNotifications(notifications: NotificationData[]): void {
    this.save(this.getStorageKey('notifications'), notifications);
  }

  getNotifications(): NotificationData[] {
    return this.load<NotificationData[]>(this.getStorageKey('notifications')) || [];
  }

  // Utility methods
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getDateRange(startDate: Date, endDate: Date): string[] {
    const dates: string[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      dates.push(this.formatDate(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  }

  // Clear all data (for testing/reset)
  clearAllData(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('mirrome_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const dataService = new DataService();