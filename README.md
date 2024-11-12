
# RESTful Blog API

A RESTful API for managing blog posts and comments, allowing users to create, read, update, and delete blog posts and manage comments on posts. Built with Node.js, Express, MongoDB, and JWT for secure authentication.

## Features

- User authentication with JWT
- CRUD operations for blog posts
- Commenting system for blog posts
- Modular and scalable code structure
- Middleware for error handling and authentication

## Technologies Used

- **Node.js**: Server-side JavaScript runtime
- **Express**: Web framework for building RESTful APIs
- **MongoDB**: NoSQL database for data storage
- **JWT**: JSON Web Tokens for secure user authentication

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### MongoDB Atlas Setup Guide

1. **Create a MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up or log in.
   - After logging in, click **Build a Database**.

2. **Create a Cluster**:
   - Select a cloud provider and region for your cluster (choose the free tier for a free database).
   - Configure your cluster settings as needed and click **Create Cluster**.

3. **Create a Database User**:
   - Navigate to **Database Access** in the left sidebar.
   - Click **Add New Database User**.
   - Set up a username and password for this user and ensure they have **read and write** access.
   - Note the username and password; you’ll use these in your connection string.

4. **Configure Network Access**:
   - Go to **Network Access** in the left sidebar.
   - Click **Add IP Address** and either:
     - Click **Allow Access from Anywhere** (suitable for development) or
     - Add your IP address if you prefer restricted access.
   - Save changes to enable access.

5. **Get Your Connection String**:
   - Go to **Clusters** in the left sidebar, and click **Connect** for your cluster.
   - Choose **Connect your application** and copy the connection string.
   - Replace `<username>` and `<password>` with your database user's credentials.
   - Replace `<dbname>` with the name of your database.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/md-shahid-ansari/RESTful-Blog.git
   ```

2. Navigate to the project directory:

   ```bash
   cd RESTful-Blog
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:

   ```plaintext
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV = development 
   CLIENT_URL = http://localhost:3000
   EMAIL = you_email
   EMAIL_PASSWORD = password for email (app)
   ```

5. Start the server:

   ```bash
   npm start or npm run dev
   ```

   The server will run on `http://localhost:5000`.

## API Endpoints

### Authentication

#### Register a New User

- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user
- **Request Body**:

  ```json
  {
    "username": "user123",
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```

- **Response**:

  ```json
  {
    "success": true,
    "message": "User registered successfully. Verification email sent.",
    "user":{...}
  }
  ```
  **and**
- **Endpoint**: `POST /api/auth/verify`
- **Description**: Verify email of a new user using code sent to the email
- **Request Body**:

  ```json
  {
    "code":"code_recieved_on_email"
  }
  ```

- **Response**:

  ```json
  {
    "success": true,
    "message": "User verified successfully",
    "user":{...}
  }
  ```

#### Login a User

- **Endpoint**: `POST /api/auth/login`
- **Description**: Login user and receive a JWT token
- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
  **or**
  ```json
  {
    "username": "username",
    "password": "yourpassword"
  }
  ```

- **Response**:

  ```json
  {
    "success": true,
    "message": "User logged in successfully",
    "user": {...},
    "userToken": "token_saved_in_the_cookie"
  }
  ```


#### Forgot Password

- **Endpoint**: `POST /api/auth/forgot`
- **Description**: Forgot password
- **Request Body**:

  ```json
  {
    "email": "user@example.com",
  }
  ```
  **or**
  ```json
  {
    "username": "username",
  }
  ```

- **Response**:

  ```json
  {
    "success": true,
    "message": "Reset token sent successfully on your registered email!"
  }
  ```

#### New password

- **Endpoint**: `POST /api/auth/reset`
- **Description**: Enter new password
- **Request Body**:

  ```json
  {
    "token":"token_recieved_on_email",
    "password":"yournewpassword"
  }
  ```

