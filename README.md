# Career Counseling Assistant Documentation

Welcome to the Career Counseling Assistant! This assistant is designed to help users explore their interests, assess their skills, and provide career guidance. Below is a comprehensive guide to using the different features and functionalities of the assistant.


## Setting Up

### Installation
To run the Career Counseling Assistant locally, make sure you have Node.js installed on your machine. Follow these steps:

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Move to backend and install dependencies:
```bash
cd backend
npm install
```

3. Create a .env file in the project root and add your OpenAI API key:
```bash
OPENAI_API_KEY=your-api-key
MONGO_URL=your-mongodb-url
PORT=5000
```

4. Start the server
```bash
npm start
```

5. Move to frontend folder, and install dependencies.
```bash
cd frontend
npm install 
```

6. Run vite server
```bash
npm run dev
```

## API Endpoints

### User operations
**1. Create User**
- Endpoint: POST /api/users/create
- Request Body:
```bash 
{
    "userId": "uniqueUserId"
}
```
- Response:
```bash 
{
    "userId": "uniqueUserId"
}
```

For frontend store the username in userId key, on the browser.
```bash
localStorage.setItem('userId', 'unique name')
```

**2. Get User Information**
- Endpoint: GET /api/users/:userId
- Response:
```bash 
{
    "userId": "uniqueUserId"
}
```

**3. List All Users**
- Endpoint: GET /api/users
- Response:
```bash 
{
    "users": [ 
    {"userId": "user1"}, 
    {"userId": "user2"}, ... ]
}
```

**4.  Delete User**
- Endpoint: DELETE /api/users/delete/:userId
- Response:
```bash 
{
    "success": true,
    "message": "User deleted successfully"
}
```

### Thread operations
**1. Create Thread for User**
- Endpoint: POST /api/thread/create
- Request Body:
```bash 
{
    "userId": "uniqueUserId"
}
```
- Response:
```bash 
{
    "status": "success",
    "message": "Thread created successfully",
    "threadId": "uniqueThreadId",
    "updatedUser": { /* Updated User Object */ }
}
```

**2. Get Threads for User**
- Endpoint: GET /api/thread/:userId
- Response:
```bash 
{
    "threadId": [
        "threadId1", 
        "threadId2", ...
    ]
}
```

**2. Delete Threads for User**
- Endpoint: DELETE /api/thread/delete/:userId/:threadId
- Response:
```bash 
{
    "status": "success",
    "message": "Thread deleted successfully",
    "userId": "uniqueUserId",
    "threadId": "uniqueThreadId"
}
```

### Message operations
**1. Create Message in Thread**
- Endpoint: POST /api/message/create
- Request Body:
```bash 
{
    "userId": "uniqueUserId",
    "threadId": "uniqueThreadId",
    "prompt": "User's message or prompt"
}
```
- Response:
```bash 
{
    "success": true,
    "response": { /* Message details */ }
}
```

**2. Get All Messages in Thread**
- Endpoint: GET /api/message/getAll/:userId/:threadId
- Response:
```bash 
{
    "status": "success",
    "messagesList": [ /* Array of messages in the thread */ ]
}
```

## Additional Information
- LinkedIn Jobs Scraper
The assistant includes a tool to query LinkedIn jobs. The function getLinkedInJobs can be used in the assistant. Modify the queryOptions object inside the function to customize the job search criteria.

## Links and resources
- [OpenAI documentation](https://platform.openai.com/docs/assistants/overview)


- [Function calling](https://mer.vin/2023/11/assistants-api-function-calling-in-node-js/)

- [LinkedIn jobs(npm package)](https://www.npmjs.com/package/linkedin-jobs-api)


## Remaining work
- Some issues with modular structure of backend, so keeping the code in ./backend/index.js for workability.
- Timeout issue when real-time jobs are fetched from assistant. After refresh of page the chat is visible.
- Need to work on making a dynamic timeout.
- Formatted output for function response.