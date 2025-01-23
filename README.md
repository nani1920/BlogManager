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
    EMAIL_USER="your_email_user"
    EMAIL_PASSWORD="your_email_password"
    
    ```
    *   `MONGODB_URL`: Your MongoDB connection string.
    *   `JWT_SECRET`: A secret key for JWT token generation.
    *   `PORT`: The port number the server will listen on (default 4000).
    *    `EMAIL_USER`: The user email address used to send emails from.
    *    `EMAIL_PASSWORD`:  The email address password.

## Usage

1.  **Start the server:**
    ```bash
    npm run dev
    ```
2. The API will be accessible at `http://localhost:4000` (or the port specified in your `.env` file).

3.  **API Endpoints:**

    *   **Authentication:**

        ### Registration Endpoint

        **POST** `/auth/register`

        #### Description:
        This endpoint allows a user to register by providing their `username`, `email`, `password`, and `role`. Before registration, it checks if the `username` and `email` already exist in the database. It also validates the input data (e.g., ensures the email is correctly formatted). If successful, a verification email will be sent.

        #### Request Format:

        **URL**: `/auth/register`

        **Method**: `POST`

        **Request Body (JSON)**:
        ```json
        {
            "username": "john_doe",
            "email": "john.doe@example.com",
            "password": "password123",
            "role": "user"
        }
        ```
        * `username` (required, string): The username of the user. Must be unique.
        * `email` (required, string): The email address of the user. Must be unique and in valid format.
        * `password` (required, string): The password for the user account.
        * `role` (optional, string): The role of the user. Options: `admin`, `user`, `editor`.

        **Example Request:**
        ```bash
        POST /auth/register HTTP/1.1
        Host: your-api-domain.com
        Content-Type: application/json

        {
        "username": "john_doe",
        "email": "john.doe@example.com",
        "password": "password123",
        "role": "user"
        }
        ```

        #### Expected Responses:

        *   **201 Created**: The registration was successful. A verification email has been sent to the user's email address.

            **Response:**
            ```json
            {
                "message": "Registration successful. Please verify your email."
            }
            ```

        *   **400 Bad Request**: One of the fields is missing or invalid, such as an already existing username or email, or incorrect input format.

            **Example Responses:**

            *   If the username already exists:
                ```json
                {
                    "message": "Username already Exist"
                }
                ```
            *   If the email already exists:
                ```json
                {
                    "message": "User already Exist with this Email"
                }
                ```
            *   If the email format is invalid:
                ```json
                {
                    "message": "Invalid email format"
                }
                ```
            *   If any required fields are empty or invalid:
                ```json
                {
                    "message": "Invalid username"
                }
                ```
            or:
                ```json
                {
                    "message": "Invalid Password"
                }
                ```

        *   **500 Internal Server Error**: A server error occurred, such as a database failure or unexpected error.

            **Example Response:**
            ```json
            {
                "message": "Internal Server Error"
            }
            ```

        ### Login Endpoint

        **POST** `/auth/login`

        #### Description:
        This endpoint allows a user to log in by providing their `username` and `password`. It checks if the user exists in the database and verifies the provided password against the stored hash. Upon successful authentication, it returns a JWT token for subsequent authorized requests.

        #### Request Format:

        **URL**: `/auth/login`

        **Method**: `POST`

        **Request Body (JSON)**:
        ```json
        {
            "username": "john_doe",
            "password": "password123"
        }
        ```
        *   `username` (required, string): The username of the user.
        *   `password` (required, string): The password for the user account.

        **Example Request:**
        ```bash
        POST /auth/login HTTP/1.1
        Host: your-api-domain.com
        Content-Type: application/json

        {
            "username": "john_doe",
            "password": "password123"
        }
        ```

        #### Expected Responses:

        *   **200 OK**: Login successful. Returns a JWT token.

            **Response:**
            ```json
            {
                "token": "your_jwt_token"
            }
            ```

        *   **400 Bad Request**: Invalid input (e.g., missing username or password), user not found, or password mismatch.

            **Example Responses:**
            *   If the username is missing or invalid:
                ```json
                {
                    "message": "Invalid Username"
                }
                ```
           *   If the password is missing or invalid:
                ```json
                {
                    "message": "Invalid Password"
                }
                ```
            *   If the user doesn't exist:
                ```json
                {
                    "message": "User doesn't Exists"
                }
                ```
            *   If the password doesn't match:
                ```json
                {
                    "message": "Password doesn't Match"
                }
                ```

        *   **500 Internal Server Error**: A server error occurred, such as a database failure or unexpected error.

            **Example Response:**
            ```json
            {
                "message": "Internal Server Error"
            }
            ```

    *   **NOTE**
        *    Use jwtToken in Header for Accessing the Blogs and Comments API's

  *   **Blogs:**
        
        ### Create Blog Endpoint

        **POST** `/blogs`

        #### Description:
        This endpoint allows an admin user to create a new blog post by providing the `title` and `content`. It validates the input data and saves the new blog to the database.

        #### Request Format:

        **URL**: `/blogs`

        **Method**: `POST`

       **Authorization**: Requires a valid JWT token in the `Authorization` header with "Bearer " prefix. Admin role is required.

        **Request Body (JSON)**:
        ```json
        {
            "title": "Blog Title",
            "content": "Blog Content"
        }
        ```
        * `title` (required, string): The title of the blog post.
        * `content` (required, string): The content of the blog post.

        **Example Request:**
        ```bash
        POST /blogs HTTP/1.1
        Host: your-api-domain.com
        Content-Type: application/json
         Authorization: Bearer your_jwt_token

        {
            "title": "Blog Title",
            "content": "Blog Content"
        }
        ```

        #### Expected Responses:

        *   **201 Created**: Blog post created successfully. Returns a success message and the created blog data.

            **Response:**
           ```json
           {
               "message": "Blog created successfully",
               "createdBlog": {
                "_id": "blog_id",
                "title": "Blog Title",
                "content": "Blog Content",
                "createdAt": "date",
                "updatedAt": "date"
               }
            }
          ```

        *   **400 Bad Request**: Invalid input, such as missing title or content.

            **Example Responses:**

            *   If the title is missing or invalid:
               ```json
               {
                    "message": "Invalid-title field"
               }
               ```
            * If the content is missing or invalid:
                ```json
                {
                   "message": "Invalid-content field"
                }
               ```
        *   **401 Unauthorized**: If the user is not authenticated.
            
        *   **403 Forbidden**: If the user is not an admin.
                
        *   **500 Internal Server Error**: A server error occurred, such as a database failure or unexpected error.
            
            **Example Response:**
            ```json
            {
                "message": "Internal Server Error"
            }
            ```

        ### Get All Blogs Endpoint

        **GET** `/blogs`

        #### Description:
        This endpoint retrieves all blog posts from the database, populating the `assignedEditorId` field with the username and role of the assigned editor (if any).

        #### Request Format:

        **URL**: `/blogs`

        **Method**: `GET`

       **Authorization**: Requires a valid JWT token in the `Authorization` header with "Bearer " prefix.

        **Example Request:**
        ```bash
        GET /blogs HTTP/1.1
        Host: your-api-domain.com
        Authorization: Bearer your_jwt_token
        ```

       #### Expected Responses:
        * **200 OK**: Returns an array of blog posts.
             
            **Response:**
            ```json
            {
              "blogs": [
                {
                "_id": "blog_id",
                 "title": "Blog Title",
                "content": "Blog Content",
                "assignedEditorId": {
                  "_id": "editor_id",
                  "username": "editor_username",
                  "role": "editor"
                  },
                  "createdAt": "date",
                  "updatedAt": "date"
                }
              ]
            }
            ```
        * **404 Not Found**: If no blogs are found.
            
             **Response:**
             ```json
              {
                "message": "No Blogs Found"
             }
            ```

        *   **401 Unauthorized**: If the user is not authenticated.    
         
        *   **500 Internal Server Error**: A server error occurred, such as a database failure or unexpected error.

           **Example Response:**
            ```json
            {
            "message": "Internal Server Error"
            }
           ```
        ### Get Blog by ID Endpoint

        **GET** `/blogs/:id`

        #### Description:
       This endpoint retrieves a specific blog post by its ID, populating the `assignedEditorId` field with the username and role of the assigned editor (if any).

        #### Request Format:

       **URL**: `/blogs/:id`
        
       **Method**: `GET`
        
        **Authorization**: Requires a valid JWT token in the `Authorization` header with "Bearer " prefix.

        **Example Request:**
        ```bash
        GET /blogs/blog_id HTTP/1.1
        Host: your-api-domain.com
        Authorization: Bearer your_jwt_token
        ```
        
        **URL Parameters:**
        
        *   `id`: (required, string) The ID of the blog post.
        
        #### Expected Responses:

        *   **200 OK**: Returns the blog post data.
        
            **Response:**
             ```json
              {
                  "_id": "blog_id",
                  "title": "Blog Title",
                  "content": "Blog Content",
                   "assignedEditorId": {
                     "_id": "editor_id",
                     "username": "editor_username",
                     "role": "editor"
                    },
                   "createdAt": "date",
                   "updatedAt": "date"
               }
               ```
        *   **400 Bad Request**: If the blog ID format is invalid.
            
             **Response:**
               ```json
                 {
                   "message": "Invalid Blog ID format"
                  }
                 ```
        
        *   **404 Not Found**: If the blog post with the given ID is not found.

              **Response:**
              ```json
              {
                "message": "Blog not found"
              }
              ```
       *  **401 Unauthorized**: If the user is not authenticated.    
         
        *   **500 Internal Server Error**: A server error occurred, such as a database failure or unexpected error.
            
           **Example Response:**
            ```json
            {
            "message": "Internal Server Error"
            }
           ```

        ### Update Blog Endpoint

        **PUT** `/blogs/:id`

        #### Description:
        This endpoint allows an admin or an editor (if the blog is assigned to them) to update an existing blog post. It validates the input data and updates the blog in the database.

        #### Request Format:

        **URL**: `/blogs/:id`

        **Method**: `PUT`

        **Authorization**: Requires a valid JWT token in the `Authorization` header with "Bearer " prefix.
        
        **URL Parameters:**

        *   `id`: (required, string) The ID of the blog post.

       **Request Body (JSON)**:
       ```json
        {
            "title": "Updated Blog Title",
            "content": "Updated Blog Content"
         }
        ```
        *   `title` (required, string): The updated title of the blog post.
        *   `content` (required, string): The updated content of the blog post.

        **Example Request:**
        ```bash
        PUT /blogs/blog_id HTTP/1.1
        Host: your-api-domain.com
        Content-Type: application/json
         Authorization: Bearer your_jwt_token
        {
            "title": "Updated Blog Title",
            "content": "Updated Blog Content"
         }
         ```

        #### Expected Responses:

        *   **200 OK**: Blog post updated successfully. Returns a success message and the updated blog data.
            
            **Response:**
             ```json
              {
                "message": "Blog Updated Successfully",
                "updatedBlog": {
                    "_id": "blog_id",
                    "title": "Updated Blog Title",
                    "content": "Updated Blog Content",
                    "createdAt": "date",
                    "updatedAt": "date"
                }
              }
               ```
        *   **400 Bad Request**: Invalid input, such as missing title or content, or invalid blog ID format.

            **Example Responses:**

            *   If the title is missing or invalid:
               ```json
               {
                "message": "Invalid-title field"
               }
               ```
             * If the content is missing or invalid:
                ```json
               {
                "message": "Invalid-content field"
                }
               ```
             * If the blog ID format is invalid:
                ```json
                {
                  "message": "Invalid Blog ID format"
                 }
                 ```

        *   **401 Unauthorized**: If the user is not authenticated.

        *   **403 Forbidden**: If the user is neither an admin nor the assigned editor for the blog.
           
           **Example Responses:**
             * If the blog has not been assigned to an editor yet:
                 ```json
                  {
                    "message": "Blog has not been assigned to an editor yet"
                   }
                 ```
             * If the user is not the assigned editor :
                  ```json
                    {
                      "message":  "Access Denied - You can only edit blogs which are assigned to you"
                     }
                   ```

        *   **404 Not Found**: If the blog post with the given ID is not found.
        
              **Response:**
              ```json
              {
                "message": "Blog not found"
              }
              ```

        *   **500 Internal Server Error**: A server error occurred, such as a database failure or unexpected error.
            
              **Response:**
              ```json
               {
                  "message": "Internal Server Error"
               }
              ```

        ### Delete Blog Endpoint

        **DELETE** `/blogs/:id`

        #### Description:
        This endpoint allows an admin user to delete a blog post by its ID.

        #### Request Format:

        **URL**: `/blogs/:id`

        **Method**: `DELETE`

       **Authorization**: Requires a valid JWT token in the `Authorization` header with "Bearer " prefix. Admin role is required.
        
        **URL Parameters:**
        
        *  `id`: (required, string) The ID of the blog post.
        
        **Example Request:**
        ```bash
          DELETE /blogs/blog_id HTTP/1.1
           Host: your-api-domain.com
            Authorization: Bearer your_jwt_token
        ```
        
        #### Expected Responses:
         
        *   **200 OK**: Blog post deleted successfully. Returns a success message and the deleted blog data.

             **Response:**
              ```json
               {
                    "message": "Blog deleted Successfully",
                    "deletedBlog": {
                    "_id": "blog_id",
                    "title": "Updated Blog Title",
                    "content": "Updated Blog Content",
                    "createdAt": "date",
                    "updatedAt": "date"
                    }
                }
               ```
        *   **400 Bad Request**: If the blog ID format is invalid.

               **Response:**
                ```json
                {
                    "message": "Invalid blog ID format"
                }
                ```
        *   **401 Unauthorized**: If the user is not authenticated.

        *   **403 Forbidden**: If the user is not an admin.

        *   **404 Not Found**: If the blog post with the given ID is not found.
             
            **Response:**
              ```json
               {
                "message": "Blog not found"
                }
              ```

        *   **500 Internal Server Error**: A server error occurred, such as a database failure or unexpected error.
            
             **Response:**
               ```json
               {
                 "message": "Internal Server Error"
               }
               ```
        
        ### Assign Editor to Blog Endpoint

        **POST** `/blogs/:blogId/assign-editor`

        #### Description:
        This endpoint allows an admin user to assign an editor to a specific blog post.

        #### Request Format:

        **URL**: `/blogs/:blogId/assign-editor`

        **Method**: `POST`

        **Authorization**: Requires a valid JWT token in the `Authorization` header with "Bearer " prefix. Admin role is required.
        
         **URL Parameters:**

         * `blogId` (required, string): The ID of the blog to be assigned.

       **Request Body (JSON)**:
        ```json
        {
            "assignedEditorId": "user_id"
        }
       ```
        *  `assignedEditorId` (required, string): The ID of the user to assign as an editor to the blog.

        **Example Request:**
        ```bash
        POST /blogs/blog_id/assign-editor HTTP/1.1
        Host: your-api-domain.com
        Content-Type: application/json
        Authorization: Bearer your_jwt_token
        {
            "assignedEditorId": "user_id"
        }
        ```

        #### Expected Responses:

        *   **200 OK**: Editor assigned successfully. Returns a success message.

             **Response:**
            ```json
            {
            "message": "updated Successfully",
            "updateBlog": {
                "_id": "blog_id",
                "title": "Updated Blog Title",
                "content": "Updated Blog Content",
                "assignedEditorId": "user_id",
                "createdAt": "date",
                "updatedAt": "date"
               }
             }
             ```

        *   **400 Bad Request**: Invalid input, such as invalid blog ID format or invalid editor ID format, or the assigned user is not an editor.
            
             **Example Responses:**
              *   If the assignedEditorId format is invalid:
                ```json
                {
                "message": "Invalid assignedEditorId format"
                }
                ```
               *   If the blogId format is invalid:
                ```json
                {
                  "message": "Invalid BlogId format"
                }
                ```
               *   If the user is not an editor
                   ```json
                   {
                     "message": "Assigned User is not an Editor"
                   }
                   ```

        *   **401 Unauthorized**: If the user is not authenticated.

        *    **403 Forbidden**: If the user is not an admin.

        *   **404 Not Found**: If the blog or the assigned editor user is not found.
             
              **Example Responses:**
                *  If the assigned editor user is not found:
                     ```json
                     {
                         "message": "assignedEditorId not Found"
                     }
                     ```
                *  If the blog is not found:
                    ```json
                    {
                        "message": "Blog Not Found"
                    }
                    ```

        *   **500 Internal Server Error**: A server error occurred, such as a database failure or unexpected error.
            
            **Response:**
             ```json
              {
                "message": "Internal Server Error"
              }
             ```

    
 *   **Comments:**
    
        ### Post Comment Endpoint

        **POST** `/blogs/:blogId/comments`

        #### Description:
        This endpoint allows a user to add a comment to a specific blog post.

        #### Request Format:

        **URL**: `/blogs/:blogId/comments`

        **Method**: `POST`
        
        **Authorization**: Requires a valid JWT token in the `Authorization` header with "Bearer " prefix.

        **URL Parameters:**
        * `blogId` (required, string): The ID of the blog to which the comment is added.

        **Request Body (JSON)**:
        ```json
        {
          "content": "Comment text"
        }
        ```
        *   `content` (required, string): The text of the comment.

        **Example Request:**
        ```bash
        POST /blogs/blog_id/comments HTTP/1.1
        Host: your-api-domain.com
        Content-Type: application/json
        Authorization: Bearer your_jwt_token
        {
            "content": "Comment text"
        }
        ```

        #### Expected Responses:

        *   **200 OK**: Comment added successfully. Returns a success message and the updated blog data.

            **Response:**
            ```json
            {
                "message": "Comment Added Successfully",
                "blog": {
                   "_id": "blog_id",
                   "title": "Blog Title",
                   "content": "Blog Content",
                    "assignedEditorId": {
                       "_id": "editor_id",
                       "username": "editor_username",
                       "role": "editor"
                      },
                    "comments": [
                      {
                       "_id":"comment_id",
                       "userId":"user_id",
                       "content":"comment text"
                      }
                    ],
                   "createdAt": "date",
                   "updatedAt": "date"
                }
            }
            ```
        *   **401 Unauthorized**: If the user is not authenticated.

        *   **404 Not Found**: If the blog with the given ID is not found.
            
              **Response:**
              ```json
              {
                "message": "Blog Not Found"
              }
               ```
       
        *   **500 Internal Server Error**: A server error occurred, such as a database failure or unexpected error.
           
           **Response:**
           ```json
           {
              "message": "Internal Server Error"
           }
           ```
        
        ### Delete Comment Endpoint

        **DELETE** `/blogs/:blogId/comments/:commentId`

        #### Description:
        This endpoint allows a user to delete their own comment from a specific blog post.

        #### Request Format:

        **URL**: `/blogs/:blogId/comments/:commentId`

        **Method**: `DELETE`
        
        **Authorization**: Requires a valid JWT token in the `Authorization` header with "Bearer " prefix.
        
        **URL Parameters:**

        *   `blogId` (required, string): The ID of the blog post to which the comment belongs.
        *   `commentId` (required, string): The ID of the comment to be deleted.

        **Example Request:**
        ```bash
          DELETE /blogs/blog_id/comments/comment_id HTTP/1.1
           Host: your-api-domain.com
           Authorization: Bearer your_jwt_token
        ```

        #### Expected Responses:

        *   **200 OK**: Comment deleted successfully. Returns a success message and the updated blog data.
            
             **Response:**
             ```json
                {
                    "message": "Comment deleted successfully",
                    "blog": {
                       "_id": "blog_id",
                       "title": "Blog Title",
                       "content": "Blog Content",
                        "assignedEditorId": {
                           "_id": "editor_id",
                           "username": "editor_username",
                           "role": "editor"
                          },
                        "comments": [],
                       "createdAt": "date",
                       "updatedAt": "date"
                    }
                 }
            ```

        *   **401 Unauthorized**: If the user is not authenticated.
        *   **403 Forbidden**: If the user is not the owner of the comment.
             
             **Response:**
              ```json
               {
                 "message": "Access Denied - You can only delete your own comments"
                }
              ```

        *   **404 Not Found**: If the blog or comment with the given ID is not found.
        
            **Example Response:**
              *   If the blog is not found:
                ```json
                {
                    "message": "Blog Not Found"
                }
                ```
              *   If the comment is not found:
                ```json
                {
                    "message": "Comment Not Found"
                }
                ```

        *   **500 Internal Server Error**: A server error occurred, such as a database failure or unexpected error.
            
            **Response:**
            ```json
            {
               "message": "Internal Server Error"
            }
            ```
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
