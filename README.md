# Noto plugin template

Scaffold for writing a **trusted-renderer** plugin for [Noto](https://github.com/roobli/Noto).

> **Today:** plugins ship **inside** the Noto application. There is no user plugins folder or third-party install flow yet — a plugin is a pull request against `roobli/Noto`. A sandboxed runtime for untrusted packages exists in tree but is not launched. This template mirrors the shape you will use once install opens, and the shape bundled plugins already use.

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
| Bundled in app (`resources/plugins`) | **Current** |
| User plugins folder + package digest + install UI | [Later](https://roobli.github.io/Noto.docs/direction/roadmap#later), after `0.1.0` and the *Next* horizon |
| Experimental isolated runtime (separate origin/session/CSP) | Built, not launched |

Until install opens, treat this template as documentation-plus-scaffold for contributors.

## License

MIT — same freedom for example code you publish from this template. Noto itself is AGPL-3.0-only; contributions to Noto follow that project’s license.
