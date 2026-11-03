/**
 * OPX runtime — player loop, scheduler, counter ticker.
 *
 * The Transcript island server-renders the chrome + every step beat in
 * its "pending" state. This module flips beats from pending → active →
 * done on the schedule encoded in `meta` + each step's `timing`.
 *
 * Key constants (per spec):
 */
export const RUNTIME_CONSTANTS = {
  TYPING_CHARS_PER_SEC: 22,
  CURSOR_BLINK_MS: 700,
  COUNTER_TICK_MS: 60,
  CROSSFADE_MS: 600,
  PIP_DEBOUNCE_MS: 150,
  MIN_HOLD_MS: 800,
  MIN_MS_PER_CHAR: 14,
} as const;

import type { OpxScript, OpxStep } from "../../lib/opx";

type CancelToken = { cancelled: boolean };

function isReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function waitMs(ms: number, token: CancelToken): Promise<void> {
  if (ms <= 0 || token.cancelled) return Promise.resolve();
  return new Promise((resolve) => {
    const id = setTimeout(resolve, ms);
    const watch = setInterval(() => {
      if (token.cancelled) {
        clearTimeout(id);
        clearInterval(watch);
        resolve();
      }
    }, 50);
  });
}

export interface MountOptions {
  /** When true, listen for `opx:play` events (carousel-driven mode). */
  carouselMode?: boolean;
}

