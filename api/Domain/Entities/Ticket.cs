using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Domain.Entities
{
	public class Ticket
	{
		public Guid Id { get; set; }
		public string Title { get; set; }
		public string Description { get; set; }
		public TicketStatus Status {  get; set; }
		public User User { get; set; }
		public Guid UserId { get; set; }
		public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
	}
}
