import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildPrompt(answers: string[]) {
  const [
    place, power, companions, role, vibe, goal, aesthetic,
  ] = answers;
  return `
Imagine the person in the reference photo living inside their ultimate fantasy.
Scene • ${place}, ${aesthetic} style.
They wield • ${power}.
Companions • ${companions}.
Role • ${role}.
Overall vibe • ${vibe}.
Life mission • ${goal}.
Paint a vivid, cinematic portrait that captures this world in one image.
  `;
}

export async function POST(req: NextRequest) {
  const { answers, selfie } = await req.json();
  const prompt = buildPrompt(answers);

  const imageResp = await openai.images.generate({
    model: 'gpt-image-1',
    prompt,
    image: { url: selfie },
    size: '1024x1024',
    n: 1,
  });

  return NextResponse.json({ url: imageResp.data[0].url });
}