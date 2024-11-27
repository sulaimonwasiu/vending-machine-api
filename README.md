# Vending Machine API

## Overview

This Vending Machine API allows users to manage products and make purchases based on their role. Sellers can add, update, or remove products, while buyers can deposit coins and purchase items. The vending machine only accepts coins in denominations of 5, 10, 20, 50, and 100 cents.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Product Management](#product-management)
  - [Deposits and Purchases](#deposits-and-purchases)
- [Data Models](#data-models)
- [Edge Cases](#edge-cases)
- [Testing](#testing)
- [License](#license)

## Features

- RESTful API consuming and producing `application/json`
- Role-based access control for users (sellers and buyers)
- CRUD operations for users and products
- Coin deposit functionality with specified denominations
- Purchase functionality with appropriate change calculation
- Reset functionality for buyer deposits

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd vending-machine-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (e.g., for database connection, JWT secret):

   ```bash
   cp .env.example .env
   ```

4. Start the server:

   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- **POST /login**
  - Authenticates users and returns a JWT token.

### User Management

- **POST /user**
  - Create a new user (no authentication required).
  - Request body: 
    ```json
    {
      "username": "string",
      "password": "string",
      "role": "string" // "seller" or "buyer"
    }
    ```

- **GET /user**
  - Retrieve all users (authenticated sellers only).

- **GET /user/:id**
  - Retrieve a user by ID (authenticated sellers only).

- **PUT /user/:id**
  - Update user details (authenticated sellers only).

- **DELETE /user/:id**
  - Delete a user (authenticated sellers only).

### Product Management

- **GET /products**
  - Retrieve all products (available to everyone).

- **POST /products**
  - Create a new product (authenticated sellers only).
  - Request body:
    ```json
    {
      "productName": "string",
      "cost": "integer", // should be a multiple of 5
      "amountAvailable": "integer",
      "sellerId": "string"
    }
    ```

- **PUT /products/:id**
  - Update a product (authenticated sellers only).

- **DELETE /products/:id**
  - Remove a product (authenticated sellers only).

### Deposits and Purchases

- **POST /deposit**
  - Deposit coins (authenticated buyers only).
  - Request body:
    ```json
    {
      "amount": "integer" // must be one of 5, 10, 20, 50, 100
    }
    ```

- **POST /buy**
  - Purchase a product (authenticated buyers only).
  - Request body:
    ```json
    {
      "productId": "string",
      "amount": "integer" // number of products to buy
    }
    ```
  - Response:
    ```json
    {
      "totalSpent": "integer",
      "purchasedProduct": { /* product details */ },
      "change": [5, 10, 20] // array of coins returned as change
    }
    ```

- **POST /reset**
  - Reset the buyer's deposit to 0 (authenticated buyers only).

## Data Models

### User Model

```json
{
  "username": "string",
  "password": "string",
  "deposit": "integer", // current deposit amount
  "role": "string" // "seller" or "buyer"
}
```

### Product Model

```json
{
  "productName": "string",
  "cost": "integer", // multiple of 5
  "amountAvailable": "integer",
  "sellerId": "string"
}
```

## Edge Cases

- Ensure that users cannot deposit invalid coin values.
- Prevent buyers from purchasing multiple different products in a single transaction.
- Handle scenarios where a buyer attempts to buy more products than available.
- Validate user authentication and authorization for all protected routes.

## Project Link
[Project URL](https://mvpmatch.notion.site/Backend-1-9a5476e6cb7848ec9f620ce8a64c0d06)