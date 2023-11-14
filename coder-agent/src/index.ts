// import { chat_response } from "./openai"
// import { get_files_in_dir, read_file_with_line_numbers } from "./utils/files"
// import { extname, join } from "path"
// import { chat_response } from "./openai"

import { BaseAgent } from "./agent"

// const dir = import.meta.dir
// const files = (await get_files_in_dir(dir, ["node_modules"]))
// const code = await Promise.all(files.map(async f =>
//     `\`${f}\`
// \`\`\`${extname(f).slice(1)}
// ${await read_file_with_line_numbers(join(dir, f))}
// \`\`\`
// `))

// const PROMPT = `
// Given the following codebase of an AI designed to self-improve, how would you improve its capabilities?
// Start by a short paragraph of thoughts, followed by code changes.
// ${ code.join("\n") }
// `

// console.log(PROMPT)

// const response = await chat_response([{
//     content: PROMPT,
//     role: "system",
// }])

// console.log(response.content)

const agent = new BaseAgent()

console.log(await agent.run())