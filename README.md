# cajeros-automaticos
 
 ## How to run the project
 to run the entire project go to the server directory and run 'npm run dev'
 to run the client npm run client in the server directory or npm start un the client folder
 to run the backend npm start
 ## Design decisions
 The project is divided in two main folders 'client' and 'server', in the server folder is the backend
 which is divided in services (interacts with the 'DB' and there is the bussiness logic), 
 controllers (handles the http requests and uses the functionality provided by the services layer), 
 routes, utils (there is the csv file where de 'DB' comes from, a script to convert CSV to JSON, and a json file
 that works as a 'DB')
 The client directory has only 3 components, the FormComponent which handles the user input and http requests 
 (the http requests could be separated in a 'service' folder but the only component that makes requests is FormComponent
 so i decided to leave it there), the Maps component and the AtmsInfo that provides the user all the info required
