import bcrypt from 'bcrypt';

async function hashPassword(password: string) {
  try {
    // Generate salt with cost factor of 12 (good balance of security and performance)
    const saltRounds = 12;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('Original password:', password);
    console.log('Hashed password:', hashedPassword);
    
    // Verify the hash works
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Verification successful:', isValid);
    
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

// Hash the password "Weezy@1996"
hashPassword('Weezy@1996');
