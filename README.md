# 🌟 **Daccotta** 🌟

**A Social Network for Movie Lovers**

Hey movie lovers! Welcome to **Daccotta**, a web app designed to simplify your movie-watching experience and make it easy to share your favorite films with friends. Think of us as your go-to social network for everything movies! 🎥🍿

**Love it?** 👉 _Don't forget to star this repo!_ 🌟

---

![daccotta](https://github.com/user-attachments/assets/120ce0eb-7009-448c-a5da-f4b7432db6e0)
also be a part of the community and join our [discord](https://discord.gg/R859peEW) .

## 🎬 What is Daccotta?

Daccotta is a platform built for film enthusiasts to discover, and showcase their taste in movies with like-minded individuals.
You can create your own lists, add journal entries of the movies you have watched and get recommendations on the basis of your lists and journal entries. Daccotta a community that brings people together through a shared love of cinema.

---

## 🔑 Key Features

1. **🎞️ List Creation**: Create and manage your own movie lists.
2. **📖 Movie Journals**: Keep a personalized journal entry for every movie you watch.
3. **📊 User Stats**: Get insights into your movie-watching habits.
4. **🤖 personalized reccomendations**: Get personalized reccomendations based on your movie watching habits.

#### **Coming Soon**:

5. **👥 Group Creation**: Form groups with friends to compare and share your movie stats.
6. **📈 Group Stats**: View combined statistics and trends of your movie-watching groups.

---

## 🛠️ Tech Stack

Daccotta is built using a modern and efficient tech stack to provide the best experience for users:

-   **Frontend**: React.js
-   **Styling**: TailwindCSS + [shadcn](https://shadcn.dev/) etc.
-   **Data Fetching & State Management**: [TanStack Query](https://tanstack.com/query) + axios.
-   **Backend**: Bun + express
-   **Database**: MongoDB Atlas (Cloud)
-   **Authentication**: Firebase

---

## 🚀 Getting Started

To set up and run **Daccotta** locally, follow the steps below:

### 🗂️ Setting Up Daccotta Repository

1.  Clone the repository to your local machine:
    ```bash
    git clone https://github.com/daccotta-org/daccotta.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd daccotta
    ```

### Installing Bun

**Bun** is a fast all-in-one JavaScript runtime we use to manage both the frontend and backend. You'll need to install Bun before proceeding with any setup.

#### For macOS:

1. Open your terminal.
2. Run the following command to install Bun:

    ```bash
    curl -fsSL https://bun.sh/install | bash -s "bun-v1.1.27"
    ```

3. Restart all your terminals after installing bun.

#### For Windows:

To install, paste this into a powershell (run powershell as administrator):

```bash
powershell -c "irm bun.sh/install.ps1|iex"
```

or paste this

```bash
npm install -g bun
```

**Restart all your terminals after installing bun inclduing vscode.**

### 🖥️ Frontend-Only Setup

If you only want to contribute to the frontend, follow these steps:

1. Navigate to the client folder:

    ```bash
    cd client
    ```

2. Install dependencies:

    ```bash
    bun i
    ```

3. Create a `.env` file in the `client` directory and paste the following content:

    ```
    VITE_ACCESS_KEY= "your tmdb key"
    VITE_API_KEY=AIzaSyDp5LFFF9TU9W1LzB0Cus--lxBawNyBc5Q
    VITE_AUTH_DOMAIN=mock-daccotta.firebaseapp.com
    VITE_PROJECT_ID=mock-daccotta
    VITE_STORAGE_BUCKET=mock-daccotta.appspot.com
    VITE_MESSAGING_SENDER_ID=586345450139
    VITE_APP_ID=1:586345450139:web:84f82ab90882cd0fe4143e
    VITE_API_BASE_URL=https://daccotta-5loj.onrender.com
    ```

4. You still need to setup your tmdb account and get an API key from them , its free and takes just 5 mins. refer to their [docs](https://developer.themoviedb.org/docs/getting-started). if you still face any issues contact to the maintainers of the repo we may be able to provide you with a test key.

5. Start the frontend development server:

    ```bash
    bun run dev
    ```

6. Your frontend should now be running at `http://localhost:5173`.

#### Test Account Credentials

You can use the following test account to log in:

-   Email: test1@gmail.com
-   Password: 12345678

### 🗂️ Setting Up Full Stack Daccotta (Client & Server)

If you're setting up the full stack, continue with these steps:

refer to .env.example files for env variables

1. Install dependencies for the server:

    ```bash
    cd ../server
    bun i
    ```

2. **Setting Up MongoDB Atlas**:

    - Visit the [MongoDB Atlas website](https://www.mongodb.com/cloud/atlas) and sign up for an account.
    - After logging in, create a new project, then click on **Build a Cluster** to set up a free-tier cluster.
    - Once your cluster is ready, click **Connect**, then choose **Connect your application**.
    - Copy the connection string provided. It will look something like this:
        ```bash
        mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
        ```
    - Replace `<username>`, `<password>`, and `myFirstDatabase` with your actual MongoDB Atlas username, password, and the database name you wish to use.
    - Set the `MONGO_URL` in your project's `.env` file with the copied connection string:
        ```bash
        MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/daccotta?retryWrites=true&w=majority
        ```

3. **Setting Up Firebase**:

    - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project. for sign in providers select - email/password.
    - After registering your Node.js app, Firebase will provide your app's configuration object code. This code includes your API keys and other project-specific details.
        ![image](https://github.com/user-attachments/assets/59ae730b-01da-440a-8e31-6d9aecb4b2b9)

     - Set the Firebase credentials in your `client/.env` file as above , refer to .env.example.:

       ```
       VITE_ACCESS_KEY= "your tmdb key"
        VITE_API_KEY=
        VITE_AUTH_DOMAIN=
        VITE_PROJECT_ID=
        VITE_STORAGE_BUCKET=
        VITE_MESSAGING_SENDER_ID=
        VITE_APP_ID=
        VITE_API_BASE_URL=https://localhost:8080
        ```
 - After setting up, To access the service account, head over to your Firebase console, click on the Settings icon in the top-left corner of the developer console, and         select Project Settings. Then, select the Service Account tab, and click on Generate new private key, place it in your server folder.
      ![image](https://github.com/user-attachments/assets/085081d6-3eb1-4018-99ad-cfcf8c7d1a83)

5. **Running the Full Stack Project**:

    - Return to the root directory:
        ```bash
        cd ..
        ```
    - Install all dependencies at the root level:
        ```bash
        bun i
        ```
    - Start both frontend and backend with:
        ```bash
        bun start:all
        ```

6. Your full stack app should now be running! 🎉 Open your browser and go to `http://localhost:5173`.

---

## 🤝 Contributing

We'd love your help to make **Daccotta** even better! If you're interested in contributing, please read [CONTRIBUTION GUIDE](./CONTRIBUTING.md).

---

## 📧 Contact

Feel free to reach out to us for any queries or suggestions:  
**Email**: daccotta.pvt@gmail.com
**Website**: [daccotta.com](https://daccotta.com)

---

## ⚠️ Attribution

Daccotta uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.

---

**Made with ❤️ by movie lovers for movie lovers!**

---
