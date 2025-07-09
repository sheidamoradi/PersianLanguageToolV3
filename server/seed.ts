import { db } from './db';
import { users } from '@shared/schema';
import { hashPassword } from './auth';
import { eq } from 'drizzle-orm';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.username, 'admin'))
      .limit(1);
    
    if (existingAdmin.length === 0) {
      // Create admin user
      const hashedPassword = await hashPassword('730895015');
      
      await db.insert(users).values({
        username: 'admin',
        password: hashedPassword,
        name: 'مدیر سیستم',
        email: 'admin@pistach.com',
        role: 'admin',
        membershipType: 'Premium'
      });
      
      console.log('Admin user created successfully');
      console.log('Username: admin');
      console.log('Password: 730895015');
    } else {
      console.log('Admin user already exists');
    }
    
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0));
}

export { seedDatabase };