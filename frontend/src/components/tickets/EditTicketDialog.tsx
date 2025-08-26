import { useState, useEffect } from 'react';
import { Button } from './../ui/button';
import { Input } from './../ui/input';
import { Textarea } from './../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './../ui/dialog';
import { Label } from './../ui/label';
import type { Ticket } from './../../types';
import { useTickets } from './../../contexts/TicketContext';
import { toast } from 'sonner';

interface EditTicketDialogProps {
    ticket: Ticket | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const EditTicketDialog = ({ ticket, open, onOpenChange }: EditTicketDialogProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { updateTicket } = useTickets();

    useEffect(() => {
        if (ticket) {
            setTitle(ticket.title);
            setDescription(ticket.description);
        }
    }, [ticket]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticket || !title.trim() || !description.trim()) return;

        setIsLoading(true);
        try {
            updateTicket(ticket.id, {
                title: title.trim(),
                description: description.trim()
            });
            toast.success('Ticket updated successfully!');
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to update ticket');
        } finally {
            setIsLoading(false);
        }
    };

    if (!ticket) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Edit Ticket</DialogTitle>
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
                            {isLoading ? 'Updating...' : 'Update Ticket'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditTicketDialog;