<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Note } from "../types/Note";
  import NoteForm from "./NoteForm.svelte";

  export let note: Note;

  const dispatch = createEventDispatcher<{
    edit: { id: number; title: string; content: string };
    delete: number;
  }>();

  let isEditing = false;
  let isSubmittingEdit = false;

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleEdit() {
    isEditing = true;
  }

  function handleEditSubmit(event: CustomEvent) {
    isSubmittingEdit = true;
    dispatch("edit", {
      id: note.id,
      ...event.detail,
    });
  }

  function handleEditCancel() {
    isEditing = false;
    isSubmittingEdit = false;
  }

  function handleDelete() {
    dispatch("delete", note.id);
  }

  export function closeEdit() {
    isEditing = false;
    isSubmittingEdit = false;
  }
</script>

<div class="card p-6 animate-slide-up group">
  {#if isEditing}
    <div class="space-y-4">
      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
        >
          <svg
            class="h-4 w-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white">Edit Note</h3>
      </div>

      <NoteForm
        {note}
        isSubmitting={isSubmittingEdit}
        on:submit={handleEditSubmit}
        on:cancel={handleEditCancel}
      />
    </div>
  {:else}
    <div class="space-y-4">
      <div class="flex justify-between items-start gap-4">
        <h3
          class="text-xl font-bold text-white leading-tight group-hover:text-blue-300 transition-colors duration-300"
        >
          {note.title}
        </h3>
        <div
          class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <button
            on:click={handleEdit}
            class="p-2 text-white/60 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300 transform hover:scale-110"
            title="Edit note"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            on:click={handleDelete}
            class="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300 transform hover:scale-110"
            title="Delete note"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <p class="text-white/80 leading-relaxed whitespace-pre-wrap">
        {note.content}
      </p>

      <div
        class="flex justify-between items-center pt-4 border-t border-white/10"
      >
        <time class="text-sm text-white/50 font-medium">
          {formatDate(note.createdAt)}
        </time>
        <div class="flex items-center gap-2 text-xs text-white/40">
          <div
            class="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
          ></div>
          ID: {note.id}
        </div>
      </div>
    </div>
  {/if}
</div>
