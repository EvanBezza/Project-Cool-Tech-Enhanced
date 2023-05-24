# Project-Cool-Tech-Enhanced
This is a Capstone project for my studies where we are to create a full MERN stack app that makes use of MongoDB, JavaScript, React, Express, and all.

```markdown
# User Management System

The User Management System is a web application that allows administrators to manage users, roles, divisions, and organizational units. It provides functionalities such as user registration, login, role assignment, division and OU management, and credential management.

## Installation

To use the User Management System, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/user-management-system.git
   ```

2. Navigate to the project directory:

   ```bash
   cd user-management-system
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up the environment variables:

   - Create a `.env` file in the root directory of the project.
   - Define the following environment variables in the `.env` file:

     ```plaintext
     SECRET_KEY="your_secret_key_here"
     MONGODB_URI="mongodb+srv://<db-username>:<login-password>@<cluster>.e4tkqkp.mongodb.net/<db-name>"
     ```

     Replace `your-secret-key` with a secret key of your choice and `MONGODB_URI` with the details you retrieve from the Clusster Connect via Drivers

5. Start the application:

   ```bash
   npm start
   ```

   The application should now be running at [http://localhost:3000](http://localhost:3000).

## Usage

1. Access the application through your web browser by visiting [http://localhost:3000](http://localhost:3000).

2. Register a new user account by providing a username and password.

3. Log in to the application using your registered credentials.

4. As an administrator, you will have access to various management functionalities, including:

   - User Management: View, edit, and assign roles to users.
   - Division Management: Create, assign users to divisions, and manage divisions.
   - OU Management: Create, assign users to OUs, and manage OUs.
   - Credential Management: Add, update, and view credentials for divisions.

   Use the navigation menu or buttons within the application to access these functionalities.

## Contributing

Contributions to the User Management System are welcome! If you find any issues or have suggestions for improvements, please create a new issue or submit a pull request.