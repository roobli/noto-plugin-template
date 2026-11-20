# Noto plugin template

Scaffold for writing a **trusted-renderer** plugin for [Noto](https://github.com/roobli/Noto).

> **Today:** since Noto 0.0.4, Plugin Center installs plugins from a folder, from a GitHub repository or from a marketplace ([`roobli/noto-plugins`](https://github.com/roobli/noto-plugins) by default), and runs them sandboxed in a Web Worker with no page, no app API and no network unless the reader trusts one fully. This template scaffolds the other shape: a bundled trusted-renderer plugin that ships inside the app and is added to `roobli/Noto` by pull request. For a plugin people install themselves, start from the `"runtime": "sandboxed"` manifest and the `reading-time` example in `roobli/noto-plugins`.

## Quick start

1. Copy this repo (or use it as a GitHub template).
2. Edit `manifest.json`: change `id`, `name`, commands, and hotkeys.
3. Implement `src/plugin.ts` against `TrustedPluginContext` (see below).
4. Open a PR to `roobli/Noto` that:
   - adds `resources/plugins/<id>/manifest.json`
   - mirrors the manifest in `src/shared/plugins/proof-manifests.ts`
   - registers a host in `src/renderer/plugins/bundled/`
   - adds a one-line description in `PluginCenter`

Full guide: [Writing a plugin](https://github.com/roobli/Noto/blob/main/docs/plugins.md) in the Noto repository, and [Plugins](https://roobli.github.io/Noto.docs/guide/plugins) on the docs site.

## Manifest (schema v2)

Every field is required; nothing else is allowed. See `manifest.json` in this repo for a minimal editor plugin.

Rules worth remembering:

- `id` — dotted lowercase
- Capabilities are runtime-scoped: renderer may use `editor.read` / `editor.decorate` / `editor.transform`; service may use `filesystem.read` only
- Lifecycle is `["activate","deactivate"]` (renderer) or `["start","stop"]` (service)
- Settings are **booleans with defaults** only (for now)
- Hotkeys: `Mod`/`Ctrl`/`Alt`/`Shift` + one key; `Mod` is ⌘ on macOS and Ctrl elsewhere

## APIs a renderer plugin may use

```ts
interface TrustedPluginContext {
  readonly pluginId: string;
  readonly settings: Readonly<Record<string, boolean>>;
  readonly signal: AbortSignal;
  readonly port: NotoEditorPort;
  registerCommand(id: string, execute: () => void | Promise<void>): Disposer;
  registerHotkey(keys: string, execute: () => void | Promise<void>): Disposer;
  registerDisposer(disposer: Disposer): void;
  notice(message: string): void; // status line, brief
}

interface NotoEditorPort {
  getMarkdown(): string;                       // editor.read
  replaceMarkdown(markdown: string): boolean;  // editor.transform — one undo step
  setSemanticFocus(enabled: boolean): void;    // editor.decorate
}
```

Undeclared capabilities and undeclared commands/hotkeys are refused by the host.

## Upload / install story (roadmap)

| Stage | Status |
| --- | --- |
| Bundled in app (`resources/plugins`), trusted renderer | Shipped; what this template scaffolds |
| Install from a folder, GitHub or a marketplace, with a pinned digest | Shipped in 0.0.4 |
| Sandboxed runtime (Web Worker, no page, no app API, no network) | Shipped in 0.0.4; the default for installed plugins |

Installed plugins use the `"runtime": "sandboxed"` manifest described in [Writing a plugin](https://github.com/roobli/Noto/blob/main/docs/plugins.md); this template does not yet carry a sandboxed example.

## License

MIT — same freedom for example code you publish from this template. Noto itself is AGPL-3.0-only; contributions to Noto follow that project’s license.
