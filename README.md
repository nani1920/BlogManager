# Blog Management System RESTful API

This project implements a RESTful API for a blog management system, supporting user authentication, role-based access control, and comprehensive blog management functionalities.

## Project Description

This backend API provides the core functionality for a blog management system, allowing users to register, log in, and manage blog posts and comments. It features user authentication, role-based access control (Admin, Editor, User), and includes email verification. The API is designed to be consumed by a separate frontend application.

## Technologies Used

*   **Node.js:** JavaScript runtime environment
*   **Express.js:** Web application framework for Node.js
*   **MongoDB:** NoSQL database
*   **Mongoose:** MongoDB object modeling tool
*   **JSON Web Token (JWT):** For user authentication
*   **bcrypt:** For password hashing
*   **nodemailer:** For email verification (optional)
*   **dotenv:** For managing environment variables

## Features

*   **User Management:**
    *   User registration with password hashing.
    *   User login with JWT-based authentication.
    *   Email verification for new user accounts.
*   **Role-Based Access Control:**
    *   Admin, Editor, and User roles.
    *   Middleware to enforce role-based access to different API endpoints.
*   **Blog Management:**
    *   Create, read, update, and delete blog posts.
    *   Role-based permissions for blog management actions.
    *   Admin can create, edit, and delete blogs.
    *   Admin can assign blogs to Editors.
    *   Editors can edit assigned blogs.
*   **Comment Management:**
    *   Users can add comments to blogs.
    *   Users can delete their own comments.

## Installation

To set up and run the API locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    cd YOUR_REPOSITORY_NAME
    ```
    *  Replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your github username and repository name respectively.
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file in the root directory.** Include the following environment variables (replace the placeholders):
    ```
    MONGODB_URL="your_mongodb_connection_string"
    JWT_SECRET="your_jwt_secret_key"
    PORT=4000
    ```
    *   `MONGODB_URL`: Your MongoDB connection string.
    *   `JWT_SECRET`: A secret key for JWT token generation.
    *   `PORT`: The port number the server will listen on (default 4000).

## Usage

1.  **Start the server:**
    ```bash
    npm run dev
    ```
2. The API will be accessible at `http://localhost:4000` (or the port specified in your `.env` file).

3.  **API Endpoints:**

    *   **Authentication:**
        *   `POST /auth/register`: Register a new user.
            *   Request body: `{ "username": "user", "email": "user@example.com", "role":"admin", "password": "password123" }`
        *   `POST /auth/login`: Log in an existing user.
            *   Request body: `{ "email": "user@example.com", "password": "password123" }`

    *   **NOTE**
        *    Use jwtToken in Header for Accessing the Blogs and Comments API's
    *   **Blogs:**
        *   `GET /blogs`: Retrieve all blog posts.
        *   `GET /blogs/:id`: Retrieve a specific blog post.
        *   `POST /blogs`: Create a new blog post (Admin only).
            *    Request body: `{ "title": "Blog Title", "content": "Blog content" }`
        *   `PUT /blogs/:id`: Update an existing blog post (Admin, Editor if assigned).
            *   Request body: `{ "title": "Blog Title", "content": "Blog content" }`
        *   `DELETE /blogs/:id`: Delete a blog post (Admin only).
        *   `POST /blogs/:blogId/assign-editor`:  Assign blog to editor (Admin).
            *   Request body: `{ "assignedEditorId":"userId" }`
      
    *   **Comments:**
        *   `POST /blogs/:blogId/comments`: Add a comment to a blog post (User).
            *   Request body: `{ "content": "Comment text" }`
        *   `DELETE /blogs/:blogId/comments/:commentId`: Delete your own comment (User).

  *   Use tools like Postman or CURL to interact with the API endpoints.

## Deployment

1.  **Platform:** Deployed the application to Render.

2.  **Environment Variables:** Configured the environment variables on the chosen deployment platform to match your `.env` file.

3.  **Deploy:** Followed the platform's deployment instructions.

4.  **Test:** Verify the live API endpoints by making requests via Postman or a similar tool to make sure everything is working.

5. **Share Live URL** Once deployed, share your deployment url for testing.

## Contributing

Contributions are always welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch: `git checkout -b feature/your-feature-name` or `git checkout -b fix/your-fix-name`.
3.  Make your changes and commit: `git commit -m "Descriptive commit message"`.
4.  Push your changes to your fork: `git push origin feature/your-feature-name`.
5.  Create a pull request to the `main` branch of this repository.

Please ensure your code follows the existing style guidelines and includes relevant tests.

## License

[MIT](https://choosealicense.com/licenses/mit/)
