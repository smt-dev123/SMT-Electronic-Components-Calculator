export interface CalculationRecord {
  id: string;
  type:
    | "resistor"
    | "capacitor"
    | "inductor"
    | "diode"
    | "transistor"
    | "mosfet"
    | "optocoupler";
  title: string;
  value: string;
  input: Record<string, any>;
  timestamp: number;
}

const STORAGE_KEY = "electronics-history";

// ✅ SSR-safe ID generator
const generateId = (): string => {
  if (
    import.meta.client &&
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

// ✅ SSR-safe localStorage
const loadFromStorage = (): CalculationRecord[] => {
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

const saveToStorage = (items: CalculationRecord[]) => {
  if (!import.meta.client) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

export const useHistoryStore = defineStore("history", () => {
  const items = ref<CalculationRecord[]>([]);
  const maxItems = ref(50);
  const isHydrated = ref(false);

  const total = computed(() => items.value.length);
  const isEmpty = computed(() => items.value.length === 0);
  const recent = computed(() => items.value.slice(0, 10));

  const byType = computed(
    () => (type: CalculationRecord["type"]) =>
      items.value.filter((i) => i.type === type),
  );

  const add = (record: Omit<CalculationRecord, "id" | "timestamp">) => {
    const newRecord: CalculationRecord = {
      ...record,
      id: generateId(),
      timestamp: Date.now(),
    };

    items.value.unshift(newRecord);

    if (items.value.length > maxItems.value) {
      items.value = items.value.slice(0, maxItems.value);
    }

    saveToStorage(items.value);
    return newRecord;
  };

  const remove = (id: string) => {
    items.value = items.value.filter((i) => i.id !== id);
    saveToStorage(items.value);
  };

  const clear = () => {
    items.value = [];
    saveToStorage(items.value);
  };

  const clearByType = (type: CalculationRecord["type"]) => {
    items.value = items.value.filter((i) => i.type !== type);
    saveToStorage(items.value);
  };

  const hydrate = () => {
    if (isHydrated.value || !import.meta.client) return;
    items.value = loadFromStorage();
    isHydrated.value = true;
  };

  return {
    items,
    maxItems,
    isHydrated,
    total,
    isEmpty,
    recent,
    byType,
    add,
    remove,
    clear,
    clearByType,
    hydrate,
  };
});
