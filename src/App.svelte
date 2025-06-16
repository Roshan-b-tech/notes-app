<script lang="ts">
  import { onMount } from "svelte";
  import { notes, isLoading, error, searchQuery } from "./stores/notesStore";
  import { notesApi } from "./services/notesApi";
  import type { Note, CreateNoteRequest } from "./types/Note";

  import LoadingSpinner from "./components/LoadingSpinner.svelte";
  import ErrorMessage from "./components/ErrorMessage.svelte";
  import SearchBar from "./components/SearchBar.svelte";
  import NoteForm from "./components/NoteForm.svelte";
  import NotesGrid from "./components/NotesGrid.svelte";
  import DeleteConfirmationModal from "./components/DeleteConfirmationModal.svelte";

  import { theme, themes, setTheme } from "./stores/themeStore";
  import { get } from "svelte/store";

  let showCreateForm = false;
  let isSubmittingCreate = false;
  let isSubmittingEdit = false;
  let isSubmittingDelete = false;
  let deleteModalOpen = false;
  let noteToDelete: Note | null = null;
  let notesGridRef: NotesGrid;
  let filteredNotes: Note[] = [];

  let fullDescription = `Create, edit, and organize your thoughts with our beautiful, modern note-taking experience. Your ideas deserve a stunning home.`;
  let animatedDescription = "";
  let typingIndex = 0;
  let typingForward = true;

  let isMobile = false;

  let currentPage = 1;
  let totalPages = 1;
  let sortBy: "createdAt" | "title" = "createdAt";
  let order: "asc" | "desc" = "desc";
  const limit = 20;

  function animateDescription() {
    if (typingForward) {
      if (typingIndex < fullDescription.length) {
        animatedDescription += fullDescription[typingIndex];
        typingIndex++;
      } else {
        typingForward = false;
        setTimeout(animateDescription, 1200); // Pause before deleting
        return;
      }
    } else {
      if (typingIndex > 0) {
        animatedDescription = animatedDescription.slice(0, -1);
        typingIndex--;
      } else {
        typingForward = true;
        setTimeout(animateDescription, 600); // Pause before typing again
        return;
      }
    }
    setTimeout(animateDescription, 40);
  }

  // Filter notes based on search query
  $: {
    if ($searchQuery.trim()) {
      filteredNotes = $notes.filter(
        (note) =>
          note.title.toLowerCase().includes($searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes($searchQuery.toLowerCase()),
      );
    } else {
      filteredNotes = $notes;
    }
  }

  function checkMobile() {
    isMobile = window.innerWidth < 768;
  }

  onMount(() => {
    checkMobile();
    animateDescription();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  });

  async function loadNotes() {
    try {
      isLoading.set(true);
      error.set(null);
      const fetchedNotes = await notesApi.getAllNotes({
        page: currentPage,
        limit,
        sortBy,
        order,
      });
      notes.set(fetchedNotes);
      totalPages = fetchedNotes.length < limit ? currentPage : currentPage + 1;
    } catch (err) {
      error.set("Failed to load notes. Please check your API configuration.");
      console.error("Error loading notes:", err);
    } finally {
      isLoading.set(false);
    }
  }

  function handleCreateNote() {
    showCreateForm = true;
  }

  async function handleCreateSubmit(event: CustomEvent<CreateNoteRequest>) {
    try {
      isSubmittingCreate = true;
      const newNote = await notesApi.createNote(event.detail);
      notes.update((currentNotes) => [newNote, ...currentNotes]);
      showCreateForm = false;
    } catch (err) {
      error.set("Failed to create note. Please try again.");
      console.error("Error creating note:", err);
    } finally {
      isSubmittingCreate = false;
    }
  }

  function handleCreateCancel() {
    showCreateForm = false;
  }

  async function handleEditNote(
    event: CustomEvent<{ id: number; title: string; content: string }>,
  ) {
    try {
      isSubmittingEdit = true;
      const { id, title, content } = event.detail;
      const updatedNote = await notesApi.updateNote(id, { title, content });

      notes.update((currentNotes) =>
        currentNotes.map((note) => (note.id === id ? updatedNote : note)),
      );

      // Close the edit form
      if (notesGridRef) {
        notesGridRef.closeAllEdits();
      }
    } catch (err) {
      error.set("Failed to update note. Please try again.");
      console.error("Error updating note:", err);
    } finally {
      isSubmittingEdit = false;
    }
  }

  function handleDeleteNote(event: CustomEvent<number>) {
    const noteId = event.detail;
    noteToDelete = $notes.find((note) => note.id === noteId) || null;
    deleteModalOpen = true;
  }

  async function confirmDelete() {
    if (!noteToDelete) return;

    try {
      isSubmittingDelete = true;
      await notesApi.deleteNote(noteToDelete.id);
      notes.update((currentNotes) =>
        currentNotes.filter((note) => note.id !== noteToDelete!.id),
      );
      deleteModalOpen = false;
      noteToDelete = null;
    } catch (err) {
      error.set("Failed to delete note. Please try again.");
      console.error("Error deleting note:", err);
    } finally {
      isSubmittingDelete = false;
    }
  }

  function cancelDelete() {
    deleteModalOpen = false;
    noteToDelete = null;
  }
</script>

<main
  class="min-h-screen relative overflow-hidden transition-colors duration-500 {$theme ===
  'dark'
    ? 'bg-gray-900 text-white'
    : ''} {$theme === 'red' ? 'bg-red-200 text-red-900' : ''} {$theme === 'blue'
    ? 'bg-blue-200 text-blue-900'
    : ''} {$theme === 'green' ? 'bg-green-200 text-green-900' : ''}"
  style="transition: background 0.5s, color 0.5s;"
