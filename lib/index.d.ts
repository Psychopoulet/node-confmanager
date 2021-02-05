/// <reference types="node" />

declare module "node-confmanager" {

	import Container = require("node-containerpattern");

	class ConfManager extends Container {

		public filePath: string;
		public spaces: boolean;
		public shortcuts: Array<string>;

		constructor(filePath?: string, spaces?: boolean, recursionSeparator?: string);

		protected _loadFromConsole(): Promise<void>;

		public shortcut(key: string, shortkey: string): ConfManager;
		public clearShortcuts(): ConfManager;
		public clear(): ConfManager;
		public deleteFile(): Promise<void>;
		public get(key: string): any;
		public fileExists(): Promise<boolean>;
		public load(): Promise<void>;
		public save(): Promise<void>;

	}

	export = ConfManager;

}
