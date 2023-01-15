import * as crypto from 'crypto';

export function passwordHash(password: string) {
    const passwordHash = crypto.createHash('sha512');
    passwordHash.update(password);
    return passwordHash.digest('hex').toString().toUpperCase();
}