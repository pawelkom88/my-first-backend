its best practice to explicitly mark public function as such, to make it more readable

a controllers job is only to check and sanitise data, the work of actually executing the task should be down to a 'service'. this helps separate logic better, as well as make it easier to read

in businesses you will find that the logic to check teh data will often be done with packages. Ale knows of a good few that may be worth looking into

given that register is hashing the password to save it into the database (nicely done, we never store it as plain text) you need to store both the Hashed password, as well as the salt, so that you can test the password on login. we should NEVER use a reverse-able encryption algorithm, as that gives a vector for attack

on login, you are not using the salt to compare the passwords, this is best practice so that we do not need to store passwords in plain text

there is a lot of stuff in this class that should either be in a helpers file, or in a service class. moving them will make it easier to read and understand

its not a major issue, but normally its not teh concern of the backend how cookies are set, or when they are removed, only that they are sent over. so sending an empty 204 is perfectly valid

the password generation can be done using native node functions. specifically using the node:crypt module. this saves having excess packaged in the project keeping teh size down.

