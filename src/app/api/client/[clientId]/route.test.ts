import { describe, it, expect, vi, beforeEach } from "vitest";

import { GET } from "./route";
// import { db } from "@/lib/db";
// import { clients } from "@/lib/db/schema";
import time_entries from "@/../../__tests__/mocks/time_entries";
import { TogglAPI } from "@/lib/toggl";
// import { z } from "zod";

// const mockClassConstructor = vi.fn().mockReturnValue({
//   getTimeEntries: vi.fn(() =>
//     // TODO mock API request using msw instead of mocking the entire function
//     time_entries
//       .filter((entry) => entry.workspace_id === 8997504)
//       .filter((entry) => entry.tags?.includes("Dennis")),
//   ),
// });

const mocks = vi.hoisted(() => {
  // vi.resetModules()
  return {
    TogglAPI: Object.assign(
      vi.fn().mockReturnValue({
        getTimeEntries: vi.fn(() =>
          // TODO mock API request using msw instead of mocking the entire function
          time_entries
            .filter((entry) => entry.workspace_id === 8997504)
            .filter((entry) => entry.tags?.includes("Dennis")),
        ),
      }),
      {
        /**
         * This the mock for the static method.
         */
        generateTogglLink: vi.fn(
          () => "https://track.toggl.com/reports/summary/2",
        ),
      },
    ),
  };
});

// Mock dependencies

describe("GET /api/client/[clientId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should check the clientId param if not ", async () => {
    // @ts-expect-error
    const response = await GET(null, {});

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Invalid client ID format",
    });
  });

  it("returns 404 when client is not found", async () => {
    // const mockDb = db.select().from(clients).get;
    // mockDb.mockResolvedValueOnce(null);

    const response = await GET(null, {
      params: { clientId: "09870987-e89b-12d3-a456-426614174000" },
    });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Client not found" });
  });

  it.skip("returns Toggl API credentials not configured", async () => {
    // const mockDb = db.select().from(clients).get;
    // mockDb.mockResolvedValueOnce(null);

    const response = await GET(null, {
      params: { clientId: "123e4567-e89b-12d3-a456-426614174000" },
    });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Internal server error",
    });
  });

  it("returns client data with remaining hours", async () => {
    const mockClient = {
      clientId: "123e4567-e89b-12d3-a456-426614174000",
    };
    vi.mock("@/lib/toggl", async (importActual) => ({
      TogglAPI: mocks.TogglAPI,
    }));

    const mockTimeEntries = time_entries
      .filter((entry) => entry.workspace_id === 8997504)
      .filter((entry) => entry.tags?.includes("Dennis"));

    // const mockDb = db.select().from().where().get;
    // mockDb.mockResolvedValueOnce(mockClient);

    const response = await GET(null, {
      params: { clientId: mockClient.clientId },
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data).toEqual({
      clientId: mockClient.clientId,
      hoursRemaining: "2.50", // 16 paid - 13.496 tracked
      lastPaidDate: "2024-12-31T00:00:00.000Z",
      numTimeEntries: 20,
      togglLink: expect.stringMatching(
        /^https:\/\/track\.toggl\.com\/reports\/summary\/.*$/,
      ),
      lastEntryTrackedDate: new Date(
        mockTimeEntries.at(-1).start,
      ).toISOString(),
    });
  });

  // FIXME
  it.skip("returns client data with no time entries", async () => {
    const mockClient = {
      clientId: "123e4567-e89b-12d3-a456-426614174000",
    };

    vi.mocked(TogglAPI.prototype.getTimeEntries).mockReturnValue([]);

    // vi.mock("@/lib/toggl", async (importActual) => ({
    //   TogglAPI: mocks.TogglAPI,
    // }));

    // vi.mock("@/lib/toggl", async (importActual) => ({
    //   TogglAPI: {
    //     // ...mocks.TogglAPI,

    //     getTimeEntries: vi.fn(() => []),
    //   },
    // }));

    const response = await GET(null, {
      params: { clientId: mockClient.clientId },
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data).toEqual({
      clientId: mockClient.clientId,
      hoursRemaining: "16.00", // All hours remaining since no tracked time
      lastPaidDate: "2024-12-31T00:00:00.000Z",
      numTimeEntries: 0,
      togglLink: null,
      lastEntryTrackedDate: null, // No entries so no last tracked date
    });
  });
});
