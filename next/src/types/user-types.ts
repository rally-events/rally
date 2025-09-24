import getUserInfo from "@/fetches/user/getUserInfo"

export type UserInfo = NonNullable<Awaited<ReturnType<typeof getUserInfo>>["data"]>
