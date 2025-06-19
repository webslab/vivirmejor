import Modal from "bootstrap/js/dist/modal";
import { map } from "nanostores";

import { QuestionService as _QuestionService } from "@webslab/shared/services";

import type { Question } from "$lib/types.ts";
import type Surreal from "surrealdb";

export const $question = map<Question>();

export class QuestionService extends _QuestionService {
	modal: Modal;

	constructor(db: Surreal, modalId: string) {
		super(db);
		this.modal = new Modal(document.getElementById(modalId));
	}

	public edit(question: Question): Promise<Question | void> {
		$question.set(question);

		return new Promise<Question | void>((resolve) => {
			const handleResult = async (evt: Event) => {
				this.modal.hide();

				evt.target?.removeEventListener("result.bs.modal", handleResult);

				if (evt instanceof CustomEvent) {
					if (!evt.detail) return resolve();

					return resolve(await this.updateCreate(evt.detail.question));
				}

				return resolve();
			};

			this.modal.show();

			// cleanup: order matters
			this.modal._element.addEventListener("hide.bs.modal", (evt: Event) => {
				evt.target?.removeEventListener("result.bs.modal", handleResult);
			});

			// listen for modal submit
			this.modal._element.addEventListener("result.bs.modal", handleResult);
		});
	}
}
