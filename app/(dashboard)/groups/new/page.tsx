import { GroupForm } from "@/components/groups/group-form"

export default function NewGroupPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Notification Group</h1>
        <p className="text-muted-foreground">Set up a new group to receive alert notifications</p>
      </div>
      <GroupForm mode="create" />
    </div>
  )
}
