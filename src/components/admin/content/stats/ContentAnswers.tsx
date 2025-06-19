import { WlDatabase } from "@webslab/shared/components/database";
import { For, Show, createMemo, createSignal, onMount } from "solid-js";
import { RecordId } from "surrealdb";

import { authService } from "$lib/services/auth.ts";

type Question = {
  id: RecordId | string;
  content: string;
  type: string;
  range?: { hold: string; max: string; min: string };
  text?: { hold: string; max: string };
  answers?: string[];
};

type Answer = {
  paperId: RecordId;
  question: Question;
  content: string;
};

type Paper = {
  id: RecordId;
  answers: Answer[];
};

export default function ContentAnswers() {
  const contentId = new URLSearchParams(location.search).get("id");
  let myElement!: WlDatabase;

  // We'll maintain a flat list of Answer objects.
  const [papers, setPapers] = createSignal<Paper[]>([]);

  // Group answers by question.
  const questions = createMemo(() => {
    const groups = new Map<string, Question>();

    papers().forEach((paper) => {
      paper.answers.forEach((answer) => {
        const qId = answer.question.id.toString();

        if (!groups.has(qId)) {
          groups.set(qId, {
            ...answer.question,
            answers: [answer.content],
          });
        } else {
          groups.get(qId)!.answers!.push(answer.content);
        }
      });
    });

    return Array.from(groups.values()).sort((a, b) =>
      a.id.toString().localeCompare(b.id.toString()),
    );
  });

  onMount(() => {
    // Now the query returns the paper id along with its answers.
    customElements.whenDefined("wl-database").then(() => {
      const query = `SELECT id, answers FROM paper WHERE module = ${contentId} FETCH answers.question`;

      myElement.auth = authService;
      myElement.query = query;
    });

    myElement.addEventListener("wl-task:completed", (evt: Event) => {
      const [papers] = (evt as CustomEvent).detail.result;

      setPapers(papers);
    });

    myElement.addEventListener("wl-action:create", (evt: Event) => {
      const newPaper = (evt as CustomEvent).detail.item;
      const paperId = newPaper.id;

      const answers = newPaper.answers.map((ans: Answer) => ({
        paperId: paperId,
        question: ans.question,
        content: ans.content,
      }));

      setPapers((prevPapers) => [...prevPapers, { id: paperId, answers }]);
    });

    myElement.addEventListener("wl-action:delete", (evt: Event) => {
      const deletedPaper = (evt as CustomEvent).detail.item;
      const paperId = deletedPaper.id;

      setPapers((prevPapers) => {
        const filtered = prevPapers.filter(
          (paper) => paper.id.id !== paperId.id,
        );

        return filtered;
      });
    });

    // When an update occurs, the updated event will now return a paper with its id and updated answers.
    myElement.addEventListener("wl-action:update", (evt: Event) => {
      const updatedPaper = (evt as CustomEvent).detail.item;
      const paperId = updatedPaper.id;

      // We attach the paper id to each answer.
      const updatedAnswers: Answer[] = updatedPaper.answers.map(
        (ans: Answer) => ({
          paperId: paperId,
          question: ans.question,
          content: ans.content,
        }),
      );

      setPapers((prevPapers) => {
        const filtered = prevPapers.filter(
          (paper) => paper.id.id !== paperId.id,
        );

        return [...filtered, { id: paperId, answers: updatedAnswers }];
      });
    });
  });

  return (
    <>
      <h2 class="h3">
        <u>Cuestionarios</u>
      </h2>

      <h3 class="text-center">
        Total: <span class="fw-bold">{papers().length}</span>
      </h3>
      <hr />

      {/* Render questions with a progress bar for each */}
      <div>
        {/* sort questions by type */}
        <For each={questions().sort((a, b) => a.type.localeCompare(b.type))}>
          {(question) => {
            const min = Number(question.range?.min);
            const max = Number(question.range?.max);
            const sum =
              question.answers?.reduce((acc, curr) => acc + Number(curr), 0) ||
              0;

            // Compute the average from the grouped answers.
            // const answersNum = question.answers?.map(Number) || [];
            const avg: () => number = () => {
              if (question.type !== "range") return 0;

              return sum / (question.answers?.length || 1);
            };

            const percentage = () => ((avg() - min) / (max - min)) * 100;

            return (
              <div class="mb-3">
                <span class="d-block">{question.content}</span>

                <Show when={question.type === "range"}>
                  <div
                    class="progress"
                    style="height: 30px;"
                    role="progressbar"
                    aria-valuenow={avg()}
                    aria-valuemin={question.range?.min || 0}
                    aria-valuemax={question.range?.max || 10}
                    aria-label="Animated striped example"
                  >
                    <div
                      class="progress-bar progress-bar-striped progress-bar-animated"
                      style={{ width: `${percentage()}%` }}
                    >
                      <span class="fw-bold">{avg()!.toFixed(2)}</span>
                    </div>
                  </div>
                </Show>

                <Show when={question.type === "text"}>
                  <ul class="">
                    {question.answers!.map((answer) => {
                      return <li>{answer}</li>;
                    })}
                  </ul>
                </Show>
              </div>
            );
          }}
        </For>
      </div>

      {/* @ts-ignore */}
      <wl-database live={true} ref={myElement} target="section">
        <div>
          <section></section>
        </div>
        <template slot="template"></template>
        {/* @ts-ignore */}
      </wl-database>
    </>
  );
}
