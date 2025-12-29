
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getFinancialInsight(transactions: Transaction[]) {
  if (transactions.length === 0) {
    return "Adicione algumas transações para que eu possa analisar sua saúde financeira!";
  }

  const prompt = `
    Como um assistente financeiro especialista, analise os seguintes dados de transações do usuário:
    ${JSON.stringify(transactions)}

    Com base nesses dados, forneça um breve insight (máximo 3 frases) em Português do Brasil sobre como o usuário pode economizar ou o que se destaca nos gastos dele. Seja motivador e prático.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Continue focado no seu planejamento financeiro!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Mantenha o controle das suas contas para garantir um futuro tranquilo!";
  }
}
