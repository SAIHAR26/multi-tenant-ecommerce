import { apiRequest } from "../api/client";
import { getSavedUser } from "../api/auth";

const normalizeProfile = (data) => {
  const profile = data?.data?.user || data?.user || data;

  if (!profile || typeof profile !== "object") {
    return profile;
  }

  return {
    ...profile,
    orders: data?.data?.orders || profile.orders || [],
    wishlist: data?.data?.wishlist || profile.wishlist || null,
  };
};

export const getUserProfile = async (id = getSavedUser()?.id) => {
  if (!id) {
    throw new Error("No saved user profile is available.");
  }

  const data = await apiRequest(
    `/api/users/profile/${id}`,
    {},
    "Profile could not be loaded."
  );

  return normalizeProfile(data);
};

export const updateUserProfile = async (payload, id = getSavedUser()?.id) => {
  if (!id) {
    throw new Error("No saved user profile is available.");
  }

  const data = await apiRequest(
    `/api/users/profile/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    "Profile could not be updated."
  );

  const profile = normalizeProfile(data);
  const savedUser = getSavedUser();

  if (profile && savedUser) {
    localStorage.setItem(
      "vshopUser",
      JSON.stringify({
        ...savedUser,
        ...profile,
        id: profile._id || profile.id || savedUser.id,
      })
    );
  }

  return profile;
};

export const getUsers = async () => {
  return apiRequest("/api/users", {}, "Users could not be loaded.");
};
