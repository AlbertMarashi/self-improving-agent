import { env } from "bun"
import OpenAI from "openai"
import { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessage } from "openai/resources/index.mjs"

const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY
})

export async function chat_response(
    messages: ChatCompletionMessage[],
    opts: Partial<ChatCompletionCreateParamsNonStreaming> = {}
): Promise<ChatCompletionMessage> {
    const response = await openai.chat.completions.create({
        messages,
        model: "gpt-3.5-turbo-0613",
        ...opts
    })

    return response.choices[0].message
}

