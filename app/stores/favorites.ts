export interface FavoritePart {
  partNumber: string;
  type: string;
  category:
    | "transistor"
    | "mosfet"
    | "diode"
    | "optocoupler"
    | "thyristor"
    | "triac"
    | "led"
    | "capacitor"
    | "other";
  addedAt: number;
}

const STORAGE_KEY = "electronics-favorites";

const loadFromStorage = (): FavoritePart[] => {
  if (!import.meta.client) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items: FavoritePart[]) => {
  if (!import.meta.client) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

export const useFavoritesStore = defineStore("favorites", () => {
  const items = ref<FavoritePart[]>([]);
  const isHydrated = ref(false);

  const total = computed(() => items.value.length);

  const has = computed(
    () => (partNumber: string) =>
      items.value.some((f) => f.partNumber === partNumber),
  );

  const byCategory = computed(
    () => (category: FavoritePart["category"]) =>
      items.value.filter((f) => f.category === category),
  );

  const toggle = (
    partNumber: string,
    type: string,
    category: FavoritePart["category"],
  ) => {
    const idx = items.value.findIndex((f) => f.partNumber === partNumber);

    if (idx >= 0) {
      items.value.splice(idx, 1);
      saveToStorage(items.value);
      return false;
    } else {
      items.value.push({
        partNumber,
        type,
        category,
        addedAt: Date.now(),
      });
      saveToStorage(items.value);
      return true;
    }
  };

  const remove = (partNumber: string) => {
    items.value = items.value.filter((f) => f.partNumber !== partNumber);
    saveToStorage(items.value);
  };

  const clear = () => {
    items.value = [];
    saveToStorage(items.value);
  };

  const hydrate = () => {
    if (isHydrated.value || !import.meta.client) return;
    items.value = loadFromStorage();
    isHydrated.value = true;
  };

  return {
    items,
    isHydrated,
    total,
    has,
    byCategory,
    toggle,
    remove,
    clear,
    hydrate,
  };
});
