# AI SQL Agent

A Next.js chat application that uses the Vercel AI SDK and OpenAI to answer natural language questions by safely generating and executing SQL queries against a database.

---

## Features

* **Natural Language to SQL:** Ask "How many products did we sell?" and get a direct answer.
* **AI Tool-Using:** The AI agent uses a `schema` tool to learn the database structure and a `db` tool to run `SELECT` queries.
* **Safe by Design:** The system prompt restricts the AI to **read-only (`SELECT`) operations**.
* **Streaming UI:** Responses and AI tool-call statuses stream back to the user in real-time.

---

## Tech Stack

* **Framework:** Next.js (App Router)
* **AI:** Vercel AI SDK 3.0, OpenAI (`gpt-4o-mini`)
* **Frontend:** React (`useChat` hook), Tailwind CSS
* **Schema Validation:** Zod

---

## How It Works

1.  **Frontend:** The `useChat` hook sends the user's message to the `/api/chat` endpoint.
2.  **Backend:** The API route uses `streamText` to give the AI a system prompt and access to two tools: `schema` (gets DB structure) and `db` (runs a query).
3.  **AI Process:** The AI first calls `schema` to understand the tables, then calls `db` with a generated SQL query to get the data.
4.  **Response:** The final natural language answer is streamed back to the frontend.
