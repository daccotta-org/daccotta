# 🌟 **Daccotta** 🌟

**A Social Network for Movie Lovers**

Hey movie lovers! Welcome to **Daccotta**, a web app designed to simplify your movie-watching experience and make it easy to share your favorite films with friends. Think of us as your go-to social network for everything movies! 🎥🍿

**Love it?** 👉 _Don't forget to star this repo!_ 🌟

---

![daccotta](https://github.com/user-attachments/assets/120ce0eb-7009-448c-a5da-f4b7432db6e0)

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

### Backend Setup with Bun

**Bun** is a fast all-in-one JavaScript runtime we use to manage the backend.

#### Installing Bun

##### For macOS:

1. Open your terminal.
2. Run the following command to install Bun:
    ```bash
    curl -fsSL https://bun.sh/install | bash -s "bun-v1.1.27"

    ```
3. Restart all your terminals after installing bun.
#### For Windows:

To install, paste this into a powershell(run powershell as adminstrator):

```bash
powershell -c "irm bun.sh/install.ps1|iex"
```

or paste this

```bash
npm install -g bun
```
Restart all your terminals after installing bun.
---

### 🗂️ Setting Up Daccotta (Client & Server)

refer to .env.example files for env variables

1.  Clone the repository to your local machine:
    ```bash
    git clone https://github.com/daccotta-org/daccotta.git
    ```
2.  Navigate to the project directory:

    ```bash
    cd daccotta
    ```

3.  Install dependencies for both the client and server:

    -   Go to the **client** folder:
        ```bash
        cd client
        bun i
        ```
    -   Now go to the **server** folder:
        ```bash
        cd ../server
        bun i
        ```

4.  **Setting Up MongoDB Atlas**:

    -   Visit the [MongoDB Atlas website](https://www.mongodb.com/cloud/atlas) and sign up for an account.
    -   After logging in, create a new project, then click on **Build a Cluster** to set up a free-tier cluster.
    -   Once your cluster is ready, click **Connect**, then choose **Connect your application**.
    -   Copy the connection string provided. It will look something like this:
        ```bash
        mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
        ```
    -   Replace `<username>`, `<password>`, and `myFirstDatabase` with your actual MongoDB Atlas username, password, and the database name you wish to use.
    -   Set the `MONGO_URL` in your project's `.env` file with the copied connection string:
        ```bash
        MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/daccotta?retryWrites=true&w=majority
        ```

5.  **Setting Up Firebase**:

    -   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    -   After setting up, download the `firebaseConfig` and add it to your project.
    -   Set the Firebase credentials in your `firebaseConfigEx.ts` file and rename it `firebaseConfig.ts`:

    ```javascript
    export const firebaseConfig = {
        apiKey: import.meta.env.VITE_API_KEY,
        authDomain: import.meta.env.VITE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_APP_ID,
    }
    ```

    if you want to contribute to only fronted use this mock firebase-auth keys:

        apiKey: "AIzaSyDp5LFFF9TU9W1LzB0Cus--lxBawNyBc5Q",
        authDomain: "mock-daccotta.firebaseapp.com",
        projectId: "mock-daccotta",
        storageBucket: "mock-daccotta.appspot.com",
        messagingSenderId: "586345450139",
        appId: "1:586345450139:web:84f82ab90882cd0fe4143e",

6.  **Running the Project**:

    -   Return to the root directory:
        ```bash
        cd ..
        ```
    -   Install all dependencies at the root level:
        ```bash
        bun i
        ```
    -   Start both frontend and backend with:
        ```bash
        bun start:all
        ```

7.  Your app should now be running! 🎉 Open your browser and go to `http://localhost:5173`.

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
