import {
  AdoptionStatus,
  LocationType,
  Sex,
  Size,
  Species,
  UserRole,
} from "@prisma/client";

export const SPECIES_LABELS: Record<Species, string> = {
  DOG: "Dog",
  CAT: "Cat",
  RABBIT: "Rabbit",
  BIRD: "Bird",
  OTHER: "Other",
};

export const SEX_LABELS: Record<Sex, string> = {
  MALE: "Male",
  FEMALE: "Female",
  UNKNOWN: "Unknown",
};

export const SIZE_LABELS: Record<Size, string> = {
  SMALL: "Small",
  MEDIUM: "Medium",
  LARGE: "Large",
  XLARGE: "X-Large",
  UNKNOWN: "Unknown",
};

export const ADOPTION_STATUS_LABELS: Record<AdoptionStatus, string> = {
  AVAILABLE: "Available",
  PENDING: "Pending",
  ADOPTED: "Adopted",
  HOLD: "On Hold",
  NOT_AVAILABLE: "Not Available",
};

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  SHELTER: "Shelter",
  PET_STORE: "Pet Store",
  FOSTER: "Foster Home",
  OTHER: "Other",
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Admin",
  STAFF: "Staff",
};

export const ADOPTION_STATUS_COLORS: Record<AdoptionStatus, string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  ADOPTED: "bg-blue-100 text-blue-800",
  HOLD: "bg-orange-100 text-orange-800",
  NOT_AVAILABLE: "bg-gray-100 text-gray-800",
};
