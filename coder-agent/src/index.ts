import { chat_response } from "./openai"
import { get_files_in_dir, read_file_with_line_numbers } from "./utils/files"
import { extname, join } from "path"


const dir = import.meta.dir
const files = (await get_files_in_dir(dir, [`node_modules`, `tests`]))
const code = await Promise.all(files.map(async f =>
    `\`${f}\`
\`\`\`${extname(f).slice(1)}
${await read_file_with_line_numbers(join(dir, f))}
\`\`\`
`))

const PROMPT = `
Given the following codebase of an AI designed to self-improve, how would you improve its capabilities?
Start by a short paragraph of thoughts, followed by code changes.
${ code.join(`\n`) }
`

console.log(PROMPT)

// const response = await chat_response([{
//     content: PROMPT,
//     role: "system",
// }])

// console.log(response.content)

// import { resolve } from "path"
// import { BaseAgent } from "./agent"
// const dir = resolve(import.meta.dir, `../tests/tools/edit_lines_of_code`)

// const agent = new BaseAgent(`Pass the test`, dir)

// console.log(await agent.start_run())


// agent.on(`run:updated`, async () => {
//     const messages = await agent.get_messages()

//     const text = messages.map(m => `${m.role}: ${m.content[0].type === `text` ? m.content[0].text.value : null}`).join(`\n`)

//     console.log(text)
// })

// const { required_action } = await agent.until_status(`requires_action`)

// console.log(required_action!.submit_tool_outputs.tool_calls)