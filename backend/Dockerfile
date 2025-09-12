# 1) 빌드 단계
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests

# 2) 실행 단계
FROM eclipse-temurin:21-jre
WORKDIR /app
#COPY --from=build /app/target/*.war app.jar
#ENTRYPOINT ["java", "-war", "app.war"]

COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

# utf-8
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8