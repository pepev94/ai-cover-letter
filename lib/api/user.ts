export type UpdateUserDto = {
  availableTokens?: number;
};

export const updateUser = (dto: UpdateUserDto) => {
  return fetch("/api/user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...dto,
    }),
  });
};
