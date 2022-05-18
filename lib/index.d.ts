declare module "node-confmanager" {

	type tType = "array" | "boolean" | "color" | "email" | "float" | "ipv4" | "ipv6" | "integer" | "object" | "string" | "url";

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

		// rewrite to force proper return
		public clear(): ConfManager;
		public clearData(): ConfManager;
		public clearDocumentations(): ConfManager;
		public clearLimits(): ConfManager;
		public clearMinsMaxs(): ConfManager;
		public clearRegexs(): ConfManager;
		public clearSkeletons(): ConfManager;
		public delete(key: string): ConfManager;
		public document(key: string, value: string): ConfManager;
		public limit(key: string, limit: Array<any>): ConfManager;
		public min(key: string, min: number): ConfManager;
		public max(key: string, max: number): ConfManager;
		public regex(key: string, regex: RegExp): ConfManager;
		public set(key: string, value: any): ConfManager;
		public skeleton(key: string, value: tType): ConfManager;

	}

	export = ConfManager;

}
