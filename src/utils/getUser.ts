import { User } from 'oidc-client-ts'

export const LS_KEY_USER = `oidc.user:<your authority>:<your client id>`
export default function getUser() {
  const oidcStorage = localStorage.getItem(LS_KEY_USER)
  return oidcStorage ? User.fromStorageString(oidcStorage) : null
}
