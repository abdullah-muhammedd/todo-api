# TODO App Backend API

## Table of Contents

-   [Introduction](#introduction)
-   [Purpose](#purpose)
-   [Project Structure](#project-structure)
-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Running the Application](#running-the-application)
-   [Testing](#testing)
-   [Security Measures Implemented](#security-measures-implemented)
-   [Error Handling](#error-handling)
-   [Validation](#validation)
-   [Logging](#logging)
-   [Documentation](#documentation)
-   [License](#license)

# Introduction

Welcome to my TODO App Backend API training project! This project is a playground for me to learn and experiment with backend development, specifically focused on creating a robust and scalable API. 

This API is used to develope ![todo-react-app](https://github.com/abdullah-muhammedd/todo-react-app.git) so that you can see it working

# Purpose

The primary goal of this project is to enhance my skills in backend development, particularly in TypeScript and best practices for building APIs. By working on this training project, I aim to gain hands-on experience in:

-   Designing a structured project with versioning support.
-   Learning REST APIs best practices.
-   Implementing robust security measures, including authentication and encryption.
-   Crafting meaningful and reusable error handling mechanisms.
-   Validating input data effectively.
-   Structuring a logging system for maintainability.

# Project Structure

-   `eslint`, `prettier`, `tsconfig`, `nodemon`, `jest` - Configuration files for linting, formatting, TypeScript, nodemon, and Jest.
-   `src/`
    -   `app.js` - Entry point of the application.
    -   `server.js` - Server setup and initialization.
    -   `v1.0.0/` - API versioning folder containing:
        -   `router/` - API route definitions.
        -   `controller/` - Business logic and request handling.
        -   `services/` - Services layer for application logic that adds an extra layer of abstraction, providing controllers and other entities with CRUD services over models.
        -   `model/` - Data models and database interactions.
        -   `test/` - Unit tests that validate validation rules and services.
            **Note: These unit tests focus on individual components and test them separately to maintain simplicity and avoid excessive mocking. Controllers and endpoints are tested against real requests using Postman or similar tools to ensure comprehensive functionality.**
        -   `utility/` - Utilities folder containing:
            -   `encryption/` - Password encryption and decryption utilities.
            -   `jwt/` - JWT tokens creation, verification, and renewal functionality.
            -   `error/` - Custom reusable error classes to maintain consistency.
            -   `validation/` - Validation schemas using `Joi`.
            -   `logger/` - Logger creation and structure using `winston`.

# Installation

To Use this code on your local machine start with cloning the project repository

```bash
git clone https://github.com/abdullah-muhammedd/todo-api.git
```

Then run the next command to install dependencies

```bash

npm install

```

# Configuration

Before running the app you need to configure the environment variables, the needed variables mentioned in the next code snippet

```bash
# Create a .env file and configure the following variables
PORT= 3000

DB_CONNECTION_STRING= "mongodb://localhost:27017/todo-app"
TESTING_DB_CONNECTION_STRING= "mongodb://localhost:27017/todo-app-testing"

ACCESS_TOKEN_SECRET="9N#yP6zD!mT8wX5kA1rE7qV3jU0gB2fS"
ACCESS_TOKEN_LIFE="1d"
REFRESH_TOKEN_SECRET="4F^vG6hS@xW2cD1jB9mR3tZ8kL7pQ0w"
REFRESH_TOKEN_LIFE="30d"

SIGNED_COOKIES_SECRET="wS#7zYR@kL6bP4fX1mV9gD3qU8oA2cE"
LOG_LEVEL= "info"

```

# Running the Application

Now you can run the application using the next command in development mode

```bash
# run without build depending on ts-node & nodemon
npm run dev

# build & run in dev mode
# you will need to change the dev script to run the destination server not the source
npm run workflow
```

Or to run in regular/production mode you can build and run the code using the next command

```bash
#build the code
npm run build
# Start the server
npm start

```

# Testing

-   As Mentioned Before Unit tests only focused on separate units that are written from scratch or not depends on 3rd party well tested dependencies
-   They do not tests controllers to avoid over complexity instead `postman`is used to send real requests and ensure functionalities
-   Theses unit tests focuses on `services layer` and `validation layer`
-   To run the tests make sure you are providing a valid and working testing database connection string in the environment variables, then run the next command

```bash
# Run tests
npm test

```

# Security Measures Implemented:

1. **Secure User Password Encryption (bcryptjs):** User passwords are securely hashed using bcryptjs, ensuring that sensitive user data remains protected.
2. **Stateless Authentication Method:**
    - **User Login:** Users can log in with either their email or username along with their password.
    - **Cookie-Based Tokens:** Upon successful login, the user is issued three cookies:
        - A short-lived `access_token`
        - A long-lived `refresh_token`
        - A `token_exists` cookie to allwo client to check the login status 
    - **Token Validation:** For each subsequent request, the `access_token` is validated to confirm the user's credentials.
    - **Token Expiry Handling:** If the `access_token` has expired, the system checks the validity of the `refresh_token`. If the `refresh_token` is valid, a new `access_token` is issued with the upcoming response.
    - **Double Layer Token Security:** Tokens cannot be generated outside of the server because the secrets of both the `access_token` and `refresh_token` are extremely hard to guess. Furthermore, these tokens are distinct from each other, enhancing security.
    - **Additional Cookie Security:** Cookies are secured using signed and HTTP-only settings, along with unique, hard-to-guess secrets.

# Authorization Mechanism:

An authorization mechanism is also implemented to ensure that users can only interact with the entities (e.g., tasks, lists) they have created. This means that users are authorized to perform CRUD (Create, Read, Update, Delete) operations only on their own data. This additional layer of security prevents unauthorized access or manipulation of data owned by other users.

# Error Handling

### Error Handling Structure

For client-friendly error handling, all errors follow a standardized format, which includes the following fields in JSON format:

```json
"error": {
    "message": "string",
    "statusCode": xxx,
    "errorCode": xxxx,
    "name": "string",
    "isOperational": "boolean",
    "timeStamp": "date/time"
}

```

-   `message`: A human-readable error message that describes the issue.
-   `statusCode`: The HTTP status code associated with the error.
-   `errorCode`: A unique error code for reference.
-   `name`: A string identifying the type or category of the error.
-   `isOperational`: A boolean indicating whether the error is operational (caused by the server or unhandled exceptions) or no.
-   `timeStamp`: The date and time when the error occurred.

### Reusable Error Classes

You've introduced three types of reusable error classes to maintain consistency in error handling:

1. **`OperationalError`:**
    - Indicates internal server errors.
    - These errors typically result from unexpected or exceptional situations within the server.
    - Example scenarios might include database connection errors or unexpected runtime exceptions.
    - Operational errors are marked as `isOperational: true`.
2. **`ValidationError`:**
    - Indicates validation errors, whether they are caused by user input or occur during other validation steps.
    - Common scenarios include input validation errors (e.g., invalid email format) and validation errors related to specific business rules.
    - These errors help ensure data integrity and consistency.
    - Validation Error instances can be distinguished by `isOperational: false`.
3. **`AuthenticationError`:**
    - Indicates authentication and authorization errors.
    - Authentication errors typically occur during login or token validation processes when users provide incorrect credentials.
    - Authorization errors may arise when users attempt to access resources or perform actions they are not authorized for.
    - These errors help maintain security and user access control.
    - Authentication and Authorization errors are marked as `isOperational: false` .

# Validation

### User Input Validation

1. **Joi Validation Schemas:**
    - User input is validated against well-tested Joi validation schemas.
    - Each entity and scenario has its own validation rules, which allows for fine-grained control over input validation.
2. **Client-Friendly Error Messages:**
    - Client-friendly error messages are designed to provide clients with informative and actionable validation error messages.
    - This user-friendly approach ensures that clients can quickly understand what went wrong and how to correct their input.
3. **Custom Validation Rules:**
    - Validation rules are tailored to each specific entity and use case, which helps maintain data quality and consistency.

### Database Validation

1. **Database.js File:**
    - The `database.js` file contains repeated checks that validate the success of database operations.
    - These checks are crucial to ensuring the reliability of database interactions.
2. **Common Database Validation Operations:**
    - The database validation operations include:
        - Validating incoming IDs to ensure they are valid MongoDB IDs.
        - Verifying that query results are not null, indicating a successful query.
        - Confirming that entity updates or deletions are successful.
        - Checking for MongoDB unique index errors, which can help diagnose specific issues.
        - Verifying that the provided user ID matches the rightful owner of the entity.
3. **Reusable and DRY Code:**
    - All these validation operations are designed in a reusable manner to avoid code repetition and complexity.
    - This approach simplifies code maintenance and ensures that validation logic remains consistent throughout the application.

# Logging

### Logging Levels:

-   **Error Level:**
    -   Reserved for logging internal errors within the server.
    -   Used to capture critical issues and exceptions that require immediate attention.
-   **Info Level:**
    -   Used to log all errors that leave the server.
    -   Provides a comprehensive record of events and errors in the application.

### Log File Naming Convention:

-   Log files are named based on their log levels and dates.
-   The format for log file names is `[level]-[date].log`.

### Log File Rotation:

-   utilize the `winston-daily-rotated` file transport to manage log file rotation.
-   Log files are changed daily, which helps organize logs by date.
-   Older log files, which are older than 14 days, are automatically deleted.
-   This approach ensures that log files are well-maintained and that disk space is managed efficiently.

### Log Message Format:

-   Each log message is formatted as follows:
    -   `timestamp [level]: message;`
    -   This format provides essential information about when the log entry was created, the log level (error or info), and the associated message.

### Handling Rejected Promises and Unhandled Exceptions:

-   Configured `winston` to log rejected promises and unhandled exceptions to separate log files.
-   This practice helps in identifying and addressing issues that might otherwise go unnoticed.

# Documentation

Here I provided a detailed explanation for different endpoints, request format, response format, error format.
You can find it here [LINK](https://fluttering-turkey-fba.notion.site/TODO-APP-API-Documentation-04434e828aaa4718b831172cde7d95b0)

# License

This project is licensed under the [MIT Open Source](https://opensource.org/license/mit/) License.
