<div align="center">
<img  src="https://readme-typing-svg.herokuapp.com?color=D700F7&center=true&vCenter=true&size=40&width=900&height=80&lines=Welcome+to+Daccotta"/>
</div>

 <h1>Daccotta 🌟</h1>

**A Social Network for Movie Lovers**

Hey movie lovers! Welcome to **Daccotta**, a web app designed to simplify your movie-watching experience and make it easy to share your favorite films with friends. Think of us as your go-to social network for everything movies! 🎥🍿

**Love it?** 👉 _Don't forget to star this repo!_ 🌟

<table align="center">
    <thead align="center">
        <tr border: 2px;>
            <td><b>🌟 Stars</b></td>
            <td><b>🍴 Forks</b></td>
            <td><b>🐛 Issues</b></td>
            <td><b>🔔 Open PRs</b></td>
            <td><b>🔕 Close PRs</b></td>
        </tr>
     </thead>
    <tbody>
      <tr>
          <td><img alt="Stars" src="https://img.shields.io/github/stars/daccotta-org/daccotta?style=flat&logo=github"/></td>
          <td><img alt="Forks" src="https://img.shields.io/github/forks/daccotta-org/daccotta?style=flat&logo=github"/></td>
          <td><img alt="Issues" src="https://img.shields.io/github/issues/daccotta-org/daccotta?style=flat&logo=github"/></td>
          <td><img alt="Open Pull Requests" src="https://img.shields.io/github/issues-pr/daccotta-org/daccotta?style=flat&logo=github"/></td>
          <td><img alt="Closed Pull Requests" src="https://img.shields.io/github/issues-pr-closed/daccotta-org/daccotta?style=flat&color=critical&logo=github"/></td>
      </tr>
    </tbody>
</table>

---

