import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/ai/openai";

export const runtime = "nodejs";

type GenerateContentBody = {
  topic?: string;
  platform?: "linkedin" | "facebook" | "instagram" | "x";
  tone?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateContentBody;

    const topic = body.topic?.trim();
    const platform = body.platform ?? "linkedin";
    const tone = body.tone?.trim() || "professionnel, accessible et engageant";

    if (!topic) {
      return NextResponse.json(
        { error: "Le sujet est obligatoire." },
        { status: 400 },
      );
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: `
Tu es le responsable éditorial de Gedify, une application française
de gestion de documents personnels destinée aux particuliers,
couples et familles.

Tu rédiges des publications naturelles, pédagogiques et crédibles.
Tu évites le jargon, les promesses exagérées et les formulations
qui ressemblent à du contenu généré automatiquement.
      `.trim(),
      input: `
Plateforme : ${platform}
Sujet : ${topic}
Ton : ${tone}

Rédige :
- une accroche forte ;
- une publication adaptée à la plateforme ;
- un appel à l'action discret ;
- 5 hashtags pertinents ;
- aucune information inventée.
      `.trim(),
      max_output_tokens: Number(
        process.env.OPENAI_MAX_OUTPUT_TOKENS || 2500,
      ),
    });

    return NextResponse.json({
      content: response.output_text,
    });
  } catch (error) {
    console.error("OpenAI generation error:", error);

    return NextResponse.json(
      { error: "La génération du contenu a échoué." },
      { status: 500 },
    );
  }
}
