import { useState, type SetStateAction } from "react";
import type { DesignEvent } from "@/lib/events/types";
import { mergeDesign } from "./merge-design";
import { sameDesign } from "./design-state";
export function useDesignHistory(event: DesignEvent) {
  const [state, setState] = useState({
    draft: event,
    baseline: event,
    past: [] as DesignEvent[],
    future: [] as DesignEvent[],
  });
  if (event !== state.baseline)
    setState({
      ...state,
      baseline: event,
      draft: mergeDesign(state.draft, state.baseline, event),
    });
  function setDraft(action: SetStateAction<DesignEvent>) {
    setState((current) => {
      const next =
        typeof action === "function" ? action(current.draft) : action;
      if (sameDesign(next, current.draft)) return { ...current, draft: next };
      return {
        ...current,
        draft: next,
        past: [...current.past.slice(-59), current.draft],
        future: [],
      };
    });
  }
  function undo() {
    setState((current) => {
      const last = current.past.at(-1);
      if (!last) return current;
      return {
        ...current,
        draft: { ...last, photoKeys: current.draft.photoKeys },
        past: current.past.slice(0, -1),
        future: [current.draft, ...current.future],
      };
    });
  }
  function redo() {
    setState((current) => {
      const next = current.future[0];
      if (!next) return current;
      return {
        ...current,
        draft: { ...next, photoKeys: current.draft.photoKeys },
        past: [...current.past, current.draft],
        future: current.future.slice(1),
      };
    });
  }
  return {
    draft: state.draft,
    setDraft,
    dirty: !sameDesign(state.draft, state.baseline),
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
