export const getDalle2Image = async (prompt: string): Promise<string> => {
  const res = await fetch("/api/open-ai/dalle-2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: prompt.slice(0, 700) }),
  });
  const data = await res.json();
  return data.data;
};
