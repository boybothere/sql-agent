import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import { z } from "zod";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query their database using natural language.

You have access to following tools:
1. db tool - call this tool to query the database.

Rules:
- Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP)
- Return valid SQLite syntax

Always respond in a helpful, conversational tone while being technically accurate.`;

    const result = streamText({
        model: openai('gpt-4o-mini'),
        messages: convertToModelMessages(messages),
        system: SYSTEM_PROMPT,
        tools: {
            db: tool({
                description: 'Call this tool to query a database',
                inputSchema: z.object({
                    query: z.string().describe('The SQL query to be ran.'),
                }),
                execute: async ({ query }) => {
                    console.log("Query: ", query);

                    return '';
                },
            }),
        },
    });

    return result.toUIMessageStreamResponse();
}