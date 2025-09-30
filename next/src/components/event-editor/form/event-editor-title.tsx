import { useFormContext } from "react-hook-form"
import { EventEditSchema } from "../event-editor-provider"

import React from "react"

export default function EventEditorTitle() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EventEditSchema>()

  return (
    <div>
      <input
        {...register("name")}
        placeholder="Event Title"
        className={`h-12 w-full border-b p-1 text-4xl font-bold outline-none ${
          errors.name ? "border-red-500" : "border-transparent"
        }`}
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
    </div>
  )
}
