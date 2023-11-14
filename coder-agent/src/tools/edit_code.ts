

// A tool to edit code in a file.

import type { FunctionDefinition } from "openai/resources/shared.mjs"
import { chat_response } from "../openai"
import type { BaseAgent } from "../agent"

abstract class Tool {
    abstract name: string
    abstract description: string
    abstract parameters: FunctionDefinition[`parameters`]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract run(agent: BaseAgent, args: any): Promise<string>
    to_function_definition(): FunctionDefinition {
        return {
            name: this.name,
            description: this.description,
            parameters: this.parameters
        }
    }
}

export class EditCodeTool extends Tool {
    name = `edit_code`
    description = `Edit the code in a file by a line number range, and instructions for what to change.`
    parameters = {
        type: `object`,
        properties: {
            file: {
                description: `The file to edit.`,
                type: `string`
            },
            line_numbers: {
                description: `A line number range to edit. This can be a single line number, or a range consisting of two line numbers.`,
                type: `array`,
                items: {
                    type: `integer`
                },
                maxItems: 2,
                minItems: 1
            },
            instructions: {
                description: `Instructions for what to change.`,
                type: `string`
            },
        },
        required: [`file`, `line_numbers`, `instructions`]
    }

    async run(agent: BaseAgent, args: { file: string, line_numbers: [number, number?], instructions: string }) {
        // read the file
        const file = agent.read_file(args.file)
        const lines = file.split(`\n`)

        // get the range of lines
        const [start, end = start] = args.line_numbers

        const prompt = `
Given the following code file:
\`${args.file}\`
\`\`\`
${lines.map((l, i) => `${i + 1}: ${l}`).join(`\n`)}
\`\`\`

- Starting at line ${start}, and ending at line ${end}, implement the following changes/instructions:
\`\`\`
${args.instructions}
\`\`\`

- Output only valid raw code syntax, do not wrap response in a code block / backticks.
- Unless otherwise specified, do not remove lines of code.
- Do not output lines of code outside of the range.
- Use the same coding style as the existing code.
`
        console.info(`Prompting:`, prompt)
        const response = await chat_response([{
            content: prompt,
            role: `system`
        }])

        const new_lines = response.content!.split(`\n`)
        lines.splice(start - 1, end - start + 1, ...new_lines)

        const output = lines.join(`\n`)

        // save the file
        agent.write_file(args.file, output)

        console.info(`Updated ${args.file}`)

        return `Updated code`
    }
}