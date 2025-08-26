using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketingSystem.Application.DTOs.Ticket;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Domain.Services;

namespace TicketingSystem.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TicketsController(ITicketService ticketService) : ControllerBase
	{
		private readonly ITicketService ticketService = ticketService;

		[HttpGet]
		[Authorize(Roles = "Client")]
		public async Task<IActionResult> GetAll()
		{
			try
			{
				List<TicketDTO> dtos = await this.ticketService.GetAllAsync();
				return Ok(dtos);
			}
			catch(UnauthorizedAccessException ex)
			{
				return Unauthorized(ex.Message);
			}
			catch (Exception ex) 
			{
				return BadRequest(ex.Message);
			}
		}

		[HttpGet("currentUser")]
		[Authorize]
		public async Task<IActionResult> GetAllByCurrentUser()
		{
			try
			{
				List<TicketDTO> dtos = await this.ticketService.GetAllTicketsByCurrentUser();
				return Ok(dtos);
			}
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

		[HttpPost]
		[Authorize()]
		public async Task<IActionResult> Create(CreateTicketDTO dto)
		{
			try
			{
				Ticket ticket = await ticketService.AddTicket(dto);
				return Ok(ticket);
			}
			catch (ValidationException ex)
			{
				return BadRequest(ex.Message);
			}
			catch(UnauthorizedAccessException ex)
			{
				return Unauthorized(ex.Message);
			}
		}

		[HttpDelete]
		public async Task<IActionResult> Delete(DeleteTicketByIdDTO dto)
		{
			try
			{
				await this.ticketService.DeleteTicketById(dto);
				return NoContent();
			}
			catch (Exception ex) 
			{
				return BadRequest(ex.Message);
			}
		}



	}
}
