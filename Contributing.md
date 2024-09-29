# Contributing to daccotta 🎬

Welcome! We're excited that you're interested in contributing to **Daccotta**, a social network for movie lovers. Whether you're here to improve the frontend or work on the entire project, your contributions are invaluable to us. Please read through this guide before making any contributions to ensure a smooth and efficient workflow.

## Table of Contents

-   [Code of Conduct](#code-of-conduct)
-   [How to Contribute](#how-to-contribute)
    -   [Frontend Only](#frontend-only)
    -   [Full-Stack](#full-stack)
-   [Branching Strategy](#branching-strategy)
-   [Pull Request Guidelines](#pull-request-guidelines)
-   [Issue Tracking and Assignment](#issue-tracking-and-assignment)

-   [Code Style](#code-style)
-   [Setup Instructions](#setup-instructions)
-   [Need Help?](#need-help)

## Code of Conduct

Before contributing, please ensure that you adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md) to foster a positive and inclusive environment.

## How to Contribute

You have two ways to contribute:

### 1. Frontend Only

If you wish to contribute **only to the frontend**, you don't need to set up Firebase or MongoDB.

1. **Pull the latest changes from the `dev` branch**:
    ```bash
    git pull origin dev
    ```
2. **Firebase Configuration**:  
   Enter the Firebase config in `firebase.ts` provided by us , its a test account.
3. **API URL Configuration**:  
   Set the backend URL in your environment file:
    ```bash
    VITE_API_BASE_URL= https://mock-backend-32tp.onrender.com
    ```
4. **Install dependencies and run the frontend**:  
   Follow the steps in the [README](./README.md) to install dependencies and run the frontend.

### 2. Full-Stack Contribution

For full project contribution, you need to set up both the frontend and backend. for detailed guide refer to [README](./README.md).

1. **Pull the latest changes from the `dev` branch**:
    ```bash
    git pull origin dev
    ```
2. **Set up Firebase**:
    - Create a Firebase project and retrieve the Firebase config.
    - Add the config to `firebaseConfig.ts`.
3. **Set up MongoDB**:
    - Create an account on [MongoDB Atlas](https://www.mongodb.com/atlas/database).
    - Set up your cluster and database.
    - Add your MongoDB connection string to the environment variables:
        ```bash
        MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/daccotta?retryWrites=true&w=majority
        ```
4. **Install dependencies**:  
   Follow the steps in the [README](./README.md) for both frontend and backend setup.

## Branching Strategy

Please follow the branching strategy to maintain consistency:

-   **Working on an existing issue**:
    1. Ensure the issue is assigned to you before starting work.
    2. Pull the latest `dev` branch.
    3. Create a new branch with the issue number in the format `issue/issue-number-description`, for example:
        ```bash
        git checkout -b issue/42-fix-login
        ```
-   **Creating a new feature**:
    1. Pull the latest `dev` branch.
    2. Create a branch with the feature name in the format `feat/feature-name`, for example:
        ```bash
        git checkout -b feat/group-creation
        ```

## Pull Request Guidelines

To ensure smooth collaboration, please follow these guidelines when submitting a Pull Request (PR):

1. **PR Title**: Use a clear and concise title.  
   E.g., `Fix login authentication issue` or `Add group creation feature`.
2. **Description**: Provide a detailed description of what your PR does. Link to the related issue if applicable.
3. **PR Reviews**: At least one reviewer must approve your PR before it is merged.
4. **Passing CI Checks**: Ensure that all Continuous Integration (CI) checks pass before requesting a review.
5. **Merge Target**: Always target the `dev` branch for your PRs.

## Issue Tracking and Assignment

-   Before starting work on an issue, ensure it’s **assigned to you**. If an issue is not assigned, leave a comment expressing your interest, and wait for it to be assigned.
-   If you want to propose a new feature or enhancement, feel free to open a new issue with the tag `enhancement`.

## Code Style

To maintain code consistency across the project, please adhere to the following:

-   **Frontend**: use [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to format your code.

Run the lint checks before pushing your changes:

```bash
npm run lint
```

## Setup Instructions

For detailed setup instructions, please refer to our [README](./README.md).

### Frontend Setup

-   Install dependencies using Bun.
-   Set environment variables for Firebase and API endpoints.

### Backend Setup

-   Install Bun and dependencies.
-   Configure MongoDB and Firebase settings in your `.env` file.

For more details, check out the [README](./README.md).

## Need Help?

If you have any questions or need further assistance, feel free to:

-   Open a new issue.
-   Join our community discussion by leaving a comment in our issues or PRs.

---

Thank you for contributing to **Daccotta**! We appreciate your time and effort to make this platform even better for movie lovers around the world. 🎥🍿

---
