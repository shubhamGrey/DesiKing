using Agronexis.Business.Configurations;
using Agronexis.DataAccess.ConfigurationsRepository;
using Agronexis.DataAccess.DbContexts;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("AGRONEXIS_DB_CONNECTION")));
builder.Services.AddTransient<IConfigService, ConfigService>();
builder.Services.AddTransient<IConfigurationRepository, ConfigurationRepository>();
builder.Services.AddMemoryCache();

var allowedOrigins = new[] { "http://localhost:3002", "https://agronexis.com", "https://www.agronexis.com" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins(allowedOrigins)
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsProduction())
{
    app.UseSwagger(c =>
    {
        c.RouteTemplate = "api/swagger/{documentName}/swagger.json"; // Serve JSON here
    });
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/api/swagger/v1/swagger.json", "Agronexis API V1");
        c.RoutePrefix = "api/swagger"; // This sets UI to load at /api/swagger
    });
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
