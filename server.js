import { v2 } from 'cloudinary';
import Razorpay from 'razorpay';

import app from './app.js';
// import connectToDB from './configs/dbConn.js';
import db from './configs/dbConn.js';

// Cloudinary configuration
v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Razorpay configuration
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const PORT = process.env.PORT || 5000;


// Start the server by listening on the specified port.
app.listen(PORT, () => {

  // Start the application by connecting to the database and setting up database events.// Log a message to the console to indicate that the server is running and listening for connections.
  const startApp = async () => {
      const connection = await db.connectToDb();
      db.setupDbEvents();

      // Your application logic here
      console.log(`Server is running on port: ${PORT}`);
  };

  startApp();

  
});