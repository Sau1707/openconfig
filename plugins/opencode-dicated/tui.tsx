import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process"
import { createInterface } from "node:readline"
import { fileURLToPath } from "node:url"
import { Plugin } from "@opencode/plugin/tui"
import { createSignal, Show } from "solid-js"
import { parseMessage, type Status } from "./session.ts"

export default Plugin.define({
  id: "opencode-dicated",
  setup(ctx) {
    const [status, setStatus] = createSignal<Status>("idle")
    const [transcript, setTranscript] = createSignal("")
    let process: ChildProcessWithoutNullStreams | undefined
    let disposed = false
    let generation = 0
    let editor = ctx.renderer.currentFocusedEditor
    const routeKey = () => JSON.stringify(ctx.ui.router.current())
    let originKey = ""

    function toast(message: string, variant: "info" | "error" = "info") {
      if (!disposed) ctx.ui.toast.show({ title: "Dictation", message, variant })
    }

    function insert() {
      if (!transcript()) return
      const target = editor && !editor.isDestroyed ? editor : ctx.renderer.currentFocusedEditor
      if (routeKey() !== originKey || !target) {
        toast("Return to the original prompt to insert the transcript.")
        return
      }
      target.focus()
      ctx.renderer.keyInput.processPaste(new TextEncoder().encode(transcript()))
      setTranscript("")
    }

    function cancel() {
      generation++
      const child = process
      setStatus("idle")
      setTranscript("")
      if (!child) return
      child.stdin.write("cancel\n")
      child.kill("SIGTERM")
      const timer = setTimeout(() => child.kill("SIGKILL"), 6000)
      timer.unref()
      child.once("close", () => clearTimeout(timer))
    }

    function toggle() {
      if (status() === "recording") {
        process?.stdin.write("stop\n")
        setStatus("transcribing")
        return
      }
      if (status() !== "idle" || process) return
      if (transcript()) return insert()
      editor = ctx.renderer.currentFocusedEditor
      if (!editor) return toast("Focus the prompt before starting dictation.")
      const origin = ctx.ui.router.current()
      if (origin.type !== "home" && origin.type !== "session") return
      originKey = routeKey()
      const current = ++generation
      setStatus("loading")
      const child = spawn(
        typeof ctx.options.bun === "string" ? ctx.options.bun : "bun",
        [fileURLToPath(new URL("./helper.ts", import.meta.url))],
        { stdio: ["pipe", "pipe", "pipe"] },
      )
      process = child
      let completed = false
      let stderr = ""
      const active = () => !disposed && current === generation
      const lines = createInterface({ input: child.stdout })
      child.stdin.on("error", () => {})
      child.stderr.on("data", (chunk) => { stderr = (stderr + chunk.toString()).slice(-4000) })
      lines.on("line", (line) => {
        if (!active()) return
        try {
          const message = parseMessage(line)
          if (message.type === "recording") setStatus("recording")
          if (message.type === "transcribing") setStatus("transcribing")
          if (message.type === "error") {
            completed = true
            toast(message.message, "error")
          }
          if (message.type === "transcript") {
            completed = true
            setTranscript(message.text)
            if (!message.text) toast("No speech detected.")
            else if (ctx.renderer.currentFocusedEditor === editor && routeKey() === originKey) insert()
            else toast("Transcript ready. Return to the original prompt and choose Insert.")
          }
        } catch (error) {
          completed = true
          toast(error instanceof Error ? error.message : String(error), "error")
          cancel()
        }
      })
      child.once("error", (error) => {
        if (!active()) return
        completed = true
        toast(error.message, "error")
      })
      child.once("close", () => {
        lines.close()
        if (process === child) process = undefined
        if (!active()) return
        setStatus("idle")
        if (!completed) toast(stderr.trim() || "Dictation helper exited unexpectedly.", "error")
      })
    }

    ctx.keymap.layer(() => ({
      mode: "global",
      commands: [
        {
          id: "opencode-dicated.toggle", title: "Dictation: record / stop / insert",
          group: "Dictation", palette: true, slash: { name: "dictate" },
          bind: typeof ctx.options.shortcut === "string" ? ctx.options.shortcut : "ctrl+alt+d",
          run: toggle,
        },
        {
          id: "opencode-dicated.cancel", title: "Dictation: cancel / discard",
          group: "Dictation", palette: true, slash: { name: "dictate-cancel" },
          run: cancel,
        },
      ],
      bindings: ["opencode-dicated.toggle"],
    }))
    ctx.ui.slot({
      append: "prompt.footer.status",
      render: () => (
        <box flexDirection="row" gap={1}>
          <text fg={ctx.theme.text.base} onMouseDown={toggle}>
            {status() === "loading" ? "[Dictation: loading…]"
              : status() === "recording" ? "[Stop recording]"
              : status() === "transcribing" ? "[Transcribing…]"
              : transcript() ? "[Insert transcript]" : "[Record]"}
          </text>
          <Show when={status() !== "idle" || transcript()}>
            <text fg={ctx.theme.text.base} onMouseDown={cancel}>[Cancel]</text>
          </Show>
        </box>
      ),
    })
    return () => {
      disposed = true
      cancel()
    }
  },
})
