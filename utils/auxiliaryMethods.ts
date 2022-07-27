import * as crypto from 'crypto';
import { config } from '../config/config';

export const isPasswordValid = (password: string): boolean => (/^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{7,15}$/).test(password);

export const hashPassword = (password: string): string => {
    const hmac = crypto.createHmac('sha512', config.passwordSalt);
    hmac.update(password);
    return hmac.digest('hex');
};