![daccotta](https://github.com/user-attachments/assets/120ce0eb-7009-448c-a5da-f4b7432db6e0)
also be a part of the community and join our [discord](https://discord.gg/R859peEW) .

<img src="https://raw.githubusercontent.com/alo7lika/daccotta/refs/heads/dev/Images/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="900">

### This project is now OFFICIALLY accepted for <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Heart%20on%20Fire.png" alt="Heart on Fire" width="40" height="40" />

| Name               | Logo                                            | Purpose                                                                                                                              |
| ------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| GSSoC'2024-Extd    | ![GSSoC Logo](Images/GSSoC-Ext.png)             | The coding period is from October 1st to October 30th, during which contributors make contributions and earn points on the platform. |
| Hacktoberfest 2024 | ![Hacktoberfest Logo](Images/hacktoberfest.png) | Hacktoberfest is a month-long October event welcoming all skill levels to join the open-source community.                            |

---

<br>
    
<img src="https://raw.githubusercontent.com/alo7lika/daccotta/refs/heads/dev/Images/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="900">

## 📑 Table of Contents

1. [🎬 What is Daccotta?](#-what-is-daccotta)
2. [🔑 Key Features](#-key-features)
    - [🚧 Coming Soon Features](#coming-soon)
3. [🛠️ Tech Stack](#️-tech-stack)
4. [🚀 Getting Started](#-getting-started)
    - [🗂️ Setting Up Daccotta Repository](#️-setting-up-daccotta-repository)
    - [🔧 Installing Bun](#installing-bun)
        - [🍎 For macOS](#for-macos)
        - [🪟 For Windows](#for-windows)
    - [🖥️ Frontend-Only Setup](#️-frontend-only-setup)
    - [🗂️ Setting Up Full Stack Daccotta](#️-setting-up-full-stack-daccotta-client--server)
        - [💾 Setting Up MongoDB Atlas](#setting-up-mongodb-atlas)
        - [🔐 Setting Up Firebase](#setting-up-firebase)
        - [⚙️ Running the Full Stack Project](#running-the-full-stack-project)
5. [❤️✨ Our Valuable Contributors](#our-valuable-contributors-️)
6. [🤝 Contributing](#-contributing)
7. [📧 Contact](#-contact)
8. [⚠️ Attribution](#️-attribution)

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

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Bullseye.png" alt="Bullseye" width="40" height="40" />Installing Bun

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

    - In the Authentication section of your Firebase project in the console, ensure that you have enabled the Email/Password sign-in method under `Sign-in Method`.

    - Set the Firebase credentials in your `client/.env` file as above , refer to .env.example.:

        ```
        VITE_ACCESS_KEY= "your tmdb key"
         VITE_API_KEY=
         VITE_AUTH_DOMAIN=
         VITE_PROJECT_ID=
         VITE_STORAGE_BUCKET=
         VITE_MESSAGING_SENDER_ID=
         VITE_APP_ID=
         VITE_API_BASE_URL=http://localhost:8080
        ```

-   After setting up, To access the service account, head over to your Firebase console, click on the Settings icon in the top-left corner of the developer console, and select Project Settings. Then, select the Service Account tab, and click on Generate new private key, rename that file to `firebases.json` and place it in your server folder.
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

## Our Valuable Contributors ❤️✨

<div align="center">

| Contributor                                                                                                                                                      | Contributor                                                                                                                                                | Contributor                                                                                                                                                          | Contributor                                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/AshuKr22.png" alt="AshuKr22" width="80"/> <br> <p align="center">[AshuKr22](https://github.com/AshuKr22) 👨‍💻</p>                     | <img src="https://github.com/sid0000007.png" alt="Sid" width="80"/> <br> <p align="center">[Sid](https://github.com/sid0000007) 👨‍💻</p>                     | <img src="https://github.com/shubhagarwal1.png" alt="Shubham Agarwal" width="80"/> <br> <p align="center">[Shubham Agarwal](https://github.com/shubhagarwal1) 👨‍💻</p> | <img src="https://github.com/mehul-m-prajapati.png" alt="Mehul" width="80"/> <br> <p align="center">[Mehul](https://github.com/mehul-m-prajapati) 👨‍💻</p> |
| <img src="https://github.com/alo7lika.png" alt="Alolika" width="80"/> <br> <p align="center">[Alolika](https://github.com/alo7lika) 👩‍💻</p>                       | <img src="https://github.com/daccotta.png" alt="Daccotta" width="80"/> <br> <p align="center">[Daccotta](https://github.com/daccotta) 👨‍💻</p>               | <img src="https://github.com/knighthinata.png" alt="Knighthinata" width="80"/> <br> <p align="center">[Knighthinata](https://github.com/knighthinata) 👨‍💻</p>         | <img src="https://github.com/Sourabh782.png" alt="Sourabh" width="80"/> <br> <p align="center">[Sourabh](https://github.com/Sourabh782) 👨‍💻</p>           |
| <img src="https://github.com/samyak-aditya.png" alt="Samyak Aditya" width="80"/> <br> <p align="center">[Samyak Aditya](https://github.com/samyak-aditya) 👨‍💻</p> | <img src="https://github.com/harshbhar0629.png" alt="Harsh Bhar" width="80"/> <br> <p align="center">[Harsh Bhar](https://github.com/harshbhar0629) 👨‍💻</p> | <img src="https://github.com/amitb0ra.png" alt="Amit Bora" width="80"/> <br> <p align="center">[Amit Bora](https://github.com/amitb0ra) 👨‍💻</p>                       | <img src="https://github.com/mukulkundu.png" alt="Mukul Kundu" width="80"/> <br> <p align="center">[Mukul Kundu](https://github.com/mukulkundu) 👨‍💻</p>   |
| <img src="https://github.com/mayur1377.png" alt="Mayur" width="80"/> <br> <p align="center">[Mayur](https://github.com/mayur1377) 👨‍💻</p>                         | <img src="https://github.com/IkkiOcean.png" alt="Ikki Ocean" width="80"/> <br> <p align="center">[Ikki Ocean](https://github.com/IkkiOcean) 👨‍💻</p>         | <img src="https://github.com/Dhruv-pahuja.png" alt="Dhruv Pahuja" width="80"/> <br> <p align="center">[Dhruv Pahuja](https://github.com/Dhruv-pahuja) 👨‍💻</p>         | <img src="https://github.com/say-het.png" alt="Say Het" width="80"/> <br> <p align="center">[Say Het](https://github.com/say-het) 👨‍💻</p>                 |
| <img src="https://github.com/DevRish.png" alt="Dev Rish" width="80"/> <br> <p align="center">[Dev Rish](https://github.com/DevRish) 👨‍💻</p>                       | <img src="https://github.com/vaibhav01-git.png" alt="Vaibhav" width="80"/> <br> <p align="center">[Vaibhav](https://github.com/vaibhav01-git) 👨‍💻</p>       | <img src="https://github.com/trijalkaushik.png" alt="Trijal Kaushik" width="80"/> <br> <p align="center">[Trijal Kaushik](https://github.com/trijalkaushik) 👨‍💻</p>   |                                                                                                                                                          |

</div>

## <img src="https://user-images.githubusercontent.com/74038190/216120981-b9507c36-0e04-4469-8e27-c99271b45ba5.png" width="40" height="40" /> Contributing

We'd love your help to make **Daccotta** even better! If you're interested in contributing, please read [CONTRIBUTION GUIDE](./CONTRIBUTING.md).

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Detective.png" alt="Detective" width="40" height="40" /> Contact

### Project Admins⚡

<table>
<tr>
<td align="center"><img src="https://media.licdn.com/dms/image/v2/D5603AQEY9rnV-tmIyA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1728535091373?e=1736380800&v=beta&t=bMR--TA3hLMOMrp4Z1FDZIFJ35mmqV_ScN9qxBPVN8o" width=150px height=150px /></a></br> <h4 style="color:red;">ASHU KUMAR</h4>
 <a href="https://www.linkedin.com/in/ashukumar22/"><img src="https://user-images.githubusercontent.com/74038190/235294012-0a55e343-37ad-4b0f-924f-c8431d9d2483.gif" width="32px" height="32px"></img></a>
</td>
<td align="center"><img src="https://avatars.githubusercontent.com/u/143296945?v=4" width=150px height=150px /></a></br> <h4 style="color:red;">SIDDHARTH GUPTA</h4>
 <a href="https://www.linkedin.com/in/siddharthgupta007/"><img src="https://user-images.githubusercontent.com/74038190/235294012-0a55e343-37ad-4b0f-924f-c8431d9d2483.gif" width="32px" height="32px"></img></a>
</td>

</tr>
</table>

Feel free to reach out to us for any queries or suggestions:
**Email**: daccotta.pvt@gmail.com
**Website**: [daccotta.com](https://daccotta.com)

---

## ⚠️ Attribution

Daccotta uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.

---

**Made with ❤️ by movie lovers for movie lovers!**

---
