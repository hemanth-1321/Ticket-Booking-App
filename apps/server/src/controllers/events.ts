import { client } from "@repo/db/client";

export function getEvent(eventId: string, adminId?: string) {
  if (adminId) {
    return client.event.findUnique({
      where: {
        id: eventId,
        adminId: adminId,
      },
    });
  }

  return client.event.findUnique({
    where: {
      id: eventId,
    },
  });
}
