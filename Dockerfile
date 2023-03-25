FROM node:14.21 as Front-End
WORKDIR /Front-End
COPY Front-End .
RUN npm ci
RUN npm run build

FROM maven:3.8.4-jdk-11 as Back-End
WORKDIR /Back-End
COPY Back-End .
RUN mkdir -p src/main/resources/public
COPY --from=Front-End /Front-End/build src/main/resources/public
RUN mvn clean package

FROM tomcat:jre11
COPY --from=Back-End /Back-End/target/*.war $CATALINA_HOME/webapps/app.war
EXPOSE 8080
ENTRYPOINT ["java","-jar","/usr/local/tomcat/webapps/app.war"]
