import { apiRequest } from "../api/client";

export const getSegments = async () => {
  return apiRequest("/api/segments", {}, "Segments could not be loaded.");
};

export const getSegmentById = async (id) => {
  return apiRequest(`/api/segments/${id}`, {}, "Segment details could not be loaded.");
};

export const createSegment = async (segment) => {
  return apiRequest(
    "/api/segments",
    {
      method: "POST",
      body: JSON.stringify(segment),
    },
    "Segment could not be created."
  );
};

export const deleteSegment = async (id) => {
  return apiRequest(
    `/api/segments/${id}`,
    {
      method: "DELETE",
    },
    "Segment could not be deleted."
  );
};
