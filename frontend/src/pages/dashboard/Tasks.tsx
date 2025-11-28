import { memo, useEffect, useState } from 'react';
import { toast } from 'sonner';
import PullToRefresh from 'react-pull-to-refresh';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { CardSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { useTasks } from '@/hooks';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Plus, Trash2, Check, CheckSquare } from 'lucide-react';
import type { Task } from '@/types';

const Tasks = memo(() => {
  const { tasks, loading, getTasks, createTask, deleteTask, completeTask } = useTasks();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const filteredTasks = localTasks.filter(task => {
    const query = searchQuery.toLowerCase();
    return task.title.toLowerCase().includes(query) || 
           (task.description?.toLowerCase().includes(query) || false);
  });

  useKeyboardShortcuts([
    { key: 'n', ctrl: true, callback: () => setOpen(true) },
    { key: 'Escape', callback: () => { setOpen(false); setConfirmOpen(false); } },
  ]);

  const handleRefresh = async () => {
    await getTasks();
  };



  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    
    const optimisticTask: Task = {
      id: Date.now(),
      title,
      description,
      status: 'pending',
      priority: 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setLocalTasks(prev => [...prev, optimisticTask]);
    
    try {
      await createTask({ title, description });
      setTitle('');
      setDescription('');
      setOpen(false);
      toast.success('Task created successfully!');
    } catch {
      setLocalTasks(tasks);
      toast.error('Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (id: number) => {
    setLocalTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' as const } : t));
    try {
      await completeTask(id);
      toast.success('Task completed!');
    } catch {
      setLocalTasks(tasks);
      toast.error('Failed to complete task');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLocalTasks(prev => prev.filter(t => t.id !== deleteId));
    try {
      await deleteTask(deleteId);
      toast.success('Task deleted successfully!');
    } catch {
      setLocalTasks(tasks);
      toast.error('Failed to delete task');
    }
  };

  return (
    <DashboardLayout>
      <PullToRefresh onRefresh={handleRefresh} className="min-h-screen">
        <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Tasks</h2>
              <p className="text-muted-foreground mt-2">Manage your tasks</p>
            </div>
            <Button onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tasks..."
          />
        </div>

        {loading && localTasks.length === 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filteredTasks.length === 0 ? (
          searchQuery ? (
            <EmptyState
              icon={<CheckSquare className="w-8 h-8" />}
              title="No tasks found"
              description={`No tasks match "${searchQuery}"`}
            />
          ) : (
          <EmptyState
            icon={<CheckSquare className="w-8 h-8" />}
            title="No tasks yet"
            description="Create your first task to get started and stay organized"
            action={{ label: 'Create Task', onClick: () => setOpen(true) }}
          />
          )
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} glass className="card-hover animate-fade-in">
                <CardContent className="p-4 min-h-[44px]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
                      {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                    </div>
                    <div className="flex gap-1">
                      {task.status !== 'completed' && (
                        <Button size="sm" variant="ghost" className="min-h-[44px] min-w-[44px]" onClick={() => handleComplete(task.id)}>
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 min-h-[44px] min-w-[44px]" onClick={() => { setDeleteId(task.id); setConfirmOpen(true); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </PullToRefresh>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>Add a new task to your list</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Input
                placeholder="Enter description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
    </DashboardLayout>
  );
});

Tasks.displayName = 'Tasks';

export default Tasks;
