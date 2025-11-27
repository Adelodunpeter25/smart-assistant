import { memo, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNotes } from '@/hooks';
import { Plus, Trash2 } from 'lucide-react';

const Notes = memo(() => {
  const { notes, loading, getNotes, createNote, deleteNote } = useNotes();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    getNotes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await createNote({ content, tags: tags || undefined });
    setContent('');
    setTags('');
    setOpen(false);
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

        <Card glass>
          <CardHeader>
            <CardTitle>Your Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && notes.length === 0 ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : notes.length === 0 ? (
              <p className="text-muted-foreground">No notes yet</p>
            ) : (
              <div className="space-y-2">
                {notes.map((note) => (
                  <div key={note.id} className="flex items-start justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      {note.tags && <p className="text-sm text-muted-foreground mt-1">{note.tags}</p>}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => deleteNote(note.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Note</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <textarea
              className="w-full min-h-[100px] p-3 rounded-lg border bg-background"
              placeholder="Note content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Input
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              Create Note
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
});

Notes.displayName = 'Notes';

export default Notes;
