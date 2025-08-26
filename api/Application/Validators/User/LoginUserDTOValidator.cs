using FluentValidation;
using TicketingSystem.Application.DTOs.User;

namespace TicketingSystem.Application.Validators.User
{
	public class LoginUserDTOValidator: AbstractValidator<LoginUserDTO>
	{
		public LoginUserDTOValidator() 
		{
			RuleFor(x => x.Email)
				.NotEmpty().WithMessage("Email is required")
				.EmailAddress().WithMessage("Email format is invalid");

			RuleFor(x => x.Password)
				.NotEmpty().WithMessage("Password is required");
		}
	}
}
