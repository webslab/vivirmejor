import { createSignal, createEffect, onMount } from "solid-js";
import { PaperService } from "@webslab/shared/services";
import { authService } from "../../../_includes/lib/auth.ts";
import type { Module } from "../../../_includes/lib/types.ts";

const slug = new URLSearchParams(location.search).get("slug");
const article = document.querySelector("#article");

export default function Pagination() {
  const [page, setPage] = createSignal(1);
  const [pages, setPages] = createSignal([""]);
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

    setPages(module_.content);
    setPaperSvc(new PaperService(module_, authService));
  });

  const prev = () => {
    if (page() === 1) return;
    if (paperSvc()) paperSvc()!.prev(page());

    setPage(page() - 1);
    location.hash = `#post-title`;
  };

  const next = () => {
    if (page() === pages().length) return;
    if (paperSvc()) paperSvc()!.next(page());

    setPage(page() + 1);
    location.hash = `#post-title`;
  };

  const submit = async () => {
    try {
      await paperSvc()!.submit(page());
    } catch (error) {
      console.error(error);
    }

    location.href = `/content/modules/`;
  };

  return (
    <div
      class={pages().length === 1 ? "d-none" : "d-flex justify-content-around"}
    >
      <button onClick={prev} disabled={page() === 1} class="btn btn-primary">
        Prev
      </button>

      <div>
        {page()}/{pages().length}
      </div>

      <button
        onClick={submit}
        class={page() === pages().length ? "btn btn-primary" : "d-none"}
      >
        Send
      </button>

      <button
        onClick={next}
        class={page() === pages().length ? "d-none" : "btn btn-primary"}
      >
        Next
      </button>
    </div>
  );
}
