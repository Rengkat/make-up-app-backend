# Fullybeauty Backend

This repository contains the backend implementation for **Fullybeauty**, a web application for booking massage and makeup sessions and purchasing related tools and products. The backend handles user authentication, service booking, product management, and order processing.

## Features

The backend provides the following functionality:
- **Authentication**: Secure user login and registration using JWT.
- **Service Booking**: APIs for booking massage and makeup sessions (home service or spa).
- **Product Management**: APIs for managing the product catalog (CRUD operations).
- **Cart and Order Management**: Add items to cart, place orders, and manage order statuses.
- **Image Management**: Integrates Cloudinary for uploading and managing product images.
- **User Profiles**: Manage user details, addresses, and order history.

### Structure
- **Controllers**: Handles the business logic for various features.
- **Models**: Defines MongoDB schemas using Mongoose.
- **Routers**: Defines API routes for user, product, booking, and order functionalities.
- **Middlewares**: Handles JWT authentication, error handling, and request validation.
- **Customized Errors**: Provides a centralized mechanism for managing and throwing meaningful error messages.

## Technology Stack

The backend was built using:
- **Node.js**: JavaScript runtime for building scalable backend applications.
- **Express.js**: Web framework for creating RESTful APIs.
- **MongoDB**: NoSQL database for persisting application data.
- **Mongoose**: ODM library for MongoDB to define schemas and interact with the database.
- **Cloudinary**: For image upload, storage, and management.
- **JWT**: For secure user authentication and session management.

## Development

To run the project locally, use the following steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
