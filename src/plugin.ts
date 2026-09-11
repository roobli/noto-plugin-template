/**
 * Minimal trusted-renderer plugin.
 *
 * Wire this into Noto via resources/plugins + bundled hosts (see README).
 * The types below are illustrative; in-tree plugins import from Noto's shared
 * plugin contracts.
 */

export type Disposer = () => void;

export interface NotoEditorPort {
  getMarkdown(): string;
  replaceMarkdown(markdown: string): boolean;
  setSemanticFocus(enabled: boolean): void;
}

export interface TrustedPluginContext {
  readonly pluginId: string;
  readonly settings: Readonly<Record<string, boolean>>;
  readonly signal: AbortSignal;
  readonly port: NotoEditorPort;
  registerCommand(id: string, execute: () => void | Promise<void>): Disposer;
  registerHotkey(keys: string, execute: () => void | Promise<void>): Disposer;
  registerDisposer(disposer: Disposer): void;
  notice(message: string): void;
}

export class HelloPlugin {
  activate(ctx: TrustedPluginContext): Disposer {
    const ping = () => {
      const chars = ctx.port.getMarkdown().length;
      const loud = ctx.settings.loud === true;
      ctx.notice(loud ? `Hello Noto — ${chars} characters in the note.` : 'Hello Noto.');
    };
    ctx.registerCommand('hello.ping', ping);
    ctx.registerHotkey('Mod+Shift+H', ping);
    return () => { /* command/hotkey disposers registered with the host */ };
  }
}
