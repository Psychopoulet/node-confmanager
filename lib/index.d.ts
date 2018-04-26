/// <reference types="node" />

declare module "node-confmanager" {

	class ConfManager {

		protected _filePath: string;
		protected _spaces: boolean;
		protected _shortcuts: Array<string>;

		constructor(filePath?: string, spaces?: boolean, recursionSeparator?: string);

		protected _loadFromConsole(): Promise<void>;

		public shortcut(key: string, shortkey: string): ConfManager;
		public clearShortcuts(): ConfManager;
		public clear(): ConfManager;
		public deleteFile(): Promise<void>;
		public get(): any;
		public fileExists(): Promise<boolean>;
		public load(): Promise<void>;
		public save(): Promise<void>;

	}

	export = ConfManager;

}
