import PersistentAIAssistant from "../../features/coach/components/PersistentAIAssistant";
import AppLayout from "../../layouts/AppLayout";

export default function AIAssistantPage() {
  return (
    <AppLayout>
      <div className="flex-1 h-[calc(100vh-8rem)]">
        <PersistentAIAssistant floatingMode={true} />
      </div>
    </AppLayout>
  );
}
