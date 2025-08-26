using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.DTOs.Ticket
{
	public class TicketDTO
	{
		public Guid Id { get; set; }
		public string Title { get; set; }
		public string Description { get; set; }
	}
}
