import EventRecordDetails, { recordTab } from "./records/event-record-details";
import type { useManager } from "./use-manager";
export default function ManagerRecords({
  manager,
  tab,
}: {
  manager: ReturnType<typeof useManager>;
  tab: string;
}) {
  return manager.event ? (
    <EventRecordDetails event={manager.event} tab={recordTab(tab)} />
  ) : null;
}
