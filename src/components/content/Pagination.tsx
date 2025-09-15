import { createSignal, createEffect, onMount } from "solid-js";
import { PaperService } from "@webslab/shared/services";

import { authService } from "$lib/services/auth.ts";
import type { Module } from "$lib/types.ts";

type Answer = { question: string; content: string };

const slug = new URLSearchParams(location.search).get("slug");
const article = document.querySelector("#article");

export default function Pagination() {
  const [page, setPage] = createSignal(1);
  const [pages, setPages] = createSignal([""]);
  const [answers, setAnswers] = createSignal<Answer[]>([]);
  const [paperSvc, setPaperSvc] = createSignal<PaperService>();

  createEffect(() => {
    if (!article) return;

    article.innerHTML = pages()[page() - 1];
  });

  onMount(async () => {
    await authService.isReady;

    const db = authService.getDb();
    const [[module_]]: Module[][] = await db.query(
      "SELECT * FROM module WHERE slug IS $slug;",
      { slug },
    );

    setPages(module_.content!);
    setPaperSvc(new PaperService(module_, authService));
  });

  function findAnswers(): boolean {
    const wlQuestions = article!.querySelectorAll("wl-question");

    if (wlQuestions.length === 0) return true;

    // Use the new simplified API from @webslab/shared v0.5.0
    const allValid = Array.from(wlQuestions).every((question: any) =>
      question.isValid(),
    );

    if (!allValid) {
      alert("Please fill all the questions");
      return false;
    }

    // Update answers for each question
    wlQuestions.forEach((question) => {
      const qid = question.getAttribute("qid")!;
      const input = question.children[1] as HTMLInputElement;

      setAnswers((prev) => {
        const filtered = prev.filter((answer) => answer.question !== qid);
        return [...filtered, { question: qid, content: input.value }];
      });
    });

    return true;
  }

  const prev = () => {
    if (page() === 1) return;
    if (paperSvc()) paperSvc()!.prev(page());
    if (!findAnswers()) return;

    setPage(page() - 1);

    // Scroll suave al inicio de la página
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const next = () => {
    if (page() === pages().length) return;
    if (paperSvc()) paperSvc()!.next(page());
    if (!findAnswers()) return;

    setPage(page() + 1);

    // Scroll suave al inicio de la página
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const submit = async () => {
    if (!findAnswers()) return;

    try {
      await paperSvc()!.submit(page(), answers());
    } catch (error) {
      console.error(error);
    }

    location.href = `/content/modules/`;
  };

  return (
    <div
      class={pages().length === 1 ? "d-none" : "d-flex justify-content-around"}
    >
      <button
        type="button"
        onClick={prev}
        disabled={page() === 1}
        class="btn btn-primary"
      >
        Anterior
      </button>

      <div>
        {page()}/{pages().length}
      </div>

      <button
        type="submit"
        onClick={submit}
        class={page() === pages().length ? "btn btn-primary" : "d-none"}
      >
        Enviar
      </button>

      <button
        type="button"
        onClick={next}
        class={page() === pages().length ? "d-none" : "btn btn-primary"}
      >
        Siguiente
      </button>
    </div>
  );
}
