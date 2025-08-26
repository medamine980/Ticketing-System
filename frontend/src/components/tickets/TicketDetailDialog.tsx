import { useState } from 'react';
import { Button } from './../ui/button';
import { Textarea } from './../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './../ui/dialog';
import { Badge } from './../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './../ui/select';
import { Separator } from './../ui/separator';
import type { Ticket, Comment, TicketStatus, TicketPriority } from './../../types';
import { useTickets } from './../../contexts/TicketContext';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface TicketDetailDialogProps {
    ticket: Ticket | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const TicketDetailDialog = ({ ticket, open, onOpenChange }: TicketDetailDialogProps) => {
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { updateTicket, addComment, getCommentsByTicket } = useTickets();
    const { user } = useAuth();

    if (!ticket) return null;

    const comments = getCommentsByTicket(ticket.id);
    const isAgent = user?.role === 'agent';

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !comment.trim()) return;

        setIsLoading(true);
        try {
            addComment(ticket.id, comment.trim(), user.id, user.name, user.role);
            setComment('');
            toast.success('Comment added successfully!');
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = (status: TicketStatus) => {
        updateTicket(ticket.id, { status });
        toast.success('Status updated successfully!');
    };

    const handlePriorityChange = (priority: TicketPriority) => {
        updateTicket(ticket.id, { priority });
        toast.success('Priority updated successfully!');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">{ticket.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Ticket Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Client</p>
                            <p className="font-medium">{ticket.clientName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Created</p>
                            <p className="font-medium">{format(new Date(ticket.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                        </div>
                    </div>

                    {/* Status and Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Status</p>
                            {isAgent ? (
                                <Select value={ticket.status} onValueChange={handleStatusChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Badge className="inline-block">
                                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                </Badge>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Priority</p>
                            {isAgent ? (
                                <Select value={ticket.priority} onValueChange={handlePriorityChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Badge className="inline-block">
                                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Description</p>
                        <p className="bg-muted p-3 rounded-lg">{ticket.description}</p>
                    </div>

                    <Separator />

                    {/* Comments */}
                    <div>
                        <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>
                        <div className="space-y-4 max-h-60 overflow-y-auto">
                            {comments.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No comments yet.</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="bg-muted/50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-medium">{comment.userName}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {comment.userRole}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground ml-auto">
                                                {format(new Date(comment.createdAt), 'MMM dd, HH:mm')}
                                            </span>
                                        </div>
                                        <p className="text-sm">{comment.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Add Comment */}
                    <form onSubmit={handleAddComment} className="space-y-3">
                        <Textarea
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                        />
                        <Button type="submit" disabled={isLoading || !comment.trim()}>
                            {isLoading ? 'Adding...' : 'Add Comment'}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TicketDetailDialog;