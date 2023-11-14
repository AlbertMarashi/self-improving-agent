import EventEmitter from "events"
import { openai } from "./openai"
import { edit_code_function } from "./tools/edit_code"


export class BaseAgent extends EventEmitter {
    assistant_id = "asst_P7jhgnFlt0AFwl5NJOhaZwIC"
    instructions = "You are an expert coding agent capable of writing entire codebases, modifying code and recursively self improving."
    tools = [
        edit_code_function
    ]
    codebase_dir: string
    task: string
    thread_id: string | null = null
    run_id: string | null = null

    constructor(task: string, codebase_dir: string) {
        super()
        this.codebase_dir = codebase_dir
        this.task = task
    }

    async create_thread() {
        const response = await openai.beta.threads.create({
            messages: [
                {
                    role: "user",
                    content: this.task
                }
            ]
        })

        this.thread_id = response.id
    }

    async start_run() {
        const response = await openai.beta.threads.runs.create(this.thread_id!,
            {
                assistant_id: this.assistant_id,
                instructions: this.instructions,
                tools: this.tools.map(tool => ({ type: "function", function: tool }))
            }
        )
        this.run_id = response.id



        return response
    }

    await_run_event(event: string) {
        return new Promise(resolve => {
            this.once(event, resolve)
        })
    }

}
