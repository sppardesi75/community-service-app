// migrateUpdates.js
const mongoose = require('mongoose');
require('dotenv').config();

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

const issueSchema = new mongoose.Schema({
  // Your schema definition here (same as in your model)
  updates: [{
    text: String,
    status: String,
    timestamp: Date
  }]
  // Include other fields as needed
});

const Issue = mongoose.models.Issue || mongoose.model('Issue', issueSchema);

async function migrate() {
  try {
    await connectToDatabase();
    const issues = await Issue.find({});

    let count = 0;
    for (const issue of issues) {
      if (Array.isArray(issue.updates)) {
        const cleanedUpdates = issue.updates
          .map(update => {
            // Handle string updates
            if (typeof update === 'string') {
              return {
                text: update || 'No update text provided',
                status: issue.status || 'Pending Approval',
                timestamp: new Date()
              };
            }
            // Handle object updates
            return {
              text: update.text || 'No update text provided',
              status: update.status || issue.status || 'Pending Approval',
              timestamp: update.timestamp || new Date()
            };
          })
          .filter(update => update.text);

        if (JSON.stringify(issue.updates) !== JSON.stringify(cleanedUpdates)) {
          issue.updates = cleanedUpdates;
          await issue.save();
          count++;
          console.log(`Migrated issue ${issue._id}`);
        }
      }
    }

    console.log(`Migration complete. Updated ${count} issues.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();