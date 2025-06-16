<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let isOpen = false;
  export let noteTitle = '';
  export let isDeleting = false;

  const dispatch = createEventDispatcher<{
    confirm: void;
    cancel: void;
  }>();

  function handleConfirm() {
    dispatch('confirm');
  }

  function handleCancel() {
    if (!isDeleting) {
      dispatch('cancel');
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div class="glass-effect p-8 max-w-md w-full animate-scale-in border-red-500/30">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 id="modal-title" class="text-2xl font-bold text-white mb-2">
          Delete Note
        </h3>
        
        <p class="text-white/80 leading-relaxed">
          Are you sure you want to delete 
          <span class="font-semibold text-red-400">"{noteTitle}"</span>? 
          This action cannot be undone and your note will be permanently removed.
        </p>
      </div>
      
      <div class="flex gap-4">
        <button
          on:click={handleCancel}
          disabled={isDeleting}
          class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex-1"
        >
          Keep Note
        </button>
        <button
          on:click={handleConfirm}
          disabled={isDeleting}
          class="btn-danger disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 flex-1"
        >
          {#if isDeleting}
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          {:else}
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          {/if}
          Delete Forever
        </button>
      </div>
    </div>
  </div>
{/if}