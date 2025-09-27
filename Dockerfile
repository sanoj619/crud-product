# Use a Java 17 base image
FROM eclipse-temurin:17-jdk-alpine

# Set work directory
WORKDIR /app

# Copy the jar file
COPY target/spring-boot-crud-app-0.0.1-SNAPSHOT.jar app.jar

# Expose port (match your Spring Boot server.port)
EXPOSE 8082

# Run the Spring Boot app
ENTRYPOINT ["java","-jar","app.jar"]
