# DAT076WebApplications
Project repository of Project Groups 2 in course DAT076 - Web Applications

The project report can be found in the top level directory of the project repository, provided as both a pdf and docx.

The directory structure of the repo:
    
The main project is divided between the client directory and the server directory.
    A first mockup version of the application in html and css, part of lab 1, is located in the client_mockup directory.


    server directory:
In the server directory, you should add a .env file containing the SESSION_SECRET and DB_PASSWORD.
The jest config and setup files are located here, as well as the tsconfig and package files for the server side of the source code.
The source code for the backend resides here in the server sub-directories.

        server/db
        Located in the db sub-directory is the source code for the sequelize models for initialization of the database.

        server/src
        Located in the src sub-directory is the source code for the server as well as code for setup and start of the backend server and initialization of the database connection.

        server/src/model
        Contains the source code for the model layer of the server.

        server/src/router
        Contains the source code for the router layer of the server.

        server/src/service
        Contains the source code for the service layer of the server.


    client directory:
This directory contains the source code for the client side of the web application. The frontend source code resides here in the client sub-directories.
The jest config and setup files, the tsconfig files and vite config file are located here, as well as the package files for the client side of the source code.

        client/src
        Contains the source code for the main entry point for the React frontend application, the login page, the registration page, change password page, the user specific diary list page and the api client for communication with the backend server.

        client/src/diary_components
        Contains the source code for the diary page and the diary specific entries.