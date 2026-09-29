'use client'

import { TaskItem } from './TaskItem'

export function TaskList({ initialTasks }) {
  if (!initialTasks || initialTasks.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500 font-sans italic">No tasks found. Add your first strike.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {initialTasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}
