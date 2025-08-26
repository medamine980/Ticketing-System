import { useState } from 'react';
import { Button } from './..//ui/button';
import { Input } from './../ui/input';
import { Textarea } from './../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './../ui/dialog';
import { Label } from './../ui/label';
import { Plus } from 'lucide-react';
import { useTickets } from './../../contexts/TicketContext';
import { useAuth } from './../../contexts/AuthContext';
import { toast } from 'sonner';

const CreateTicketDialog = () => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { createTicket } = useTickets();
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !title.trim() || !description.trim()) return;

        setIsLoading(true);
        try {
            createTicket(title.trim(), description.trim(), user.id, user.name);
            toast.success('Ticket created successfully!');
            setTitle('');
            setDescription('');
            setOpen(false);
        } catch (error) {
            toast.error('Failed to create ticket');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Ticket
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Create New Ticket</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Brief description of the issue"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Provide detailed information about your issue"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            required
                        />
                    </div>
                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? 'Creating...' : 'Create Ticket'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTicketDialog;