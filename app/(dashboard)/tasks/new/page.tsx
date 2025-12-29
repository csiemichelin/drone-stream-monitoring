import { TaskForm } from "@/components/tasks/task-form"

export default function NewTaskPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Task</h1>
        <p className="text-muted-foreground">Set up a new monitoring task with streams and notification groups</p>
      </div>
      <TaskForm />
    </div>
  )
}
