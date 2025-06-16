<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Note, CreateNoteRequest } from "../types/Note";
  import { theme } from "../stores/themeStore";
  import { get } from "svelte/store";

  export let note: Note | null = null; // null for create, Note for edit
  export let isSubmitting = false;

  const dispatch = createEventDispatcher<{
    submit: CreateNoteRequest;
    cancel: void;
  }>();

  let title = note?.title || "";
  let content = note?.content || "";

  function handleSubmit() {
    if (!title.trim() || !content.trim()) return;

    dispatch("submit", {
      title: title.trim(),
      content: content.trim(),
    });
  }

  function handleCancel() {
    dispatch("cancel");
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
  <div class="space-y-2">
    <label
      for="title"
      class="block text-sm font-semibold uppercase tracking-wider transition-colors duration-500 {$theme ===
      'green'
        ? 'text-green-900'
        : $theme === 'blue'
          ? 'text-blue-900'
          : $theme === 'red'
            ? 'text-red-900'
            : 'text-white/90'}"
    >
      Note Title
    </label>
    <input
      id="title"
      bind:value={title}
      type="text"
      placeholder="Enter a captivating title..."
      class="input-field text-lg font-medium transition-colors duration-500
        {$theme === 'dark'
        ? 'bg-gray-800 text-white placeholder-white/60 border-gray-700'
        : ''}
        {$theme === 'red'
        ? 'bg-red-100 text-red-900 placeholder-red-400 border-red-300'
        : ''}
        {$theme === 'blue'
        ? 'bg-blue-100 text-blue-900 placeholder-blue-400 border-blue-300'
        : ''}
        {$theme === 'green'
        ? 'bg-green-100 text-green-900 placeholder-green-700 border-green-300'
        : ''}"
      disabled={isSubmitting}
      required
    />
  </div>

  <div class="space-y-2">
    <label
      for="content"
      class="block text-sm font-semibold uppercase tracking-wider transition-colors duration-500 {$theme ===
      'green'
        ? 'text-green-900'
        : $theme === 'blue'
          ? 'text-blue-900'
          : $theme === 'red'
            ? 'text-red-900'
            : 'text-white/90'}"
    >
      Content
    </label>
    <textarea
      id="content"
      bind:value={content}
      placeholder="Share your thoughts, ideas, or important information..."
      rows="6"
      class="input-field resize-none leading-relaxed transition-colors duration-500
        {$theme === 'dark'
        ? 'bg-gray-800 text-white placeholder-white/60 border-gray-700'
        : ''}
        {$theme === 'red'
        ? 'bg-red-100 text-red-900 placeholder-red-400 border-red-300'
        : ''}
        {$theme === 'blue'
        ? 'bg-blue-100 text-blue-900 placeholder-blue-400 border-blue-300'
        : ''}
        {$theme === 'green'
        ? 'bg-green-100 text-green-900 placeholder-green-700 border-green-300'
        : ''}"
      disabled={isSubmitting}
      required
    ></textarea>
  </div>

  <div class="flex gap-4 pt-4">
    <button
      type="submit"
      disabled={isSubmitting || !title.trim() || !content.trim()}
      class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 flex-1 justify-center transition-colors duration-500 {$theme ===
      'green'
        ? 'text-green-900'
        : $theme === 'blue'
          ? 'text-blue-900'
          : $theme === 'red'
            ? 'text-red-900'
            : 'text-white'}"
    >
      {#if isSubmitting}
        <div
          class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
        ></div>
      {:else}
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      {/if}
      {note ? "Update Note" : "Create Note"}
    </button>

    <button
      type="button"
      on:click={handleCancel}
      disabled={isSubmitting}
      class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed px-8 transition-colors duration-500 {$theme ===
      'green'
        ? 'text-green-900'
        : $theme === 'blue'
          ? 'text-blue-900'
          : $theme === 'red'
            ? 'text-red-900'
            : 'text-white'}"
    >
      Cancel
    </button>
  </div>
</form>
