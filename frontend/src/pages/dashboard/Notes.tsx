import { memo, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useNotes } from '@/hooks';
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

  if (loading && notes.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <StickyNote className="w-16 h-16 text-muted-foreground mb-4 mx-auto animate-pulse" />
            <p className="text-muted-foreground">Loading notes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await createNote({ content, tags: tags || undefined });
      setContent('');
      setTags('');
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
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

        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <StickyNote className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No notes yet</p>
            <p className="text-sm text-muted-foreground mt-2">Create your first note to get started</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <Card key={note.id} glass>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      {note.tags && <p className="text-sm text-muted-foreground mt-2">{note.tags}</p>}
                    </div>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => { setDeleteId(note.id); setConfirmOpen(true); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

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
        onConfirm={() => deleteId && deleteNote(deleteId)}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
      />
    </DashboardLayout>
  );
});

Notes.displayName = 'Notes';

export default Notes;
