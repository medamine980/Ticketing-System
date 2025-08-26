using TicketingSystem.Application.DTOs.User;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Domain.Services
{
	public interface IUserService
	{
		public Task<UserResponseDTO> Register(RegisterUserDTO dto);
		public Task<string> Login(LoginUserDTO dto);
	}
}
