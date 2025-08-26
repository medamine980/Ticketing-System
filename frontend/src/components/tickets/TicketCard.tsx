import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import type { Ticket } from '../../types';
import { format } from 'date-fns';
import { Edit2, Trash2, MessageSquare } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (ticketId: string) => void;
  onView?: (ticket: Ticket) => void;
  showClientName?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'closed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const TicketCard = ({ ticket, onEdit, onDelete, onView, showClientName = false }: TicketCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{ticket.title}</CardTitle>
            {showClientName && (
              <p className="text-sm text-muted-foreground mb-2">
                Client: {ticket.clientName}
              </p>
            )}
            <div className="flex gap-2 mb-2">
              <Badge className={getStatusColor(ticket.status)}>
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </Badge>
              <Badge className={getPriorityColor(ticket.priority)}>
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">{ticket.description}</p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <p>Created: {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}</p>
            <p>Updated: {format(new Date(ticket.updatedAt), 'MMM dd, yyyy')}</p>
          </div>
          <div className="flex gap-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(ticket)}>
                <MessageSquare className="w-4 h-4" />
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(ticket)}>
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={() => onDelete(ticket.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;