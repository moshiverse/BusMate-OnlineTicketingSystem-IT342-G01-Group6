# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]



## ================================
## Stage 1: Build Spring Boot JAR
## ================================
#FROM maven:3.9.2-eclipse-temurin-17 AS build
#
## Set working directory
#WORKDIR /app
#
## Copy pom.xml and download dependencies
#COPY pom.xml .
#RUN mvn dependency:go-offline
#
## Copy source code
#COPY src ./src
#
## Build the JAR without running tests
#RUN mvn clean package -DskipTests
#
## ================================
## Stage 2: Create lightweight runtime image
## ================================
#FROM eclipse-temurin:17-jdk-alpine
#
#WORKDIR /app
#
## Copy the JAR from build stage
#COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
#
## Expose port 8080 (Render will map automatically)
#EXPOSE 8080
#
## Start Spring Boot
#ENTRYPOINT ["java", "-jar", "app.jar"]