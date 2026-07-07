using System.Net;
using System.Net.Mail;

namespace CosmeticShop_Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(
            string toEmail,
            string subject,
            string body)
        {
            var mail = _configuration["EmailSettings:Mail"];
            var password = _configuration["EmailSettings:Password"];
            var host = _configuration["EmailSettings:Host"];
            var port = int.Parse(_configuration["EmailSettings:Port"]!);

            using var smtp = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(mail, password),
                EnableSsl = true
            };

            var message = new MailMessage
            {
                From = new MailAddress(mail!),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            message.To.Add(toEmail);

            await smtp.SendMailAsync(message);
        }
    }
}