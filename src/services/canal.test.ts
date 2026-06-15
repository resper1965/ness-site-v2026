import { describe, it, expect, vi, beforeEach } from 'vitest';
import { canalApi, ApiError } from './canal';

describe('canalApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('submitForm should handle success response correctly', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ success: true, id: 123 })),
    });

    const result = await canalApi.submitForm({ name: 'Test' });
    expect(result).toEqual({ success: true, id: 123 });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/submit-form'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
      })
    );
  });

  it('submitForm should handle network or API errors properly', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Validation failed' }),
    });

    await expect(canalApi.submitForm({ name: 'Test' })).rejects.toThrowError(ApiError);
    await expect(canalApi.submitForm({ name: 'Test' })).rejects.toThrow('Validation failed');
  });

  it('getJobs should correctly parse the response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify([{ id: 'job-1', title: 'Dev' }])),
    });

    const result = await canalApi.getJobs('pt');
    expect(result).toEqual([{ id: 'job-1', title: 'Dev' }]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/jobs?lang=pt'),
      expect.any(Object)
    );
  });
});
