import { exec, execSync } from "child_process"
import { copyFile, exists, mkdir, readdir } from "fs/promises"
import { promisify } from "util"
import { join, resolve } from "path"
const execPromise = promisify(exec)


// Clones a source folder into a destination folder
// Excludes paths in the exclude list
export async function copy_dir(source: string, destination: string, exclude: string[]) {
    if (!await exists(destination)) {
        await mkdir(destination, { recursive: true })
    }

    // Read the contents of the source directory

    const entries = await readdir(source, { withFileTypes: true })

    // Iterate over the directory entries
    const promises = entries.map(async entry => {
        const srcPath = join(source, entry.name)
        const destPath = join(destination, entry.name)

        if (exclude.includes(entry.name)) {
            return
        }

        // Copy the directories and files recursively
        if (entry.isDirectory()) {
            await copy_dir(srcPath, destPath, exclude)
        } else {
            await copyFile(srcPath, destPath)
        }
    })

    await Promise.all(promises)
}

// Deletes a directory
export function delete_dir(directory: string) {
    execSync(`rm -rf ${directory}`)
}

// Installs dependencies in a directory
export async function install_dependencies(directory: string) {
    await execPromise(`cd ${directory} && bun install`)
}

// Runs tests in a directory
export async function run_tests(directory: string) {
    await execPromise(`cd ${directory} && bun test`)
}

export async function setupCodebases(codebase_dir: string, output_dir: string) {
    const codebase_promises = []
    for (let i = 0; i < 5; i++) {
        const codebase_name = `codebase-${i}`
        const codebase_promise = setupCodebase(codebase_dir, output_dir, codebase_name)
        codebase_promises.push(codebase_promise)
    }
    return Promise.all(codebase_promises)
}


export async function setupCodebase(codebase_dir: string, output_dir: string, codebase_name: string) {
    console.log(`Setting up codebase ${codebase_name}`)
    const output_codebase_dir = resolve(output_dir, codebase_name)
    await copy_dir(codebase_dir, output_codebase_dir, ["node_modules"])
    await install_dependencies(output_codebase_dir)
    console.log(`Finished setting up codebase ${codebase_name}`)
}