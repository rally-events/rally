"use client"
import React, { useState } from "react"
import EventEditorHeader from "./header/event-editor-header"
import EventEditorRight from "./side-components/event-editor-right"
import EventEditorLeft from "./side-components/event-editor-left"
import EventEditorTitle from "./form/event-editor-title"
import EventFormBasics from "./form/basics/event-form-basics"
import { useEventEditor } from "./event-editor-provider"
import EventEditorMedia from "./form/media/event-editor-media"

export default function EventEditorDisplay() {
  const { currentTab } = useEventEditor()
  return (
    <main className="mx-auto flex max-w-7xl flex-col px-8">
      <EventEditorHeader />
      <div className="mt-6 flex gap-12">
        <section className="sticky top-0 flex h-fit w-56 shrink-0 flex-col gap-0.5 pt-16">
          <EventEditorLeft />
        </section>

        <section className="flex flex-grow flex-col gap-4 pb-16">
          <EventEditorTitle />
          {currentTab === "basics" && <EventFormBasics />}
          {currentTab === "media" && <EventEditorMedia />}
        </section>

        <section className="sticky top-0 flex h-fit w-56 shrink-0 flex-col gap-2 pt-16">
          <EventEditorRight />
        </section>
      </div>
    </main>
  )
}
