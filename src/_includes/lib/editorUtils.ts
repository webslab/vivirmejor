// import 'jodit/esm/plugins/index.js';
import "jodit/esm/plugins/hr/hr.js";
// import 'jodit/esm/plugins/iframe/iframe.js'; // ??
import "jodit/esm/plugins/video/video.js";
import "jodit/esm/plugins/source/source.js";
// import "jodit/esm/plugins/mobile/mobile.js";
import "jodit/esm/plugins/preview/preview.js";
import "jodit/esm/plugins/resizer/resizer.js";
import "jodit/esm/plugins/justify/justify.js";
import "jodit/esm/plugins/fullsize/fullsize.js";
import "jodit/esm/plugins/class-span/class-span.js";
// import 'jodit/esm/plugins/format-block/format-block.js'; // ??
import "jodit/esm/plugins/add-new-line/add-new-line.js";

import { Jodit } from "jodit/esm/index.js";
export { Jodit };

export function waitElement<T>(selector: string): Promise<T> {
	return new Promise((resolve, _reject) => {
		setInterval(() => {
			const el = document.querySelector(selector);

			if (el) {
				clearInterval(1);
				resolve(el as T);
			}
		}, 10);
	});
}

export function joditInit(selector: HTMLElement): Jodit {
	const theme = "dark";
	const language = navigator.language || "en";

	const config = {
		theme,
		height: 550,
		minHeight: 400,
		language,
		// disablePlugins: ['color', 'font', 'about', ''],
		disablePlugins: ["color", "font", "about", "mobile"],

		// buttons: [
		//   'source', '|',
		//   'bold', 'strikethrough', 'underline', 'italic', '|',
		// ],

		// showGutter: true,
		// mode: 'ace/mode/html',
		// wrap: true,
		beautifyHTML: false,
		// highlightActiveLine: true,

		// buttons: 'source,|,bold,strikethrough,underline,italic,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,paragraph,|,image,video,table,link,|,align,undo,redo,\n,selectall,cut,copy,paste,copyformat,|,hr,symbol,fullsize,print,about',

		controls: {
			classSpan: {
				list: {
					"text-blue": "Blue",
					"text-danger": "Danger",
					"text-warning": "Warning",
				},
			},
		},
	};

	return Jodit.make(selector, config);
}
