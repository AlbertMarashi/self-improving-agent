import EventEmitter from "events"
import { openai } from "./openai"
import type { Run } from "openai/resources/beta/threads/runs/runs.mjs"
import { get_codebase_files } from "./utils/codebase"
import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"
import { EditCodeTool } from "./tools/edit_code"


export class BaseAgent extends EventEmitter {
    assistant_id = `asst_P7jhgnFlt0AFwl5NJOhaZwIC`
    instructions = `You are an expert coding agent capable of writing entire codebases, modifying code and recursively self improving.`
    tools = [
        new EditCodeTool()
    ]
    codebase_dir: string
    task: string
    thread_id: string | null = null
    run: Run | null = null
    timeout = 30 * 1000

    constructor(task: string, codebase_dir: string) {
        super()
        this.codebase_dir = codebase_dir
        this.task = task
    }

    async create_thread() {
        const response = await openai.beta.threads.create({
            messages: [
                {
                    role: `user`,
                    content: await get_codebase_files(this.codebase_dir)
                },
                {
                    role: `user`,
                    content: this.task
                }
            ]
        })

        this.thread_id = response.id
    }

    async get_thread() {
        if(!this.thread_id) {
            await this.create_thread()
        }
        return openai.beta.threads.retrieve(this.thread_id!)
    }

    async get_messages() {
        const threadedMessages = await openai.beta.threads.messages.list(this.thread_id!)

        return threadedMessages.data
    }

    get_tool(tool_name: string) {
        return this.tools.find(t => t.name === tool_name)!
    }

    async start_run() {
        if(!this.thread_id) {
            await this.create_thread()
        }
        const response = await openai.beta.threads.runs.create(this.thread_id!,
            {
                assistant_id: this.assistant_id,
                instructions: this.instructions,
                tools: this.tools.map(tool => ({ type: `function`, function: tool.to_function_definition() }))
            }
        )
        this.run = response

        this.start_polling()

        return response
    }

    private async start_polling() {
        const startTime = Date.now()

        const update_run = async () => {
            const run = await openai.beta.threads.runs.retrieve(this.thread_id!, this.run!.id)
            if (run.status === this.run!.status) return // no change
            this.run = run
            this.emit(`run:updated`, run)
            this.emit(`status:${run.status}`, run)
            if(run.status === `requires_action`) {
                await this.run_required_actions(run.required_action)
            }
        }

        const poll = async () => {
            try {
                await update_run()

                if(Date.now() - startTime < this.timeout) {
                    setTimeout(poll, 1000)
                } else {
                    this.emit(`timeout`)
                }
            } catch (error) {
                this.emit(`error`, error)
            }
        }

        poll()
    }

    until_status(status: Run[`status`]): Promise<Run> {
        return new Promise(resolve => {
            this.once(`status:${status}`, resolve)
        })
    }

    async run_required_actions(action: Run[`required_action`]) {
        if (!action) return
        const tool_outputs = []
        for (const tool_call of action.submit_tool_outputs.tool_calls) {
            const tool = this.get_tool(tool_call.function.name)

            if (!tool) {
                tool_outputs.push({ tool_call_id: tool_call.id, output: `Tool ${tool_call.function.name} not found`})
            } else {
                tool_outputs.push({ tool_call_id: tool_call.id, output: await tool.run(this, JSON.parse(tool_call.function.arguments)) })
            }
        }

        await openai.beta.threads.runs.submitToolOutputs(this.thread_id!, this.run!.id, {
            tool_outputs
        })
    }

    read_file(file: string) {
        return readFileSync(resolve(this.codebase_dir, file), `utf-8`)
    }

    write_file(file: string, content: string) {
        writeFileSync(resolve(this.codebase_dir, file), content)
    }
}
