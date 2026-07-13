# Porcia Backend (Foundation)

This repository contains the **production-ready backend foundation** for the luxury fashion brand **Porcia**.

## Tech Stack
- Spring Boot 3.x
- Java 21
- Maven
- PostgreSQL
- Spring Security
- JWT Authentication + Refresh Token (foundation only)
- Spring Data JPA / Hibernate
- MapStruct
- Lombok
- Validation
- Flyway
- Redis (future-ready)
- Swagger / OpenAPI
- Docker-ready

## Notes
- This project is intentionally scaffolded with **no business logic**.
- The focus is on architecture, folder/package layout, configuration management, DTO/Mapper/Exception/Response wrapper strategies, and compilation.

## How to Build
```bash
cd backend
mvn -q -DskipTests package
```

## Suggested Run (after Docker setup)
```bash
docker compose up -d
mvn spring-boot:run
```

