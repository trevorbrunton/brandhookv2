export const deleteCategoryFetch = async (name: string): Promise<void> => {
  const res = await fetch("/api/delete-category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete category");
  }
};
