# opencode-dicated

Local Linux voice dictation for the OpenCode terminal UI. No desktop or browser integration.

## Requirements

- OpenCode V2 with the TUI plugin API (`@opencode/plugin` 2.2.1).
- Bun 1.4.3 or newer on `PATH`.
- Ubuntu/Debian Linux, x64 or arm64, with a working PipeWire microphone.
- `pw-record` (Ubuntu package `pipewire-bin`), `wpctl` (`wireplumber`), and `unzip`.

The first recording downloads the Whistle model (~17 MB) and compatible native engine from pinned Hugging Face revisions. The model's SHA-256 is verified. Assets are cached under `${XDG_CACHE_HOME:-~/.cache}/opencode-dicated`. After setup, transcription runs locally without uploading audio. Audio stays in memory and is limited to 30 seconds. The native engine must be compatible with the system's libc and CPU.

## Install

Keep this folder under your OpenCode configuration's `plugins/` directory. Add the following entry to the global `cli.json` (merge with existing plugins):

```json
{
  "plugins": ["./plugins/opencode-dicated"]
}
```

This is a TUI-only package: do not add it to `opencode.json`. It runs on the terminal machine, even when connected to a remote server. No dependency install or build is required to run it; OpenCode supplies the TUI modules.

Optional configuration:

```json
{
  "plugins": [
    {
      "package": "./plugins/opencode-dicated",
      "options": { "shortcut": "ctrl+alt+d", "bun": "bun" }
    }
  ]
}
```

## Use

Focus the prompt and click **Record**, press **Ctrl+Alt+D**, or invoke `/dictate`. Click **Stop recording** or use the shortcut again to transcribe. Recording also stops after 30 seconds. **Cancel** or `/dictate-cancel` discards the recording or pending transcript.

The transcript is pasted into the original prompt only if it still has focus. Otherwise, return to that prompt and click **Insert transcript** or use the shortcut. Existing prompt text is preserved. Nothing is automatically submitted, and the clipboard is not used.

The default system audio output is muted while recording; the microphone stays active. Its previous mute state is restored when recording stops, is cancelled, or fails, before transcription starts. Volume levels are unchanged. If muting fails, recording does not start. Force-killing the helper can prevent restoration.

## Development

```sh
bun install
bun run typecheck
bun test
```

Automated checks do not replace a live microphone and TUI smoke test.

## Credits

The native Whistle integration and PCM recording approach are adapted from [Uncode](https://github.com/xLongLink/uncode), Copyright LongLink 2026, Apache-2.0. See `LICENSE`.

Whistle is provided by [Cactus Compute](https://huggingface.co/Cactus-Compute/whistle), Apache-2.0. Model revision: `ca5287601bef25af26dcf2e1b2bdc0843a7c19e5`; engine revision: `93e88ede867e4311c39151285e74df513e4b835b`. Downloaded model and engine artifacts remain subject to their upstream licenses.
