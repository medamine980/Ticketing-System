using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Domain.Entities
{
	public class User
	{
		public Guid Id { get; set; }
		public string Name { get; set; }
		public string Email { get; set; }
		public string Password {  get; set; }
		public Role Role { get; set; }
		public IList<Ticket>? Tickets{ get; set; }

	}
}
