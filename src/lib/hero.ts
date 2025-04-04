import { Jodit } from "jodit/es2021/jodit.min.js";
import { editor } from "$lib/services/editor.ts";
import { WEBSLAB_SITE } from "$lib/consts.ts";

type Images = { baseUrl: string; files: string[]; type: "image"[] };

const heroPreview = document.getElementById("hero-preview") as HTMLImageElement;
const heroPicker = document.getElementById("hero-picker") as HTMLButtonElement;
const hero = document.getElementById("hero") as HTMLInputElement;

const fb = new Jodit.modules.FileBrowser({
	// @ts-ignore-start: NOTE:
	theme: editor.getOptions().theme,
	// @ts-ignore-start: NOTE:
	uploader: editor.getOptions().uploader,
	// @ts-ignore-start: NOTE:
	...editor.getOptions().filebrowser,
});

heroPicker.addEventListener("click", () => {
	const origin = WEBSLAB_SITE;

	fb.open((images: Images) => {
		if (images.files.length === 1) {
			hero.value = images.baseUrl || origin + images.files[0];
			heroPreview.src = images.baseUrl || origin + images.files[0];

			return;
		}

		alert("Please select an image from the list.");
	}, true);
});
