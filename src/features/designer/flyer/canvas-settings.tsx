import OpeningPanel from "../opening-panel";
import ExperiencePanel from "../experience-panel";
import CanvasBackgroundPanel from "./canvas-background-panel";
import type { useInvitationDesign } from "../use-invitation-design";
export default function CanvasSettings({
  tool,
  editor,
  index,
}: {
  tool: string;
  editor: ReturnType<typeof useInvitationDesign>;
  index: number;
}) {
  if (tool === "opening") return <OpeningPanel editor={editor} />;
  if (tool === "experience") return <ExperiencePanel editor={editor} />;
  if (tool === "background")
    return <CanvasBackgroundPanel editor={editor} index={index} />;
  return null;
}
