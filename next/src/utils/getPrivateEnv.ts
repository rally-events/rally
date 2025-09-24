import "server-only"

export default function getPrivateEnv(key: string) {
  return process.env[key]
}
