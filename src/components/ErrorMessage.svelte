<script lang="ts">
  export let message: string;
  export let onRetry: (() => void) | null = null;
</script>

<div class="glass-effect p-6 border-red-500/30 animate-fade-in">
  <div class="flex items-start gap-4">
    <div class="flex-shrink-0">
      <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
        <svg class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    
    <div class="flex-1">
      <h3 class="text-lg font-semibold text-white mb-1">Something went wrong</h3>
      <p class="text-white/80">{message}</p>
    </div>
    
    {#if onRetry}
      <button
        on:click={onRetry}
        class="btn-secondary text-sm px-4 py-2"
      >
        Try Again
      </button>
    {/if}
  </div>
</div>