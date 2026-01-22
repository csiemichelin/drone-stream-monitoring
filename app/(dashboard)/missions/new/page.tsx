import { MissionForm } from "@/components/missions/mission-form"

export default function NewMissionPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Mission</h1>
        <p className="text-muted-foreground">Set up a new monitoring mission with streams and notification groups</p>
      </div>
      <MissionForm />
    </div>
  )
}
