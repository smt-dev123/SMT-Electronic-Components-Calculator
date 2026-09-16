export default defineNuxtPlugin(() => {
  const historyStore = useHistoryStore();
  const favoritesStore = useFavoritesStore();

  historyStore.hydrate();
  favoritesStore.hydrate();
});
