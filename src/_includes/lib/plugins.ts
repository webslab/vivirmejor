import type { IJodit } from "jodit/es2021/jodit.min.js";

export class ContentObserver {
	logic(node: Node) {
		if (node instanceof HTMLElement) {
			switch (node.nodeName) {
				case "JODIT":
					node.removeAttribute("style");
					break;

				case "VIDEO":
				case "IFRAME":
					node.setAttribute("loading", "lazy");
					node.setAttribute("decoding", "async");

					node.setAttribute("width", "100%");
					node.setAttribute("height", "auto");

					node.classList.add("article-video");
					break;

				case "IMG":
					node.setAttribute("loading", "lazy");
					node.setAttribute("decoding", "async");

					node.setAttribute("width", "100%");
					node.setAttribute("height", "auto");

					// node.classList.add("img-fluid");
					break;
				default:
					break;
			}
		}
	}

	init(jodit: IJodit) {
		jodit.events.on("afterInit", (editor: IJodit) => {
			new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.addedNodes.length) {
						mutation.addedNodes.forEach((node) => {
							this.logic(node);
						});
					}
				});
			}).observe(editor.editor, { childList: true, subtree: true });
		});
	}
}
