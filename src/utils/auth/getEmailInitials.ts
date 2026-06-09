export const getEmailInitials = (email: string): string => {
  const localPart = email.split("@")[0] ?? "";
  if (localPart.length >= 2) {
    return localPart.slice(0, 2).toUpperCase();
  }

  return localPart.slice(0, 1).toUpperCase() || "?";
};
