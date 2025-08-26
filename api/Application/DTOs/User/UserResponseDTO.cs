using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Application.DTOs.User
{
	public class UserResponseDTO
	{
		public Guid Id { get; set; }
		public string Email { get; set; }
		public Role Role {  get; set; }

	}
}
