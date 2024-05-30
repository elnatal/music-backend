# Whyzzer Challenge

## Project Overview

This project is a simple Express.js backend for a music application.

## Technologies Used

- **Backend Framework:** Express.js
- **Database:** PostgreSQL (managed by Prisma ORM)
- **Authentication:** Firebase Authentication with JWT
- **Testing:** Mocha and Chai
- **Additional Tools:** Swagger for API documentation

## Getting Started

### Prerequisites

- Node.js ( preferably **v16.20.2** )
- PostgreSQL
- Firebase account for Authentication setup
- Cloudinary account for storing audio files

### Installation

1.  **Clone the repository:**

    ```sh
    git clone git@github.com:elnatal/music-backend.git
    cd music-backend
    ```

2.  **Install dependencies:**

    ```sh
    yarn install
    ```

3.  **Setup environment variables:**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database-name>?schema=public
    PORT=4000
    JWT_SECRET=<your-jwt-secret>
    FIREBASE_WEB_KEY=<your-firebase-web-key>
    CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
    CLOUDINARY_API_KEY=<your-cloudinary-api-key>
    CLOUDINARY_SECRET_KEY=<your-cloudinary-secret-key>
    ```

4.  **Migrate:**

    ```sh
    npx prisma migrate deploy
    ```

5.  **Configure Firebase:**

    1. Download your private key. You can find it under Project settings > Service accounts > Firebase Admin SDK
    2. Move the downloaded file to the project root directory and rename it to `serviceAccountKey.json`

6.  **Run the seeder:**

    ```sh
    yarn seed
    ```

    This will create three accounts:

         Admin account:
             - Email: admin@music.com
             - Password: password

         User account:
             - Email: user@music.com
             - Password: password

         Artist account:
             - Email: artist@music.com
             - Password: password

    You will use this accounts to test the API.

### Running the Project Locally

1. **Start the server:**

   ```sh
   yarn start
   ```

2. **Access the API documentation:**
   Open [http://localhost:4000/v1/api-docs](http://localhost:4000/v1/api-docs) in your browser.

3. **Get IdToken:**
    - To simulate the authentication process we are going to use `/auth/get-id-token` as a client application.
    - It will generate `idToken` (which comes from firebase)
4. **Authenticate using the idToken**
    - Send a post request to `/auth` with the `idToken` to authenticate
    - It will generate a `token`
5. **Use the token to access other Apis**
    - In the top right corner you can find **Authorize** button
    - Set the token there and you are good to go

### Running Tests

```sh
yarn test
```




