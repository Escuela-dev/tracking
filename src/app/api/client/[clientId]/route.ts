import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { TogglAPI } from "@/lib/toggl";

const requestParamsSchema = z.object({
  clientId: z.string(),
  // clientId: z.string().uuid(),
});

export type ResponseError = {
  message: string;
};

// export const dynamic = 'force-dynamic'; // static by default, unless reading the request
// export const runtime = 'edge' // specify the runtime to be edge

// export const revalidate = 60;

export async function GET(
  _request: Request,
  { params }: { params: { clientId: string } },
): Promise<NextResponse<{} | ResponseError>> {
  try {
    // Validate id
    const { clientId } = requestParamsSchema.parse(params);
    // console.log({ clientId });

    // Get client from database
    const client = await db
      .select()
      .from(clients)
      .where(eq(clients.clientId, clientId))
      .get();

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const toggl = new TogglAPI();

    // Get time entries since last paid date
    const lastPaidDate = new Date(client.lastPaidDate);
    const timeEntries = await toggl.getTimeEntries(
      client.togglTag,
      lastPaidDate,
    );

    // console.log({ timeEntries });

    // Calculate total hours tracked
    const totalHoursTracked = timeEntries.reduce((total, entry) => {
      return total + (entry.duration > 0 ? entry.duration / 3600 : 0);
    }, 0);

    // console.log({ totalHoursTracked });

    // Calculate remaining hours
    const hoursRemaining = Math.max(
      0,
      client.totalHoursPaid - totalHoursTracked,
    );

    // Get last entry date
    const lastEntryDate =
      timeEntries.length > 0
        ? new Date(timeEntries[timeEntries.length - 1].start)
        : null;

    const firstEntry = timeEntries.at(0);

    return NextResponse.json({
      clientId,
      hoursRemaining: hoursRemaining.toFixed(2),
      lastPaidDate: client.lastPaidDate,
      numTimeEntries: timeEntries.length,
      togglLink: TogglAPI.generateTogglLink(firstEntry.tag_ids[0]),
      lastEntryTrackedDate: lastEntryDate?.toISOString() || null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid client ID format" },
        { status: 400 },
      );
    }
    console.error("Error processing request:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
