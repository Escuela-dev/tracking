import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { db } from '@/lib/db';
import { TogglAPI } from '@/lib/toggl';

// Mock dependencies
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          get: vi.fn(),
        })),
      })),
    })),
  },
}));

vi.mock('@/lib/toggl', () => ({
  TogglAPI: vi.fn(() => ({
    getTimeEntries: vi.fn(),
  })),
  generateTogglLink: vi.fn(),
}));

describe('GET /api/client/[clientId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when client is not found', async () => {
    const mockDb = db.select().from().where().get;
    mockDb.mockResolvedValueOnce(null);

    const response = await GET(
      new Request('http://localhost/api/client/123'),
      { params: { clientId: '123e4567-e89b-12d3-a456-426614174000' } }
    );

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Client not found' });
  });

  it('returns client data with remaining hours', async () => {
    const mockClient = {
      clientId: '123e4567-e89b-12d3-a456-426614174000',
      togglTag: 'client-123',
      totalHoursPaid: 40,
      lastPaidDate: '2024-01-01T00:00:00.000Z',
    };

    const mockTimeEntries = [
      {
        duration: 3600, // 1 hour
        start: '2024-01-02T10:00:00.000Z',
        tags: ['client-123'],
      },
    ];

    const mockDb = db.select().from().where().get;
    mockDb.mockResolvedValueOnce(mockClient);

    const mockToggl = new TogglAPI();
    mockToggl.getTimeEntries.mockResolvedValueOnce(mockTimeEntries);

    const response = await GET(
      new Request('http://localhost/api/client/123'),
      { params: { clientId: mockClient.clientId } }
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      clientId: mockClient.clientId,
      hoursRemaining: 39, // 40 paid - 1 tracked
      lastPaidDate: mockClient.lastPaidDate,
      togglLink: expect.any(String),
      lastEntryTrackedDate: mockTimeEntries[0].start,
    });
  });
});