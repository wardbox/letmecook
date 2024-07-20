import { defineUserSignupFields } from 'wasp/server/auth'

export const discordUserSignupFields = defineUserSignupFields({
  username: (data: any) => data.profile.global_name,
  email: (data: any) => data.profile.email,
  avatarUrl: (data: any) => data.profile.avatar,
})

export function discordAuthConfig() {
  return {
    scopes: ['identify', 'email'],
  }
}