FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published files from the build context to the container
COPY publish/ .

# Expose the port your app runs on (change if needed)
EXPOSE 5000

# Start the application
ENTRYPOINT ["dotnet", "Agronexis.Api.dll"]
