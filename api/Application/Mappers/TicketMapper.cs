using TicketingSystem.Application.DTOs.Ticket;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Mappers
{
	public class TicketMapper
	{
		public static IEnumerable<TicketDTO> TicketListToTicketDTOList(List<Ticket> tickets)
		{
			foreach (Ticket ticket in tickets)
			{
				yield return new()
				{
					Id = ticket.Id,
					Title = ticket.Title,
					Description = ticket.Description,
				};
			}
		}

		public static Ticket CreateTicketDTOToTicket(CreateTicketDTO dto) =>
			new()
			{
				Title = dto.Title,
				Description = dto.Description,
			};
	}
}
