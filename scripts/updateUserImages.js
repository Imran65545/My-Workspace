import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('MONGODB_URI:', process.env.MONGODB_URI); // <-- Add this line

import { addDefaultImagesToUsers } from "../lib/mongodb.js";

addDefaultImagesToUsers().then(() => {
  console.log("Done!");
  process.exit(0);
}); 