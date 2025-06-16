<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Note } from "../types/Note";
  import NoteCard from "./NoteCard.svelte";
  import { theme } from "../stores/themeStore";
  import { get } from "svelte/store";

  export let notes: Note[];

  const dispatch = createEventDispatcher<{
    edit: { id: number; title: string; content: string };
    delete: number;
  }>();

  let noteCardRefs: { [key: number]: NoteCard } = {};

  function handleEdit(event: CustomEvent) {
    dispatch("edit", event.detail);
  }

  function handleDelete(event: CustomEvent) {
    dispatch("delete", event.detail);
  }

  export function closeAllEdits() {
    Object.values(noteCardRefs).forEach((noteCard) => {
      if (noteCard && noteCard.closeEdit) {
        noteCard.closeEdit();
      }
    });
  }
</script>

{#if notes.length === 0}
  <div class="text-center py-20">
    <div
      class="p-12 max-w-md mx-auto rounded-2xl shadow-lg transition-colors duration-500
      {$theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : ''}
      {$theme === 'red' ? 'bg-red-100 text-red-900 border border-red-300' : ''}
      {$theme === 'blue'
        ? 'bg-blue-100 text-blue-900 border border-blue-300'
        : ''}
      {$theme === 'green'
        ? 'bg-green-100 text-green-900 border border-green-300'
        : ''}"
    >
      <div
        class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <svg
          class="h-10 w-10 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12H15M9 16H15M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 class="text-2xl font-bold mb-3">No notes found</h3>
      <p class="text-base leading-relaxed">
        Your creative space is waiting. Start by creating your first note and
        bring your ideas to life.
      </p>
    </div>
  </div>
{:else}
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
    {#each notes as note (note.id)}
      <NoteCard
        bind:this={noteCardRefs[note.id]}
        {note}
        on:edit={handleEdit}
        on:delete={handleDelete}
      />
    {/each}
  </div>
{/if}
