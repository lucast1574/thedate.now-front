import TemplatePanel from "../template-panel";
import type { useInvitationDesign } from "../use-invitation-design";
export default function TemplateWorkspacePanel({
  editor,
  activeId,
  setActiveId,
  select,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
  activeId: string;
  setActiveId: (id: string) => void;
  select: (id: string) => void;
}) {
  return (
    <TemplatePanel
      editor={editor}
      sectionId={activeId}
      onActivate={(id) => {
        setActiveId(id);
        select("");
        requestAnimationFrame(() =>
          document
            .getElementById(`page-${id}`)
            ?.scrollIntoView({ block: "start" }),
        );
      }}
    />
  );
}
