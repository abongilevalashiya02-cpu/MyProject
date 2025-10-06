
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, Plus } from 'lucide-react';

interface Entry {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const UserEntries: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch user entries
  const fetchEntries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_entries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setEntries(data || []);
    } catch (error: any) {
      console.error('Error fetching entries:', error);
      toast({
        title: 'Failed to load entries',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchEntries();
  }, [user]);

  // Create/update entry
  const saveEntry = async () => {
    if (!user) return;
    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please provide both title and content',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      
      if (editingId) {
        // Update existing entry
        const { error } = await supabase
          .from('user_entries')
          .update({ 
            title, 
            content,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);
        
        if (error) throw error;
        
        toast({
          title: 'Entry updated',
          description: 'Your entry has been updated successfully',
        });
      } else {
        // Create new entry
        const { error } = await supabase
          .from('user_entries')
          .insert({ 
            user_id: user.id,
            title, 
            content
          });
        
        if (error) throw error;
        
        toast({
          title: 'Entry saved',
          description: 'Your entry has been saved successfully',
        });
      }
      
      // Reset form and fetch updated entries
      resetForm();
      fetchEntries();
    } catch (error: any) {
      console.error('Error saving entry:', error);
      toast({
        title: 'Failed to save entry',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete entry
  const deleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setEntries(entries.filter(entry => entry.id !== id));
      
      toast({
        title: 'Entry deleted',
        description: 'Your entry has been deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting entry:', error);
      toast({
        title: 'Failed to delete entry',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Start editing an entry
  const startEdit = (entry: Entry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setEditingId(entry.id);
    setIsAdding(true);
  };

  // Reset form
  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Entries</CardTitle>
        {!isAdding && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> New Entry
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isAdding ? (
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-3"
              />
              <Textarea
                placeholder="Write your entry here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button 
                onClick={saveEntry} 
                disabled={loading}
                className="bg-bantu-orange hover:bg-bantu-orange/90"
              >
                {editingId ? 'Update Entry' : 'Save Entry'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {loading && entries.length === 0 ? (
              <p className="text-center text-gray-500">Loading entries...</p>
            ) : entries.length === 0 ? (
              <p className="text-center text-gray-500">You don't have any entries yet. Create your first one!</p>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{entry.title}</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => startEdit(entry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserEntries;