export function mountTranscript(
  root: HTMLElement,
  script: OpxScript,
  opts: MountOptions = {},
): { play: () => void; cancel: () => void; reset: () => void } {
  const reduced = isReducedMotion();
  let iteration = 0;
  let token: CancelToken = { cancelled: false };

  const stepEls = Array.from(
    root.querySelectorAll<HTMLElement>("[data-opx-step]"),
  );
  const composerBody = root.querySelector<HTMLElement>("[data-opx-composer-body]");
  const composerPlaceholder = composerBody?.textContent ?? "";
  const counterEls = {
    taskDone: root.querySelector<HTMLElement>("[data-opx-counter='task-done']"),
    taskTotal: root.querySelector<HTMLElement>("[data-opx-counter='task-total']"),
    files: root.querySelector<HTMLElement>("[data-opx-counter='files']"),
    added: root.querySelector<HTMLElement>("[data-opx-counter='added']"),
    removed: root.querySelector<HTMLElement>("[data-opx-counter='removed']"),
  };

  function resetCounters() {
    if (counterEls.taskDone) counterEls.taskDone.textContent = "0";
    if (counterEls.files) counterEls.files.textContent = "0";
    if (counterEls.added) counterEls.added.textContent = "+0";
    if (counterEls.removed) counterEls.removed.textContent = "-0";
    if (counterEls.taskTotal) {
      counterEls.taskTotal.textContent = String(script.meta.task.progress[1]);
    }
  }

  function reset() {
    for (const el of stepEls) {
      el.setAttribute("data-opx-state", "pending");
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
    }
    // Rewind the stream so the next play starts from the top, not
    // wherever the previous play left the scroll position.
    const stream = root.querySelector<HTMLElement>("[data-opx-stream]");
    if (stream) stream.scrollTop = 0;
    if (composerBody) composerBody.textContent = composerPlaceholder;
    resetCounters();
  }

  function applyAdvances(step: OpxStep) {
    const a = step.advances;
    if (!a) return;
    if (counterEls.taskDone && a.task) {
      counterEls.taskDone.textContent = String(
        Number(counterEls.taskDone.textContent || 0) + a.task,
      );
    }
    if (counterEls.files && a.files) {
      counterEls.files.textContent = String(
        Number(counterEls.files.textContent || 0) + a.files,
      );
    }
    if (counterEls.added && a.added) {
      const cur = Number((counterEls.added.textContent || "0").replace("+", "")) || 0;
      counterEls.added.textContent = `+${cur + a.added}`;
    }
    if (counterEls.removed && a.removed) {
      const cur = Number((counterEls.removed.textContent || "0").replace("-", "")) || 0;
      counterEls.removed.textContent = `-${cur + a.removed}`;
    }
  }

  async function typeIntoComposer(text: string, durationMs: number) {
    if (!composerBody) return;
    composerBody.textContent = "";
    const total = text.length;
    if (total === 0) return;
    const minMs = total * RUNTIME_CONSTANTS.MIN_MS_PER_CHAR;
    const effective = Math.max(minMs, durationMs);
    const perChar = effective / total;
    for (let i = 0; i < total; i++) {
      if (token.cancelled) return;
      composerBody.textContent = text.slice(0, i + 1);
      await waitMs(perChar, token);
    }
  }

  async function revealStep(stepEl: HTMLElement) {
    stepEl.setAttribute("data-opx-state", "active");
    if (reduced) {
      stepEl.style.opacity = "1";
      stepEl.style.transform = "translateY(0)";
      return;
    }
    stepEl.style.transition = "opacity 280ms ease-out, transform 280ms ease-out";
    stepEl.style.opacity = "1";
    stepEl.style.transform = "translateY(0)";
    await waitMs(280, token);
  }

  async function runStep(idx: number, step: OpxStep) {
    const el = stepEls[idx];
    if (!el) return;
    const speed = script.meta.speed || 1;
    const typing = (step.timing?.typing ?? 0) / speed;

    if (step.user && composerBody && typing > 0 && !reduced) {
      await typeIntoComposer(step.user.body, typing);
      await waitMs(200 / speed, token);
      composerBody.textContent = composerPlaceholder;
    } else if (step.agent && typing > 0 && !reduced) {
      // Animate "…" pulses; cheap fake — just wait the duration.
      const indicator = el.querySelector<HTMLElement>("[data-opx-typing-indicator]");
      if (indicator) indicator.style.opacity = "1";
      await waitMs(typing, token);
      if (indicator) indicator.style.opacity = "0";
    }

    await revealStep(el);

    /**
     * Keep the new beat in view by nudging only the stream container
     * (not the page). `scrollIntoView` would also scroll ancestors,
     * so we compute the target manually: scroll just enough so the
     * step's bottom sits at the bottom of the panel. If the step
     * already fits inside the visible area, do nothing.
     */
    const stream = root.querySelector<HTMLElement>("[data-opx-stream]");
    if (stream) {
      const elBottom = el.offsetTop + el.offsetHeight;
      const viewBottom = stream.scrollTop + stream.clientHeight;
      if (elBottom > viewBottom) {
        stream.scrollTo({
          top: elBottom - stream.clientHeight + 12,
          behavior: reduced ? "auto" : "smooth",
        });
      }
    }

    applyAdvances(step);
  }

  async function play() {
    token = { cancelled: false };
    iteration++;
    reset();
    const speed = script.meta.speed || 1;
    /**
     * Global dwell multiplier: keep typing animation at native rate
     * but stretch the hold and appear gaps so longer code blocks
     * remain on-screen long enough to scan.
     */
    const DWELL_SCALE = 2.2;
    await waitMs((script.meta.startDelay ?? 400) / speed, token);
    for (let i = 0; i < script.steps.length; i++) {
      if (token.cancelled) return;
      const step = script.steps[i]!;
      const appearAfter = ((step.timing?.appearAfter ?? 0) / speed) * DWELL_SCALE;
      const holdFor = ((step.timing?.holdFor ?? 1400) / speed) * DWELL_SCALE;
      await waitMs(appearAfter, token);
      await runStep(i, step);
      await waitMs(holdFor, token);
    }
    if (token.cancelled) return;
    root.dispatchEvent(
      new CustomEvent("opx:done", {
        bubbles: true,
        detail: { id: script.meta.id, iteration },
      }),
    );
    if (script.meta.loop && !opts.carouselMode) {
      await waitMs(script.meta.loopPause ?? 2200, token);
      if (!token.cancelled) void play();
    }
  }

  function cancel() {
    token.cancelled = true;
  }

  if (opts.carouselMode) {
    root.addEventListener("opx:play", (ev) => {
      const detail = (ev as CustomEvent).detail as { id?: string } | null;
      if (detail?.id && detail.id !== script.meta.id) return;
      cancel();
      reset();
      void play();
    });
    root.addEventListener("opx:cancel", () => {
      cancel();
    });
  }

  // Pause on tab hide (Page Visibility), resume on return.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancel();
  });

  return { play, cancel, reset };
}
