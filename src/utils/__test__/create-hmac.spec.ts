import { createHmac } from '..';
import crypto from 'crypto';

jest.mock('crypto');

describe('createHmac', () => {
  it('return hash', () => {
    const message = 'mock-message';
    const key = 'mock-key';

    const mockHmacUpdate = jest.fn().mockReturnValueOnce(undefined);
    const mockDigestUpdate = jest.fn().mockReturnValueOnce('mock-hash');

    (crypto.createHmac as jest.Mock).mockReturnValueOnce({
      update: mockHmacUpdate,
      digest: mockDigestUpdate,
    });

    const response = createHmac(message, key);

    expect(mockHmacUpdate).toHaveBeenCalledWith('mock-message');
    expect(mockDigestUpdate).toHaveBeenCalledWith('base64');
    expect(response).toBe('mock-hash');
  });
});
