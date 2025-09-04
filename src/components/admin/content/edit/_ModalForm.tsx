import { useStore } from "@nanostores/solid";
import { $question } from "$lib/services/questions.ts";
import { createSignal, onMount, Show } from "solid-js";
import type { Question } from "$lib/types.ts";

type FormProps = {
  formId: string;
  modalId: string;
};

type QuestionType = "text" | "range";

const isTextQuestion = (
  question: Question,
): question is Question & { type: "text" } => {
  return question.type === "text";
};

const isRangeQuestion = (
  question: Question,
): question is Question & { type: "range" } => {
  return question.type === "range";
};

const getQuestionConfig = (q: Question) => {
  if (isTextQuestion(q)) return q.text;
  if (isRangeQuestion(q)) return q.range;
  return undefined;
};

export default function Form(props: FormProps) {
  const question = useStore($question);
  const [type, setType] = createSignal<QuestionType>(
    question().type as QuestionType,
  );

  const max = () => getQuestionConfig(question())?.max;
  const min = () => {
    const q = question();
    if (isRangeQuestion(q) && q.range) {
      return q.range.min;
    }
    return undefined;
  };

  const hold = () => getQuestionConfig(question())?.hold;
  const holdType = () => {
    if (type() === "text") return "text";
    if (question().type === "text") return "text";

    return "number";
  };

  onMount(() => {
    console.log(props.modalId);
    console.log(props.formId);
  });

  const changeType = (e: Event) => {
    setType((e.target as HTMLInputElement).value as QuestionType);
  };

  return (
    <>
      <input type="hidden" name="id" value={question().id?.toString()} />

      <fieldset class="mb-3">
        <legend class="text-center">Type</legend>

        <div class="d-flex justify-content-evenly">
          <label>
            <input
              onChange={changeType}
              checked={question().type === "text"}
              class="me-2 form-check-input"
              type="radio"
              name="type"
              value="text"
            />
            Text
          </label>

          <label class="form-check-label">
            <input
              onChange={changeType}
              checked={question().type === "range"}
              class="me-2 form-check-input"
              type="radio"
              name="type"
              value="range"
            />
            Range
          </label>
        </div>
      </fieldset>

      <fieldset class="mb-3">
        <legend>Content</legend>

        <input
          class="w-100 form-control"
          type="text"
          name="content"
          value={question().content}
        />
      </fieldset>

      <fieldset class="mb-3">
        <legend>Allowed Values</legend>

        <div class="row">
          <label class="col-6">
            Min
            <input
              class="d-block form-control"
              type="number"
              name="min"
              disabled={
                question().type === "text" &&
                (type() === undefined || type() === "text")
                // TODO: ??
              }
              value={min()}
            />
          </label>

          <label class="col-6">
            Max
            <input
              class="d-block form-control"
              type="number"
              name="max"
              value={max()}
            />
          </label>

          <label class="col-12 mt-2">
            Hold
            <input
              class="d-block form-control"
              type={holdType()}
              name="hold"
              value={hold()}
            />
          </label>
        </div>
      </fieldset>

      <Show
        when={
          question().type === "range" &&
          (type() === undefined || type() === "range")
        }
      >
        <fieldset class="mb-3">
          <legend>Spelled</legend>

          <div></div>
        </fieldset>
      </Show>
    </>
  );
}
