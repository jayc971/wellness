import { DashboardHeader } from "../components/dashboard/dashboard-header"
import { WellnessLogForm } from "../components/forms/wellness-log-form"
import { WellnessLogsTable } from "../components/dashboard/wellness-logs-table"
import { ResizablePanels } from "../components/ui/resizable-panels"

export default function DashboardPage() {
  const leftPanel = <WellnessLogForm />
  const rightPanel = <WellnessLogsTable />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto p-8">
        <ResizablePanels leftPanel={leftPanel} rightPanel={rightPanel} minLeftWidth={25} maxLeftWidth={50} />
      </main>
    </div>
  )
}
