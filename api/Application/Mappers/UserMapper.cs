using TicketingSystem.Application.DTOs.User;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Mappers
{
	public class UserMapper
	{
		public static User RegisterUserDTOToUser(RegisterUserDTO dto)
		{
			User user = new User
			{
				Name = dto.Name,
				Email = dto.Email,
				Password = dto.Password,
			};
			return user;
		}

		public static RegisterUserDTO UserToRegisterUserDTO(User user)
		{
			RegisterUserDTO dto = new RegisterUserDTO
			{
				Name = user.Name,
				Email = user.Email,
				Password = user.Password,
			};

			return dto;
		}

		public static UserResponseDTO UserToUserResponseDTO(User user) =>
			new()
			{
				Id = user.Id,
				Email = user.Email,
				Role = user.Role,
			};
	}
}
