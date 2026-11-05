import { useRouter } from "next/navigation";
import type { DesignEvent, User } from "@/lib/events/types";
import InvitationSwitcher from "@/features/studio/invitation-switcher";
import { useActiveInvitation } from "@/features/studio/use-active-invitation";
export default function EditorInvitationSwitcher({
  user,
  event,
  save,
}: {
  user: User;
  event: DesignEvent;
  save: () => Promise<boolean>;
}) {
  const router = useRouter();
  const { events, selected, error } = useActiveInvitation(
    user,
    event.kind,
    event.id,
  );
  return (
    <InvitationSwitcher
      events={events}
      selected={selected}
      error={error}
      onSelect={async (next) => {
        if (await save())
          router.push(
            next.isDemo || next.paymentStatus === "paid"
              ? `/editor/${encodeURIComponent(next.id)}`
              : `/?event=${encodeURIComponent(next.id)}`,
          );
      }}
    />
  );
}
