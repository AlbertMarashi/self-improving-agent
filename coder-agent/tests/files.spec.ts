import { test } from "bun:test";
import { get_files_in_dir } from "../src/files";
import assert from "assert";

test("get_files_in_dir", async () => {
    const files = await get_files_in_dir("tests/test_files", "")
    const expected = new Set(["file.ts", "sub_folder/another_file.ts"])
    const actual = new Set(files)

    assert.deepEqual(actual, expected)
})
