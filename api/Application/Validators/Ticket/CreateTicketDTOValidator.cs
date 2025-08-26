using FluentValidation;
using TicketingSystem.Application.DTOs.Ticket;

namespace TicketingSystem.Application.Validators.Ticket
{
	public class CreateTicketDTOValidator : AbstractValidator<CreateTicketDTO>
	{
		public CreateTicketDTOValidator()
		{
			RuleFor(x => x.Title)
				.NotEmpty().WithMessage("Title is required");
			RuleFor(x => x.Description)
				.NotEmpty().WithMessage("Description is required");
		}
	}
}
