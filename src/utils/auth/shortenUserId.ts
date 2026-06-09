export const shortenUserId = (userId: string, visibleChars = 8): string => {
  if (userId.length <= visibleChars + 3) {
    return userId;
  }

  return `${userId.slice(0, visibleChars)}…`;
};
