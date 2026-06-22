import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("La variable OPENAI_API_KEY est absente.");
}

export const openai = new OpenAI({
  apiKey,
});
