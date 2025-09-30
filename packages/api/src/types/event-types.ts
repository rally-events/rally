import getEvent from "../events/getEvent"

export type EventInfo = NonNullable<Awaited<ReturnType<typeof getEvent>>>
