import mongoose from 'mongoose';

async function fixIndexes() {
  await mongoose.connect('mongodb://127.0.0.1:27017/life-tracker');
  console.log('Connected.');
  
  // Drop old DailyTimeWindow collection entirely (it had wrong schema)
  try {
    await mongoose.connection.db?.collection('dailytimewindows').drop();
    console.log('Dropped old dailytimewindows collection.');
  } catch (e: any) {
    console.log('Collection may not exist yet:', e.message);
  }
  
  await mongoose.disconnect();
  console.log('Done.');
}

fixIndexes();
