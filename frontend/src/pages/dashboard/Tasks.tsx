import { memo, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTasks } from '@/hooks';
import { Plus, Trash2, Check } from 'lucide-react';

const Tasks = memo(() => {
  const { tasks, loading, getTasks, createTask, deleteTask, completeTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    getTasks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTask({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Tasks</h2>
          <p className="text-muted-foreground mt-2">Manage your tasks</p>
        </div>

        <Card glass>
          <CardHeader>
            <CardTitle>Create Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button type="submit" disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && tasks.length === 0 ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : tasks.length === 0 ? (
              <p className="text-muted-foreground">No tasks yet</p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className={task.completed ? 'line-through text-muted-foreground' : ''}>{task.title}</p>
                      {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      {!task.completed && (
                        <Button size="sm" variant="ghost" onClick={() => completeTask(task.id)}>
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => deleteTask(task.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
});

Tasks.displayName = 'Tasks';

export default Tasks;
