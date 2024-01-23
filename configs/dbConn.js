import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const connectToDb = async () => {
  const maxRetries = 5; // Maximum number of connection retries
  let currentRetry = 0;

  while (currentRetry < maxRetries) {
    try {
      const { connection } = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(`Connected to MongoDB: ${connection.host} port:${connection.port}/and connection name:${connection.name}`);
      return connection; // If connection is successful, return the connection
    } catch (error) {
      console.error(`Error connecting to MongoDB (Attempt ${currentRetry + 1}):`, error);
      currentRetry++;

      // Wait for a moment before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 seconds (adjust as needed)
    }
  }

  console.error('Failed to connect to MongoDB after maximum retries.');
  process.exit(1); // Exit the process if maximum retries are reached
};

const setupDbEvents = () => {
  const db = mongoose.connection;

  // Event: Error
  db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  // Event: Disconnected
  db.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  // Event: Connected
  db.on('connected', () => {
    console.log('MongoDB connected');
  });

  // Event: Reconnected
  db.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });

  // Close the Mongoose connection when the Node process receives a SIGINT signal (e.g., when you press Ctrl+C)
  process.on('SIGINT', async () => {
    // Close the Mongoose connection
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    } finally {
      // Forcefully exit the process after closing the connection
      process.exit(0);
    }
  });
};

export default { connectToDb, setupDbEvents };