- **Response**:

  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```
  
#### Logout

- **Endpoint**: `POST /api/auth/logout`
- **Description**: Logout, it wil delete userToken
- **Response**:

  ```json
  {
    "success": true,
    "message": "Logout successfully",
    "userToken": "token_deleted_from_the_cookie"
  }
  ```



### Blog Posts

#### Create a Blog Post

- **Endpoint**: `POST /api/posts`
- **Description**: Create a new blog post
- **Headers**:

  ```plaintext
  Authorization: Bearer your_jwt_token
  ```

- **Request Body**:

  ```json
  {
    "title": "My First Blog",
    "content": "This is the content of my first blog post.",
  }
  ```

- **Response**:

  ```json
  {
    "success": true,
    "post": {...}
  }
  ```

#### Retrieve All Blog Posts

- **Endpoint**: `GET /api/posts`
- **Description**: Retrieve a list of all blog posts
- **Response**:

  ```json
  {
    "success": true,
    "posts": [...]
  }
  ```

#### Retrive Single a Blog Post

- **Endpoint**: `GET /api/posts/:id`
- **Description**: Retrive single blog post
- **Headers**:

  ```plaintext
  Authorization: Bearer your_jwt_token
  ```

- **Response**:

  ```json
  {
    "success": true,
    "post": {...}
  }
  ```

#### Update a Blog Post

- **Endpoint**: `PUT /api/posts/:id`
- **Description**: Update an existing blog post
- **Headers**:

  ```plaintext
  Authorization: Bearer your_jwt_token
  ```

- **Request Body**:

  ```json
  {
    "title": "Updated Blog Title",
    "content": "Updated content"
  }
  ```

- **Response**:

  ```json
  {
    "success": true,
    "post": {...}
  }
  ```

#### Delete a Blog Post

- **Endpoint**: `DELETE /api/posts/:id`
- **Description**: Delete a blog post
- **Headers**:

  ```plaintext
  Authorization: Bearer your_jwt_token
  ```

- **Response**:

  ```json
  {
    "message": "Post deleted successfully"
  }
  ```

### Comments

#### Add a Comment

- **Endpoint**: `POST /api/comments`
- **Description**: Add a comment to a specific blog post
- **Headers**:

  ```plaintext
  Authorization: Bearer your_jwt_token
  ```

- **Request Body**:

  ```json
  {
    "post_id": "6732fc15c399f5ea87328059",
    "content": "This is a comment on the blog post."
  }
  ```

- **Response**:

  ```json
  {
    "success": true,
    "comment": {...}
  }
  ```

#### Retrive All Comment

- **Endpoint**: `GET /api/comments?post_id=post_id`
- **Description**: Retrive all comments of specific post
- **Headers**:

  ```plaintext
  Authorization: Bearer your_jwt_token
  ```

- **Response**:

  ```json
  {
    "success": true,
    "comments": [...]
  }
  ```


  #### Retrive specific comment

- **Endpoint**: `GET /api/comments/:id`
- **Description**: read specific comment using comment id
- **Headers**:

  ```plaintext
  Authorization: Bearer your_jwt_token
  ```

- **Response**:

  ```json
  {
    "success": true,
    "comment": {...}
  }
  ```

  #### Update a comment

- **Endpoint**: `PUT /api/comments`
- **Description**: Add a comment to a specific blog post
- **Headers**:

  ```plaintext
  Authorization: Bearer your_jwt_token
  ```

- **Request Body**:

  ```json
  {
    "content": "This is an updated comment on a blog post."
  }
  ```

- **Response**:

  ```json
  {
    "success": true,
    "comment": {...}
  }
  ```

#### Delete a Comment

- **Endpoint**: `DELETE /api/comments/:id`
- **Description**: Delete a specific comment from a blog post
- **Headers**:

  ```plaintext
  Authorization: Bearer your_jwt_token
  ```

- **Response**:

  ```json
  {
    "success": true,
    "message": "Comment deleted successfully"
  }
  ```

## Error Handling

All error responses follow a consistent structure:

```json
{
  "error": "Error message explaining what went wrong"
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
