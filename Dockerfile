# =========================
# Build Stage
# =========================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build jar
RUN mvn clean package -DskipTests


# =========================
# Run Stage
# =========================
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Expose application port
EXPOSE 8080

COPY --from=build /app/target/*.jar backend-0.0.1-SNAPSHOT.jar

ENTRYPOINT ["java","-jar","backend-0.0.1-SNAPSHOT.jar"]