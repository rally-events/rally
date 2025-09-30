import getEvent from "../events/getEvent"
import getUserInfo from "../user/getUserInfo"

export type EventInfo = NonNullable<Awaited<ReturnType<typeof getEvent>>>
export type UserInfo = NonNullable<Awaited<ReturnType<typeof getUserInfo>>>
