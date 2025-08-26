using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketingSystem.Application.DTOs.User;
using TicketingSystem.Domain.Services;

namespace TicketingSystem.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController(IUserService userService) : ControllerBase
	{
		private IUserService userService = userService;

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterUserDTO dto)
		{
			try
			{
				UserResponseDTO userResponse = await this.userService.Register(dto);

				return Created();
			}
			catch (ValidationException ex)
			{
				return BadRequest(ex.Message);
			}
			catch (Exception ex)
			{

				return BadRequest(ex.Message);
			}
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login(LoginUserDTO dto)
		{
			try
			{
				string token = await this.userService.Login(dto);
				return Ok(new { token });
			}
			catch (ValidationException ex)
			{
				return BadRequest(ex.Message);
			}
			catch (UnauthorizedAccessException ex)
			{
				return Unauthorized(new { message = ex.Message });
			}
		}
	}
}
