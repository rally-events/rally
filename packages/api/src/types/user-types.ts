import getUserInfo from "../user/getUserInfo"

export type UserInfo = NonNullable<Awaited<ReturnType<typeof getUserInfo>>>
