

// clone the codebase 5 times

import { resolve } from "path"
import { copy_dir, delete_dir, install_dependencies } from "./utils/codebase"
import { CodebaseImprover } from "./agents/improver"


const codebase_dir = resolve(import.meta.dir, "../coder-agent")
const output_dir = resolve(import.meta.dir, "./output")
// delete_dir(output_dir)
// await setupCodebases(codebase_dir, output_dir)

const agents = Array.from({ length: 5 }).map((_, i) => new CodebaseImprover(resolve(output_dir, `codebase-${i}`)))
console.log(agents)

// install dependencies
// instantiate an agent for each codebase
// give it the goal to pass the tests in sample_codebase
// run the tests, 5x per test using 5 different seeds
//