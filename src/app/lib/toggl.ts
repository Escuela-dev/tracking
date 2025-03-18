import { z } from 'zod';

const timeEntrySchema = z.object({
  duration: z.number(),
  start: z.string(),
  tags: z.array(z.string()),
});

type TogglTimeEntry = z.infer<typeof timeEntrySchema>;

export class TogglAPI {
  private baseUrl = 'https://api.track.toggl.com/api/v9';
  private auth: string;

  constructor(email: string, password: string) {
    this.auth = Buffer.from(`${email}:${password}`).toString('base64');
  }

  async getTimeEntries(tag: string, startDate: Date): Promise<TogglTimeEntry[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me/time_entries?start_date=${startDate.toISOString()}`,
        {
          headers: {
            Authorization: `Basic ${this.auth}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Toggl API error: ${response.statusText}`);
      }

      const entries = await response.json();
      return entries
        .filter((entry: any) => entry.tags?.includes(tag))
        .map((entry: any) => timeEntrySchema.parse(entry));
    } catch (error) {
      throw new Error(`Failed to fetch time entries: ${error}`);
    }
  }

  static generateTogglLink(tag: string): string {
    return `https://track.toggl.com/timer?tags=${encodeURIComponent(tag)}`;
  }
}