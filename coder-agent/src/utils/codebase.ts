import { extname, join } from "path"
import { get_files_in_dir, read_file_with_line_numbers } from "./files"

export async function get_codebase_files(dir: string, exclude: string[] = []) {
    const files = await get_files_in_dir(dir, exclude)
    const code = await Promise.all(files.map(async f =>
        `\`${f}\`
\`\`\`${extname(f).slice(1)}
${await read_file_with_line_numbers(join(dir, f))}
\`\`\`
`))
    return code.join(`\n`)
}