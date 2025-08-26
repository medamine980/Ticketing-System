using TicketingSystem.Application.DTOs.Ticket;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Domain.Services
{
	public interface ITicketService
	{
		public Task<List<TicketDTO>> GetAllAsync();
		public Task<List<TicketDTO>> GetAllTicketsByCurrentUser();
		public Task<Ticket> AddTicket(CreateTicketDTO dto);
		public Task<Ticket> DeleteTicketById(DeleteTicketByIdDTO dto);
	}
}
