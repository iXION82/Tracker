import mongoose from 'mongoose';
import Habit from '../src/models/Habit';
import HabitLog from '../src/models/HabitLog';
import Goal from '../src/models/Goal';
import Task from '../src/models/Task';
import JournalEntry from '../src/models/JournalEntry';
import MoodEntry from '../src/models/MoodEntry';
import SleepEntry from '../src/models/SleepEntry';
import TimeEntry from '../src/models/TimeEntry';
import Category from '../src/models/Category';
import UserSettings from '../src/models/UserSettings';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/life-tracker';

const DEFAULT_CATEGORIES = [
  { name: 'Health', color: 'green', icon: 'Heart' },
  { name: 'Fitness', color: 'orange', icon: 'Dumbbell' },
  { name: 'Learning', color: 'blue', icon: 'BookOpen' },
  { name: 'Productivity', color: 'purple', icon: 'Zap' },
  { name: 'Career', color: 'cyan', icon: 'Briefcase' },
  { name: 'Finance', color: 'green', icon: 'DollarSign' },
  { name: 'Personal', color: 'pink', icon: 'User' },
  { name: 'Sleep', color: 'indigo', icon: 'Moon' },
  { name: 'Social', color: 'yellow', icon: 'Users' },
  { name: 'Other', color: 'gray', icon: 'Archive' },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    console.log('Clearing existing data...');
    await Promise.all([
      Habit.deleteMany({}),
      HabitLog.deleteMany({}),
      Goal.deleteMany({}),
      Task.deleteMany({}),
      JournalEntry.deleteMany({}),
      MoodEntry.deleteMany({}),
      SleepEntry.deleteMany({}),
      TimeEntry.deleteMany({}),
      Category.deleteMany({}),
      UserSettings.deleteMany({}),
    ]);
    console.log('Existing data cleared.');

    console.log('Creating categories...');
    const categories = await Category.insertMany(DEFAULT_CATEGORIES);
    
    const getCategoryId = (name: string) => categories.find(c => c.name === name)?._id;

    console.log('Creating user settings...');
    await UserSettings.create({
      name: 'Ayushman',
      theme: 'dark',
      accentColor: '#3B82F6',
      dashboardWidgets: ['dailyCompletion', 'currentStreak', 'habitsCompleted', 'tasksCompleted', 'productivity'],
      lifeScoreWeights: { health: 30, learning: 25, productivity: 25, habits: 20 },
    });


    console.log('Creating habits...');
    const habitsData = [
      { name: 'Drink 8 glasses of water', type: 'count', target: 8, unit: 'glasses', categoryId: getCategoryId('Health'), section: 'Morning' },
      { name: 'Exercise for 30 minutes', type: 'timer', target: 30, unit: 'minutes', categoryId: getCategoryId('Fitness'), section: 'Morning' },
      { name: 'Read 10 pages', type: 'numeric', target: 10, unit: 'pages', categoryId: getCategoryId('Learning'), section: 'Evening' },
      { name: 'Study DSA', type: 'timer', target: 120, unit: 'minutes', categoryId: getCategoryId('Learning'), section: 'Work' },
      { name: 'Study ML', type: 'timer', target: 90, unit: 'minutes', categoryId: getCategoryId('Learning'), section: 'Work' },
      { name: 'Eat a balanced meal', type: 'boolean', categoryId: getCategoryId('Health'), section: 'Morning' },
      { name: 'Wake up by 8 AM', type: 'boolean', categoryId: getCategoryId('Health'), section: 'Morning' },
      { name: 'Sleep before 12 AM', type: 'boolean', categoryId: getCategoryId('Sleep'), section: 'Night' },
      { name: 'No phone after 10 PM', type: 'boolean', categoryId: getCategoryId('Personal'), section: 'Night' },
      { name: 'Journal', type: 'boolean', categoryId: getCategoryId('Personal'), section: 'Evening' },
      { name: 'Meditate', type: 'timer', target: 15, unit: 'minutes', categoryId: getCategoryId('Health'), section: 'Morning' },
      { name: 'Code for 2 hours', type: 'timer', target: 120, unit: 'minutes', categoryId: getCategoryId('Productivity'), section: 'Work' },
    ];
    
    const habits = await Habit.insertMany(habitsData.map((h, i) => ({ ...h, active: true, frequency: 'daily', customDays: [], color: '#3B82F6', icon: 'check', order: i })));

    console.log('Creating habit logs for last 30 days...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logsToInsert = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      for (const habit of habits) {
        let isWorkHabit = habit.section === 'Work' || habit.name.includes('Study') || habit.name.includes('Code');
        let chance = isWeekend && isWorkHabit ? 0.3 : 0.75;
        
        const completed = Math.random() < chance;
        
        let value = 0;
        if (completed) {
          if (habit.type === 'boolean') {
            value = 1;
          } else if (habit.type === 'count') {
            value = habit.target || 1;
          } else if (habit.type === 'numeric') {
            value = Math.floor((habit.target || 10) * (0.8 + Math.random() * 0.4)); 
          } else if (habit.type === 'timer') {
            value = habit.target || 30; 
          }
        } else if (habit.type !== 'boolean') {
          value = Math.floor((habit.target || 10) * Math.random() * 0.5); 
        }

        logsToInsert.push({
          habitId: habit._id,
          date: date,
          completed: value >= (habit.target || 1),
          value: value
        });
      }
    }
    await HabitLog.insertMany(logsToInsert);

    console.log('Creating goals...');
    const deadline = new Date('2026-12-31T23:59:59.999Z');
    await Goal.insertMany([
      { title: 'Reach 2000 Codeforces Rating', description: 'Practice everyday', target: 2000, currentValue: 1580, unit: 'rating', deadline, categoryId: getCategoryId('Learning'), status: 'active' },
      { title: 'Read 20 Books This Year', description: 'Read a bit every night', target: 20, currentValue: 7, unit: 'books', deadline, categoryId: getCategoryId('Learning'), status: 'active' },
      { title: 'Exercise 200 Days', description: 'Stay fit', target: 200, currentValue: 85, unit: 'days', deadline, categoryId: getCategoryId('Fitness'), status: 'active' },
    ]);

    console.log('Creating tasks...');
    await Task.insertMany([
      { title: 'Complete Next.js module', categoryId: getCategoryId('Learning'), priority: 'high', status: 'completed', dueDate: new Date(today.getTime() - 86400000 * 2) },
      { title: 'Pay electricity bill', categoryId: getCategoryId('Finance'), priority: 'high', status: 'pending', dueDate: new Date(today.getTime() + 86400000) },
      { title: 'Schedule dentist appointment', categoryId: getCategoryId('Health'), priority: 'medium', status: 'pending', dueDate: new Date(today.getTime() + 86400000 * 3) },
      { title: 'Review PRs', categoryId: getCategoryId('Career'), priority: 'high', status: 'pending', dueDate: today },
      { title: 'Solve 2 DP problems', categoryId: getCategoryId('Learning'), priority: 'medium', status: 'pending', dueDate: today },
      { title: 'Grocery shopping', categoryId: getCategoryId('Other'), priority: 'low', status: 'pending', dueDate: new Date(today.getTime() + 86400000 * 2) },
      { title: 'Call parents', categoryId: getCategoryId('Social'), priority: 'medium', status: 'completed', dueDate: today },
      { title: 'Update resume', categoryId: getCategoryId('Career'), priority: 'medium', status: 'pending', dueDate: new Date(today.getTime() + 86400000 * 5) },
      { title: 'Fix bug #42', categoryId: getCategoryId('Productivity'), priority: 'high', status: 'pending', dueDate: today },
      { title: 'Organize desk', categoryId: getCategoryId('Personal'), priority: 'low', status: 'pending' },
    ]);

    console.log('Creating journal entries...');
    const journals = [];
    for (let i = 0; i < 15; i++) {
      const date = new Date(today.getTime() - (Math.random() * 30 * 86400000));
      journals.push({
        title: `Thoughts for ${date.toDateString()}`,
        content: `Today was an interesting day. I focused on some long-term goals and felt pretty productive. ${Math.random() > 0.5 ? 'Learning new concepts in React was fun.' : 'Got slightly stuck on a DSA problem but figured it out eventually.'}`,
        date: date,
        tags: ['productivity', 'reflection', 'goals', 'learning'].sort(() => 0.5 - Math.random()).slice(0, 2),
        mood: Math.floor(Math.random() * 3) + 3 // 3-5
      });
    }
    await JournalEntry.insertMany(journals);

    console.log('Creating mood entries...');
    const moods = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today.getTime() - (i * 86400000));
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      let moodVal = isWeekend ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 3) + 2; // 4-5 on weekends, 2-4 on weekdays
      let energy = Math.floor(Math.random() * 3) + 2;
      let stress = isWeekend ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 2;
      
      moods.push({
        date: date,
        mood: moodVal,
        energy: energy,
        stress: stress,
        note: isWeekend ? 'Relaxing weekend' : 'Busy work day'
      });
    }
    await MoodEntry.insertMany(moods);

    console.log('Creating sleep entries...');
    const sleeps = [];
    for (let i = 0; i < 20; i++) {
      const date = new Date(today.getTime() - (i * 86400000));
      
      const sleepStart = new Date(date);
      sleepStart.setDate(sleepStart.getDate() - 1);
      sleepStart.setHours(22 + Math.random() * 3, Math.floor(Math.random() * 60), 0, 0); // between 10 PM and 1 AM
      
      const sleepEnd = new Date(date);
      sleepEnd.setHours(6 + Math.random() * 3, Math.floor(Math.random() * 60), 0, 0); // between 6 AM and 9 AM
      
      const durationHours = (sleepEnd.getTime() - sleepStart.getTime()) / (1000 * 60 * 60);

      sleeps.push({
        date: date,
        sleepTime: sleepStart,
        wakeTime: sleepEnd,
        duration: durationHours,
        quality: Math.floor(Math.random() * 4) + 2 // 2 to 5
      });
    }
    await SleepEntry.insertMany(sleeps);

    console.log('Creating time entries...');
    const activities = [
      { name: 'DSA', category: getCategoryId('Learning') },
      { name: 'ML', category: getCategoryId('Learning') },
      { name: 'Web Development', category: getCategoryId('Productivity') },
      { name: 'College', category: getCategoryId('Other') },
      { name: 'Projects', category: getCategoryId('Productivity') },
      { name: 'Reading', category: getCategoryId('Learning') }
    ];
    
    const times = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today.getTime() - (i * 86400000));
      const numEntries = Math.floor(Math.random() * 4) + 1; // 1-4 per day
      
      for(let j = 0; j < numEntries; j++) {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        const duration = Math.floor(Math.random() * 150) + 30; // 30 - 180 mins
        
        const startTime = new Date(date);
        startTime.setHours(9 + Math.random() * 10, Math.floor(Math.random() * 60), 0, 0);
        
        const endTime = new Date(startTime.getTime() + duration * 60000);
        
        times.push({
          activity: activity.name,
          category: activity.category,
          startTime: startTime,
          endTime: endTime,
          duration: duration,
          date: date
        });
      }
    }
    await TimeEntry.insertMany(times);

    console.log('--- Seed Summary ---');
    console.log(`Categories: ${categories.length}`);
    console.log(`Habits: ${habits.length}`);
    console.log(`Habit Logs: ${logsToInsert.length}`);
    console.log(`Goals: 3`);
    console.log(`Tasks: 10`);
    console.log(`Journal Entries: ${journals.length}`);
    console.log(`Mood Entries: ${moods.length}`);
    console.log(`Sleep Entries: ${sleeps.length}`);
    console.log(`Time Entries: ${times.length}`);
    console.log('--------------------');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    console.log('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('Done.');
  }
}

seed();
