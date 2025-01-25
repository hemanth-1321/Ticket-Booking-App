import { describe, expect, test, it } from "vitest";
import { axios } from "./axios";
const BACKEND_URL = "http://localhost:8080";
describe("Events", () => {
  it("Can create an event with the right location", async () => {
    const locationResponse = await axios.post(
      `${BACKEND_URL}/api/v1/location/create`,
      {
        name: "bannglore",
        description: "bengaluru, silicon vally",
        imageUrl:
          "https://unsplash.com/photos/a-very-tall-mountain-covered-in-snow-at-sunset-e9kPHCJCHM8",
      }
    );

    const createEvent = {
      name: "Live Event",
      description: "Late night show",
      startTime: "2025-01-20T19:00:00Z", // Use ISO 8601 format for dates
      locationId: locationResponse.id,
      imageUrl:
        "https://unsplash.com/photos/a-very-tall-mountain-covered-in-snow-at-sunset-e9kPHCJCHM8",
    };

    const response = await axios.post(
      `${BACKEND_URL}/api/v1/event`,
      createEvent
    );

    expect(response.status).toBe(201);
  });
});
