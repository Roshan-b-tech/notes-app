<script lang="ts">
  import { searchQuery } from "../stores/notesStore";
  import { theme } from "../stores/themeStore";
  import { get } from "svelte/store";

  let inputValue = "";

  function handleSearch() {
    searchQuery.set(inputValue);
  }

  function clearSearch() {
    inputValue = "";
    searchQuery.set("");
  }
</script>

<div class="relative group">
  <div
    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
  >
    <svg
      class="h-5 w-5 text-white/60 group-focus-within:text-blue-400 transition-colors duration-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>

  <input
    bind:value={inputValue}
    on:input={handleSearch}
    type="text"
    placeholder="Search your notes by title or content..."
    class="input-field pl-12 pr-12 text-lg py-4 transition-colors duration-500
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
      ? 'bg-green-100 text-green-900 placeholder-green-400 border-green-300'
      : ''}"
  />

  {#if inputValue}
    <button
      on:click={clearSearch}
      class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors duration-300"
    >
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  {/if}

  <!-- Search suggestions indicator -->
  {#if inputValue}
    <div
      class="absolute top-full left-0 right-0 mt-2 p-2 glass-effect rounded-xl"
    >
      <p class="text-xs text-white/60 text-center">Press Enter to search</p>
    </div>
  {/if}
</div>
