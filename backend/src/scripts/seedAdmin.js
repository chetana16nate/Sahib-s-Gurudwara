import 'dotenv/config';
import { connectDatabase } from '../config/db.js';
import Admin from '../models/Admin.js';

await connectDatabase();
const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in .env.');

const email = ADMIN_EMAIL.trim().toLowerCase();
const existing = await Admin.findOne({ email }).select('+password');

if (existing) {
  existing.name = ADMIN_NAME.trim();
  existing.password = ADMIN_PASSWORD;
  await existing.save();
  console.log('Admin credentials updated successfully.');
} else {
  await Admin.create({
    name: ADMIN_NAME.trim(),
    email,
    password: ADMIN_PASSWORD,
  });
  console.log('Admin created successfully.');
}

process.exit(0);