>
  <!-- Animated Background Orbs -->
  <div
    class="floating-orb w-96 h-96 bg-blue-500 top-10 -left-20 animate-float"
  ></div>
  <div
    class="floating-orb w-80 h-80 bg-purple-500 top-1/3 -right-20 animate-float"
    style="animation-delay: -2s;"
  ></div>
  <div
    class="floating-orb w-64 h-64 bg-pink-500 bottom-20 left-1/4 animate-float"
    style="animation-delay: -4s;"
  ></div>
  <div
    class="floating-orb w-72 h-72 bg-indigo-500 bottom-1/3 right-1/3 animate-float"
    style="animation-delay: -1s;"
  ></div>

  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header -->
    <div class="text-center mb-16 relative flex flex-col items-center">
      {#if !isMobile}
        <div
          class="w-full flex flex-row justify-center items-center gap-2 mb-4 md:absolute md:left-0 md:top-0 md:flex-col md:items-start md:gap-4 md:w-auto md:mb-0 z-10"
        >
          <img
            src="/sticky-note.png"
            alt="Sticky Note"
            class="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-lg"
            style="margin-left: 0; margin-top: 0; position: relative; z-index: 2;"
          />
          <img
            src="/sticky-note3.png"
            alt="Sticky Note 3"
            class="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-lg"
            style="margin-left: 0; margin-top: 0; position: relative; z-index: 1; transform: rotate(-8deg);"
          />
        </div>
        <div
          class="w-full flex flex-row justify-center items-center gap-2 mb-4 md:absolute md:right-0 md:top-0 md:flex-col md:items-end md:gap-4 md:w-auto md:mb-0 z-10"
        >
          <img
            src="/sticky-note2.png"
            alt="Sticky Note 2"
            class="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-lg"
            style="margin-right: 0; margin-top: 0; position: relative; z-index: 2;"
          />
          <img
            src="/sticky-note3.png"
            alt="Sticky Note 3"
            class="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-lg"
            style="margin-right: 0; margin-top: 0; position: relative; z-index: 1; transform: rotate(8deg);"
          />
        </div>
      {/if}
      <h1 class="text-5xl md:text-7xl font-bold mb-6 text-shadow">
        <span class="gradient-text">My Notes</span>
      </h1>
      <p
        class="text-xl max-w-3xl mx-auto leading-relaxed min-h-[3.5rem] transition-colors duration-500 {$theme ===
        'green'
          ? 'text-green-900'
          : $theme === 'blue'
            ? 'text-blue-900'
            : $theme === 'red'
              ? 'text-red-900'
              : 'text-white/80'}"
      >
        {animatedDescription}
      </p>
      {#if isMobile}
        <div
          class="w-full flex flex-row justify-center items-center gap-2 mt-4 z-10"
        >
          <img
            src="/sticky-note.png"
            alt="Sticky Note"
            class="w-16 h-16 object-contain drop-shadow-lg"
          />
          <img
            src="/sticky-note3.png"
            alt="Sticky Note 3"
            class="w-20 h-20 object-contain drop-shadow-lg"
            style="transform: rotate(-8deg);"
          />
          <img
            src="/sticky-note2.png"
            alt="Sticky Note 2"
            class="w-16 h-16 object-contain drop-shadow-lg"
          />
          <img
            src="/sticky-note3.png"
            alt="Sticky Note 3"
            class="w-20 h-20 object-contain drop-shadow-lg"
            style="transform: rotate(8deg);"
          />
        </div>
      {/if}

      <!-- Decorative Elements -->
      <div class="flex justify-center mt-8 space-x-2">
        <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div
          class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
          style="animation-delay: 0.2s;"
        ></div>
        <div
          class="w-2 h-2 bg-pink-400 rounded-full animate-pulse"
          style="animation-delay: 0.4s;"
        ></div>
      </div>
    </div>

    <!-- Theme Switcher -->
    <div class="flex justify-center gap-3 py-4">
      {#each themes as t}
        <button
          class="w-8 h-8 rounded-full border-2 border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-500"
          style="background: {t === 'dark'
            ? '#222'
            : t === 'red'
              ? '#f87171'
              : t === 'blue'
                ? '#60a5fa'
                : '#34d399'};"
          aria-label={t + " theme"}
          on:click={() => setTheme(t)}
        ></button>
      {/each}
    </div>

    <!-- Actions Bar -->
    <div class="glass-effect p-6 mb-12 animate-slide-up">
      <div class="flex flex-col lg:flex-row gap-6 items-center">
        <div class="flex-1 w-full">
          <SearchBar />
        </div>

        <button
          on:click={handleCreateNote}
          class="btn-primary flex items-center gap-3 whitespace-nowrap animate-glow"
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
              d="M12 4v16M4 12h16"
            />
          </svg>
          Create New Note
        </button>
      </div>
    </div>

    <!-- Create Form -->
    {#if showCreateForm}
      <div
        class="p-8 mb-12 animate-slide-up rounded-2xl shadow-lg transition-colors duration-500
        {$theme === 'dark'
          ? 'bg-gray-800 text-white border border-gray-700'
          : ''}
        {$theme === 'red'
          ? 'bg-red-100 text-red-900 border border-red-300'
          : ''}
        {$theme === 'blue'
          ? 'bg-blue-100 text-blue-900 border border-blue-300'
          : ''}
        {$theme === 'green'
          ? 'bg-green-100 text-green-900 border border-green-300'
          : ''}"
      >
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
                d="M12 4v16M4 12h16"
              />
            </svg>
          </div>
          <h2
            class="text-2xl font-bold transition-colors duration-500 {$theme ===
            'green'
              ? 'text-green-900'
              : $theme === 'blue'
                ? 'text-blue-900'
                : $theme === 'red'
                  ? 'text-red-900'
                  : 'text-white'}"
          >
            Create New Note
          </h2>
        </div>
        <NoteForm
          isSubmitting={isSubmittingCreate}
          on:submit={handleCreateSubmit}
          on:cancel={handleCreateCancel}
        />
      </div>
    {/if}

    <!-- Error Message -->
    {#if $error}
      <div class="mb-8">
        <ErrorMessage message={$error} onRetry={loadNotes} />
      </div>
    {/if}

    <!-- Content -->
    {#if $isLoading}
      <LoadingSpinner />
    {:else}
      <!-- Search Results Info -->
      {#if $searchQuery.trim()}
        <div class="glass-effect p-4 mb-8 animate-fade-in">
          <div class="flex items-center gap-3">
            <svg
              class="h-5 w-5 text-blue-400"
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
            <p class="text-white/90">
              Found <span class="font-semibold text-blue-400"
                >{filteredNotes.length}</span
              >
              note{filteredNotes.length !== 1 ? "s" : ""}
              matching
              <span class="font-medium text-purple-400">{$searchQuery}</span>
              {#if filteredNotes.length !== $notes.length}
                <span class="text-white/60">({$notes.length} total)</span>
              {/if}
            </p>
          </div>
        </div>
      {/if}

      <!-- Sorting and Pagination Controls -->
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
      >
        <div class="flex items-center gap-2">
          <label for="sortBy" class="font-semibold">Sort by:</label>
          <select
            id="sortBy"
            bind:value={sortBy}
            on:change={() => {
              currentPage = 1;
              loadNotes();
            }}
            class="rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 transition-colors duration-500
              {$theme === 'dark'
              ? 'bg-gray-800 text-white border-gray-700 focus:ring-blue-400'
              : ''}
              {$theme === 'red'
              ? 'bg-red-50 text-red-900 border-red-300 focus:ring-red-400'
              : ''}
              {$theme === 'blue'
              ? 'bg-blue-50 text-blue-900 border-blue-300 focus:ring-blue-400'
              : ''}
              {$theme === 'green'
              ? 'bg-green-50 text-green-900 border-green-300 focus:ring-green-400'
              : ''}"
          >
            <option value="createdAt">Date</option>
            <option value="title">Title</option>
          </select>
          <button
            on:click={() => {
              order = order === "asc" ? "desc" : "asc";
              currentPage = 1;
              loadNotes();
            }}
            class="ml-2 px-2 py-1 rounded border transition-colors duration-500
              {$theme === 'dark'
              ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
              : ''}
              {$theme === 'red'
              ? 'bg-red-200 text-red-900 border-red-300 hover:bg-red-300'
              : ''}
              {$theme === 'blue'
              ? 'bg-blue-200 text-blue-900 border-blue-300 hover:bg-blue-300'
              : ''}
              {$theme === 'green'
              ? 'bg-green-200 text-green-900 border-green-300 hover:bg-green-300'
              : ''}"
          >
            {order === "asc" ? "↑" : "↓"}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button
            on:click={() => {
              if (currentPage > 1) {
                currentPage--;
                loadNotes();
              }
            }}
            disabled={currentPage === 1}
            class="px-3 py-1 rounded border border-gray-300 bg-white/20 hover:bg-white/40 disabled:opacity-50"
            >Prev</button
          >
          <span>Page {currentPage}</span>
          <button
            on:click={() => {
              if (filteredNotes.length === limit) {
                currentPage++;
                loadNotes();
              }
            }}
            disabled={filteredNotes.length < limit}
            class="px-3 py-1 rounded border border-gray-300 bg-white/20 hover:bg-white/40 disabled:opacity-50"
            >Next</button
          >
        </div>
      </div>

      <!-- Notes Grid -->
      <NotesGrid
        bind:this={notesGridRef}
        notes={filteredNotes}
        on:edit={handleEditNote}
        on:delete={handleDeleteNote}
      />
    {/if}
  </div>

  <!-- Delete Confirmation Modal -->
  <DeleteConfirmationModal
    isOpen={deleteModalOpen}
    noteTitle={noteToDelete?.title || ""}
    isDeleting={isSubmittingDelete}
    on:confirm={confirmDelete}
    on:cancel={cancelDelete}
  />
</main>
