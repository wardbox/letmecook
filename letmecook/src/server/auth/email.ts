import { defineUserSignupFields } from "wasp/server/auth";

const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

export const emailUserSignupFields = defineUserSignupFields({
  username: (data: any) => data.email.split("@")[0],
  email: (data: any) => data.email,
  isAdmin: (data: any) => adminEmails.includes(data.email),
});

export function emailAuthConfig() {
  return {
    scopes: ["identify", "email"],
  };
}

import {
  type GetPasswordResetEmailContentFn,
  type GetVerificationEmailContentFn,
} from "wasp/server/auth";

export const getVerificationEmailContent: GetVerificationEmailContentFn = (
  { verificationLink },
) => ({
  subject: "Verify your letmecook account 🧑‍🍳",
  text: `Click the link below to verify your email: ${verificationLink}`,
  html: `
   <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      background-color: #1E1E2E;
      color: #E2E2E2;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .container {
      background-color: #2B2B3A;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 500px;
      width: 100%;
    }

    h1 {
      color: #FFFFFF;
      margin-bottom: 20px;
    }

    p {
      color: #BFBFBF;
      margin-bottom: 30px;
    }

    a {
      background-color: #FBB040;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 4px;
    }

    .pigeon {
      width: 100px;
      height: auto;
      margin-bottom: 20px;
    }
  </style>
</head>

<body>
  <div class="container">
    <img class="pigeon" src="https://letmecook.food/pigeon.png" alt="carrier pigeon delivering this email">
    <h1>Thanks for joining letmecook!</h1>
    <p>Looks like our homing pigeon survived the journey. Don't let her down, verify your email address below!</p>
    <a href="${verificationLink}">Verify email</a>
  </div>
</body>

</html>

    `,
});

export const getPasswordResetEmailContent: GetPasswordResetEmailContentFn = (
  { passwordResetLink },
) => ({
  subject: "Password reset",
  text: `Click the link below to reset your password: ${passwordResetLink}`,
  html: `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      background-color: #1E1E2E;
      color: #E2E2E2;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .container {
      background-color: #2B2B3A;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 500px;
      width: 100%;
    }

    h1 {
      color: #FFFFFF;
      margin-bottom: 20px;
    }

    p {
      color: #BFBFBF;
      margin-bottom: 30px;
    }

    a {
      background-color: #FBB040;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 4px;
    }

    .pigeon {
      width: 100px;
      height: auto;
      margin-bottom: 20px;
    }
  </style>
</head>

<body>
  <div class="container">
    <img class="pigeon" src="https://letmecook.food/pigeon.png" alt="carrier pigeon delivering this email">
    <h1>Reset Your Password</h1>
    <p>Whew, another safe journey for our homing pigeon. Make her proud and click the link below to reset your password</p>
    <a href="${passwordResetLink}">Reset password</a>
  </div>
</body>

</html>
    `,
});
