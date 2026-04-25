import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthPresenter {
  static async registerUser(name: string, email: string, passwordHashRaw: string) {
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error('User already exists');
      (error as any).statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordHashRaw, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: this.generateToken(user._id as string),
    };
  }

  static async loginUser(email: string, passwordHashRaw: string) {
    const user = await User.findOne({ email });
    
    if (!user) {
      const error = new Error('Invalid credentials');
      (error as any).statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(passwordHashRaw, user.passwordHash);
    
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      (error as any).statusCode = 401;
      throw error;
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      token: this.generateToken(user._id as string),
    };
  }

  private static generateToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_reimmagined', {
      expiresIn: '30d',
    });
  }
}
