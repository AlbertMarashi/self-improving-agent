import { test } from "bun:test"
import { get_files_in_dir, read_file_with_line_numbers } from "../../src/utils/files"
import assert from "assert"
import { resolve } from "path"
import { get_codebase_files } from "../../src/utils/codebase"

const current_dir = import.meta.dir
const test_files_dir = resolve(current_dir, "test_files")

test("get_files_in_dir", async () => {
    const files = await get_files_in_dir(test_files_dir, ["ignore_folder"])
    const expected = new Set(["file.ts", "sub_folder/another_file.ts"])
    const actual = new Set(files)

    assert.deepStrictEqual(actual, expected)
})

test("read_file_with_line_numbers", async () => {
    const actual = await read_file_with_line_numbers(resolve(test_files_dir, "file.ts"))
    const expected = `1: const a = 1
2: const b = 2`
    assert.strictEqual(actual, expected)
})

test("get_codebase_files", async () => {
    console.log(await get_codebase_files(import.meta.dir))
})