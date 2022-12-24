export async function imageToPrompt(imageUrl: string): Promise<void> {
  const response = await fetch('http://localhost:5000/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: {
        image: 'http://localhost:1618/assets/lexi-typography.svg',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to make prediction: ${response.statusText}`);
  }

  const result = await response.json();
  return result.output;
}