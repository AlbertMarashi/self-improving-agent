import { readFile, readdir, stat } from "fs/promises"
import { resolve, join } from "path"

// Function to get all files in a directory
export async function get_files_in_dir(root: string, dir: string): Promise<string[]> {
    const resolved = resolve(root, dir)
    const files = await readdir(resolved)

    // Use Promise.all to handle all promises concurrently
    const filePaths = await Promise.all(files.map(async file => {
        const fullPath = join(resolved, file)
        const stats = await stat(fullPath)

        if (stats.isDirectory()) {
            // Recursive call if directory
            return get_files_in_dir(root, file)
        } else {
            // Return file path if file
            return join(dir, file)
        }
    }))

    // Flatten the array and filter out undefined values
    return filePaths.flat().filter(Boolean)
}

// Function to read a file
export async function read_file(file: string): Promise<string> {
    return readFile(file, "utf-8")
}