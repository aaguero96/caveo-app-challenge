import crypto from 'crypto';

export const createHmac = (message: string, key: string): string => {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(message);
  return hmac.digest('base64');
};
