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
  <div style="font-family: Arial, Helvetica, sans-serif; background-color: #1E1E2E; text-wrap: balance; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align:center; font-background-color: #2B2B3A; gap: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 100%; max-width: 48rem;">
    <img src="https://letmecook.food/pigeon.png" alt="carrier pigeon delivering this email" style="width: 8rem; height: auto; margin-top: 3rem;">
    <h1 style="color: #FFFFFF; font-size: 2.25rem; line-height: 2.5rem; padding-left: 1.25rem; padding-right: 1.25rem;">Thanks for joining letmecook!</h1>
    <p style="color: #BFBFBF; font-size: 1.125rem; line-height: 1.75rem; padding-left: 1.25rem; padding-right: 1.25rem;">Looks like our homing pigeon survived the journey. Don't let her down, verify your email address below!</p>
    <a href="${verificationLink}" style="background-color: #FBB040; border: none; color: black; margin: 3rem; padding: 1.25rem; text-align: center; text-decoration: none; display: inline-block; font-size: 1rem; cursor: pointer; border-radius: 0.5rem;">Verify email</a>
  </div>
    `,
});

export const getPasswordResetEmailContent: GetPasswordResetEmailContentFn = (
  { passwordResetLink },
) => ({
  subject: "Password reset 🔑",
  text: `Click the link below to reset your password: ${passwordResetLink}`,
  html: `
   <div style="font-family: Arial, Helvetica, sans-serif; background-color: #1E1E2E; text-wrap: balance; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align:center; font-background-color: #2B2B3A; gap: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 100%; max-width: 48rem;">
    <img src="https://letmecook.food/pigeon.png" alt="carrier pigeon delivering this email" style="width: 8rem; height: auto; margin-top: 3rem;">
    <h1 style="color: #FFFFFF; font-size: 2.25rem; line-height: 2.5rem; padding-left: 1.25rem; padding-right: 1.25rem;">Reset your password</h1>
    <p style="color: #BFBFBF; font-size: 1.125rem; line-height: 1.75rem; padding-left: 1.25rem; padding-right: 1.25rem;">Whew, another safe journey for our homing pigeon. Make her proud and click the link below to reset your password.</p>
    <a href="${passwordResetLink}" style="background-color: #FBB040; border: none; color: black; margin: 3rem; padding: 1.25rem; text-align: center; text-decoration: none; display: inline-block; font-size: 1rem; cursor: pointer; border-radius: 0.5rem;">Reset password</a>
  </div>
    `,
});
