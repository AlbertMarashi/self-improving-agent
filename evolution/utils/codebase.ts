import { execSync } from "child_process"


// Clones a git repository into a directory
export async function clone_codebase(git_url: string, destination_dir: string) {
    execSync(`git clone ${git_url} ${destination_dir}`)
}

// Installs dependencies in a directory
export async function install_dependencies(directory: string) {
    execSync(`cd ${directory} && bun install`)
}

// Runs tests in a directory
export async function run_tests(directory: string) {
    execSync(`cd ${directory} && bun test`)
}