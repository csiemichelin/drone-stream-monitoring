import { dataStore } from "@/lib/store"
import { notFound } from "next/navigation"
import { GroupForm } from "@/components/groups/group-form"

interface EditGroupPageProps {
  params: Promise<{ id: string }>
}

export default async function EditGroupPage({ params }: EditGroupPageProps) {
  const { id } = await params
  const group = dataStore.getGroup(id)

  if (!group) {
    notFound()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Notification Group</h1>
        <p className="text-muted-foreground">Update group settings and notification preferences</p>
      </div>
      <GroupForm group={group} mode="edit" />
    </div>
  )
}
