

// A tool to edit code in a file.

import type { FunctionDefinition } from "openai/resources/shared.mjs"

// Takes in the line numbers to edit, and instructions for what to change.
export const edit_code_function: FunctionDefinition = {
    name: "edit_code",
    description: "Edit the code in a file by a line number range, and instructions for what to change.",
    parameters: {
        type: "object",
        properties: {
            file: {
                description: "The file to edit.",
                type: "string"
            },
            line_numbers: {
                description: "A line number range to edit. This can be a single line number, or a range consisting of two line numbers.",
                type: "array",
                items: {
                    type: "integer"
                },
                maxItems: 2,
                minItems: 1
            },
            instructions: {
                description: "Instructions for what to change.",
                type: "string"
            },
        },
        required: ["file", "line_numbers", "instructions"]
    }
}