FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY CosmeticShop_Backend.sln ./
COPY CosmeticShop_Backend/CosmeticShop_Backend.csproj CosmeticShop_Backend/
RUN dotnet restore CosmeticShop_Backend.sln

COPY CosmeticShop_Backend/ CosmeticShop_Backend/
WORKDIR /src/CosmeticShop_Backend
RUN dotnet publish CosmeticShop_Backend.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CosmeticShop_Backend.dll"]
