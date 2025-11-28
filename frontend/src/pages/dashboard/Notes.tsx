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
import { useNotes } from '@/hooks';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Plus, Trash2, StickyNote } from 'lucide-react';

const Notes = memo(() => {
  const { notes, loading, getNotes, createNote, deleteNote } = useNotes();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    getNotes();
  }, []);

  useKeyboardShortcuts([
    { key: 'n', ctrl: true, callback: () => setOpen(true) },
    { key: 'Escape', callback: () => { setOpen(false); setConfirmOpen(false); } },
  ]);

  const handleRefresh = async () => {
    await getNotes();
  };



  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await createNote({ content, tags: tags || undefined });
      setContent('');
      setTags('');
      setOpen(false);
      toast.success('Note created successfully!');
    } catch {
      toast.error('Failed to create note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteNote(deleteId);
      toast.success('Note deleted successfully!');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  return (
    <DashboardLayout>
      <PullToRefresh onRefresh={handleRefresh} className="min-h-screen">
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Notes</h2>
            <p className="text-muted-foreground mt-2">Manage your notes</p>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </div>

        {loading && notes.length === 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : notes.length === 0 ? (
          <EmptyState
            icon={<StickyNote className="w-8 h-8" />}
            title="No notes yet"
            description="Create your first note to capture your thoughts and ideas"
            action={{ label: 'Create Note', onClick: () => setOpen(true) }}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <Card key={note.id} glass className="card-hover animate-fade-in">
                <CardContent className="p-4 min-h-[44px]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      {note.tags && <p className="text-sm text-muted-foreground mt-2">{note.tags}</p>}
                    </div>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 min-h-[44px] min-w-[44px]" onClick={() => { setDeleteId(note.id); setConfirmOpen(true); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
            <DialogTitle>Create Note</DialogTitle>
            <DialogDescription>Add a new note</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <textarea
                className="w-full min-h-[100px] p-3 rounded-lg border bg-background"
                placeholder="Enter note content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tags</label>
              <Input
                placeholder="Enter tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Note'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleDelete}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
      />
    </DashboardLayout>
  );
});

Notes.displayName = 'Notes';

export default Notes;
