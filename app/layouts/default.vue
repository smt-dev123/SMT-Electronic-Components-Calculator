<template>
  <div class="flex flex-col min-h-screen bg-slate-950 text-slate-100">
    <AppHeader />

    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
