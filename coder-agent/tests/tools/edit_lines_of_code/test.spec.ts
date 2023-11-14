import { expect, test } from "bun:test"
import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"
import { BaseAgent } from "../../../src/agent"

test(`can_edit_lines_of_code`, async () => {
    writeFileSync(resolve(import.meta.dir, `output/file.ts`), ``)
    const agent = new BaseAgent(`Write Hello world into this file`, import.meta.dir)
    await agent.start_run()
    await agent.until_status(`completed`)
    const actual = readFileSync(resolve(import.meta.dir, `output/file.ts`), `utf-8`)
    expect(actual).toStrictEqual(`Hello world`)
}, { timeout: 30 * 1000 })