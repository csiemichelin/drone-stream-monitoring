import { notFound } from "next/navigation"
import { dataStore } from "@/lib/store"
import { TaskForm } from "@/components/tasks/task-form"

interface EditTaskPageProps {
  params: Promise<{ id: string }>
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params
  const task = dataStore.getTask(id)

  if (!task) {
    notFound()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Task</h1>
        <p className="text-muted-foreground">Update task details, streams, and notification groups</p>
      </div>
      <TaskForm
        task={{
          id: task.id,
          name: task.name,
          description: task.description,
          boundStreamIds: task.boundStreamIds,
          notifyGroupIds: task.notifyGroupIds,
        }}
      />
    </div>
  )
}
