/// <reference types="node" />

declare module "node-confmanager" {

	import Container = require("node-containerpattern");

	class ConfManager extends Container {

		public filePath: string; // conf file
		public spaces: boolean; // formate file
		public shortcuts: Array<string>; // for container

		constructor(filePath?: string, spaces?: boolean, recursionSeparator?: string);

		protected _loadFromConsole(): Promise<void>;

		// public clear(): void; // Container.clear & clearShortcuts
		public clearShortcuts(): this; // forget all the shortcuts
		public deleteFile(): Promise<void>; // delete the conf file
		public fileExists(): Promise<boolean>; // check if the conf file exists
		// public get(key: string): any; // Container.get with cloned data
		public load(): Promise<void>; // load data from conf file then commandline (commandline takeover)
		public save(): Promise<void>; // save data into conf file
		public shortcut(key: string, shortkey: string): this; // bind a shortcut for commandline

	}

	export = ConfManager;

}
