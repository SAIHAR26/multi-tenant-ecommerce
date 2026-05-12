\# Authentication Flow



\## Register Flow

User enters name, email, password and role.

Backend validates data.

Password hashed using bcryptjs.

User stored in MongoDB.



\## Login Flow

User enters email and password.

Backend verifies credentials.

JWT token generated after successful login.



\## Password Hashing

Passwords are encrypted using bcryptjs before storing in database.



\## JWT Authentication

JWT token maintains user login session securely.



\## Protected Routes

Only authenticated users can access protected APIs.



\## Role-Based Access

Admin, Vendor and Customer have different permissions.

