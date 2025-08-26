using FluentValidation;
using TicketingSystem.Application.DTOs.User;

namespace TicketingSystem.Application.Validators.User
{
	public class RegisterUserDTOValidator: AbstractValidator<RegisterUserDTO>
	{
		public RegisterUserDTOValidator() 
		{
			RuleFor(x => x.Email)
				.NotEmpty().WithMessage("Email is required")
				.EmailAddress().WithMessage("Invalid email format");
			RuleFor(x => x.Password)
				.MinimumLength(6).WithMessage("Password must at least be 6 characters");
		}
	}
}
