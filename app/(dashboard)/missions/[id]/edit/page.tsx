import { notFound } from "next/navigation"
import { dataStore } from "@/lib/store"
import { MissionForm } from "@/components/missions/mission-form"

interface EditMissionPageProps {
  params: Promise<{ id: string }>
}

export default async function EditMissionPage({ params }: EditMissionPageProps) {
  const { id } = await params
  const mission = dataStore.getMission(id)

  if (!mission) {
    notFound()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Mission</h1>
        <p className="text-muted-foreground">Update mission details, streams, and notification groups</p>
      </div>
      <MissionForm
        mission={{
          id: mission.id,
          name: mission.name,
          description: mission.description,
          startAt: mission.startAt,
          createdAt: mission.createdAt,
          boundStreamIds: mission.boundStreamIds,
          notifyGroupIds: mission.notifyGroupIds,
        }}
      />
    </div>
  )
}
