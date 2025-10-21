FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Install system dependencies for PDF generation
RUN apt-get update && apt-get install -y \
    libgdiplus \
    fontconfig \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Copy published files from the build context to the container
COPY publish/ .

# Expose the port your app runs on (change if needed)
EXPOSE 5001

# Start the application
ENTRYPOINT ["dotnet", "Agronexis.Api.dll"]
