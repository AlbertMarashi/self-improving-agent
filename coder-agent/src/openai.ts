import { env } from "bun"
import OpenAI from "openai"
import type { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessage, ChatCompletionMessageParam } from "openai/resources/index.mjs"
import { edit_code_function } from "./tools/edit_code"

export const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY
})

export async function chat_response(
    messages: ChatCompletionMessageParam[],
    opts: Partial<ChatCompletionCreateParamsNonStreaming> = {}
): Promise<ChatCompletionMessage> {
    const response = await openai.chat.completions.create({
        messages,
        model: "gpt-4-1106-preview",
        ...opts
    })

    return response.choices[0].message
}
