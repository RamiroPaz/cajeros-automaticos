# cajeros-automaticos
 
 ## How to run the project
 First of all:  
 Install the dependencies in the server and client folders with `npm i`  
 Then locate in the server directory:  
 `npm start`: runs the entire project,  
 `npm run dev`: runs backend only,  
 `npm run client`: runs frontend only  
 ## Design decisions
 The project is divided in two main folders `client` (frontend) and `server` (backend).  
 ### Backend
 The server folder is divided in:  
 `services`: Interacts with the 'DB' and there is the bussiness logic,  
 `controllers`: Handles the http requests and uses the functionality provided by the services layer,  
 `utils`: There are a csv file which contains all the information needed, a script to convert CSV to JSON, and a json file
 that works as a 'DB'.  
 `routes`,  
 ### Frontend
 The client directory has only 3 components:   
 `FormComponent`: Handles the user input and http requests (The http requests could be separated in a 'service' folder but for this little project i did no consider it necessary to modularize)  
 `Maps` and `AtmsInfo`: Both of them provides the user all the info required.
