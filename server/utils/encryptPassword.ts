import { randomBytes, scryptSync } from 'crypto';

const encryptPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex');
  // 64 is the derived key length, 16384 is the N (cost) parameter
  const hashed = scryptSync(password, salt, 64, { N: 16384 }).toString('hex');
  
  // You must store the salt along with the hash to verify it later
  return `${salt}:${hashed}`;
};

export default encryptPassword;
