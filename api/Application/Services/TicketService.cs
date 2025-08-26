using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TicketingSystem.Application.Common.Interfaces;
using TicketingSystem.Application.DTOs.Ticket;
using TicketingSystem.Application.Mappers;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Domain.Enums;
using TicketingSystem.Domain.Repositories;
using TicketingSystem.Domain.Services;
using TicketingSystem.Infrastracture.Persistence;

namespace TicketingSystem.Application.Services
{
	public class TicketService(
		ITicketRepository ticketRepository,
		IValidator<CreateTicketDTO> validator,
		ICurrentUserService currentUserService
		): ITicketService
	{
		private readonly ITicketRepository ticketRepository = ticketRepository;
		private readonly IValidator<CreateTicketDTO> validator = validator;
		private readonly ICurrentUserService currentUserService = currentUserService;


		public async Task<List<TicketDTO>> GetAllAsync() =>
			TicketMapper.TicketListToTicketDTOList(
                await ticketRepository.GetAllTickets()
                ).ToList();

		public async Task<Ticket> AddTicket(CreateTicketDTO dto)
		{
			var result = validator.Validate(dto);
			if (!result.IsValid)
			{
				throw new ValidationException(result.Errors);
			}
			Ticket ticket = TicketMapper.CreateTicketDTOToTicket(dto);
			ticket.Id = Guid.NewGuid();
			ticket.Status = TicketStatus.Open;
			User? currentUser = currentUserService.GetUser();
			if(currentUser == null)
			{
				throw new UnauthorizedAccessException("You have to login");
			}
			ticket.UserId = currentUser.Id;
			await this.ticketRepository.AddAsync(ticket);
			await this.ticketRepository.SaveChangesAsync();
			return ticket;
		}

        public async Task<Ticket> DeleteTicketById(DeleteTicketByIdDTO dto)
        {	
			Guid Guid = new Guid(dto.Id);
            Ticket? ticket = await this.ticketRepository.DeleteById(Guid);
			
			if(ticket == null)
			{
				throw new Exception("The given ticket Id is not found");
			}

			await this.ticketRepository.SaveChangesAsync();	

			return ticket;
        }
        public async Task<List<TicketDTO>> GetAllTicketsByCurrentUser()
        {
            User? user = this.currentUserService.GetUser();
			if(user == null)
			{
				throw new UnauthorizedAccessException("You have to log in");
			}
			List<Ticket> tickets = await this.ticketRepository.GetAllTicketByUser(user.Id);
			return TicketMapper.TicketListToTicketDTOList(tickets).ToList();
        }



        /*public async Task<TicketDto> GetByIdAsync(int id)
		{
			var ticket = await dbContext.Tickets.FindAsync(id);
			return ticket == null ? null : _mapper.Map<TicketDto>(ticket);
		}

		public async Task<TicketDto> CreateAsync(CreateTicketDto dto, string userId)
		{
			var ticket = new Ticket
			{
				Title = dto.Title,
				Description = dto.Description,
				CreatedBy = userId
			};

			dbContext.Tickets.Add(ticket);
			await dbContext.SaveChangesAsync();

			return _mapper.Map<TicketDto>(ticket);
		}

		public async Task<bool> UpdateAsync(int id, CreateTicketDto dto)
		{
			var ticket = await dbContext.Tickets.FindAsync(id);
			if (ticket == null) return false;

			ticket.Title = dto.Title;
			ticket.Description = dto.Description;

			await dbContext.SaveChangesAsync();
			return true;
		}

		public async Task<bool> DeleteAsync(int id)
		{
			var ticket = await dbContext.Tickets.FindAsync(id);
			if (ticket == null) return false;

			dbContext.Tickets.Remove(ticket);
			await dbContext.SaveChangesAsync();
			return true;
		}*/
    }
}
