import { defineUserSignupFields } from "wasp/server/auth";

const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

export const discordUserSignupFields = defineUserSignupFields({
  username: (data: any) => data.profile.global_name,
  email: (data: any) => data.profile.email,
  avatarUrl: (data: any) => data.profile.avatar,
  isAdmin: (data: any) => adminEmails.includes(data.profile.email),
});

export function discordAuthConfig() {
  return {
    scopes: ["identify", "email"],
  };
}
