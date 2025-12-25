import { getScheduledJobs } from "./actions"
import { PlanningView } from "@/components/dashboard/planning-view"

export default async function PlanningPage() {
    const jobs = await getScheduledJobs()

    return <PlanningView initialJobs={jobs} />
}
