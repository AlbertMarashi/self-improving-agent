// import { chat_response } from "./openai"
import { get_files_in_dir, read_file } from "./files"
import { extname, join } from "path"
import { chat_response } from "./openai"

const dir = import.meta.dir
const files = (await get_files_in_dir("src", ""))
const code = await Promise.all(files.map(async f =>
    `\`${f}\`
\`\`\`${extname(f).slice(1)}
${await read_file(join(dir, f))}
\`\`\`
`))

const memory = ""

const PROMPT = `
Given the following codebase of an AI designed to self-improve, how would you improve its capabilities?
Start by a short paragraph of thoughts, followed by code changes.
${ code.join("\n") }
`

console.log(PROMPT)

const response = await chat_response([{
    content: PROMPT,
    role: "system",
}])

console.log(response.content)