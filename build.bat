cd ".\Front-End"
call npm ci
call npm run build
rd /s /q ..\Back-End\src\main\resources\build
rd /s /q ..\Back-End\src\main\resources\public
move build ..\Back-End\src\main\resources
cd "..\Back-End\src\main\resources"
ren build public
cd "..\..\.."
call mvnw clean package
move .\target\*.war ..\
call mvnw clean
cd ".."