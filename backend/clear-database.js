const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mess_booking';

async function clearDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`\n📋 Found ${collections.length} collection(s):`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    if (collections.length === 0) {
      console.log('\n✨ Database is already empty!');
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log('\n🗑️  Dropping all collections...');
    
    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`   ✓ Dropped: ${collection.name}`);
    }

    // Verify database is empty
    const remainingCollections = await db.listCollections().toArray();
    
    if (remainingCollections.length === 0) {
      console.log('\n✅ SUCCESS: All collections have been deleted!');
      console.log('✨ Database is now clean and empty.');
    } else {
      console.log('\n⚠️  Warning: Some collections still exist:');
      remainingCollections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }

    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    console.log('\n🎉 Database cleanup complete! You can now restart your application.');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error clearing database:', error.message);
    
    if (error.message.includes('not connected')) {
      console.error('💡 Make sure MongoDB is running!');
    }
    
    process.exit(1);
  }
}

// Run the cleanup
clearDatabase();

