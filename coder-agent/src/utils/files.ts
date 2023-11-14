import { readFile, readdir, stat } from "fs/promises"
import { resolve, relative } from "path"

export async function get_files_in_dir(root: string, exclude: string[]): Promise<string[]> {
    const dirsToProcess = [root]
    const allFiles = []

    while (dirsToProcess.length > 0) {
        const currentDir = dirsToProcess.shift()!
        const files = await readdir(currentDir)

        for (const file of files) {
            const fullPath = resolve(currentDir, file)
            const relativePath = relative(root, fullPath)
            const stats = await stat(fullPath)

            // Skip files or directories in the exclude list
            if (exclude.includes(fullPath) || exclude.includes(file)) {
                continue
            }

            if (stats.isDirectory()) {
                dirsToProcess.push(fullPath)
            } else {
                allFiles.push(relativePath)
            }
        }
    }

    return allFiles
}

// Function to read a file
export async function read_file(file: string): Promise<string> {
    return readFile(file, "utf-8")
}

// Read file with line numbers prefixed
export async function read_file_with_line_numbers(file: string): Promise<string> {
    const contents = await read_file(file)
    const lines = contents.split("\n")
    return lines.map((line, i) => `${i + 1}: ${line}`).join("\n")
}