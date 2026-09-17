export interface PaginationOptions {
  itemsPerPage?: number;
  resetOn?: () => any[];
}

export const useTablePagination = <T>(
  filteredItems: Ref<T[]>,
  options: PaginationOptions = {},
) => {
  const { itemsPerPage: initialItemsPerPage = 10, resetOn } = options;

  const currentPage = ref(1);
  const itemsPerPage = ref(initialItemsPerPage);

  // Reset page ពេល filter ផ្លាស់ប្តូរ
  if (resetOn) {
    watch(resetOn, () => {
      currentPage.value = 1;
    });
  }

  const totalPages = computed(() => {
    return Math.ceil(filteredItems.value.length / itemsPerPage.value) || 1;
  });

  const startIndex = computed(() => {
    return (currentPage.value - 1) * itemsPerPage.value;
  });

  const endIndex = computed(() => {
    return Math.min(
      startIndex.value + itemsPerPage.value,
      filteredItems.value.length,
    );
  });

  const paginatedItems = computed(() => {
    return filteredItems.value.slice(startIndex.value, endIndex.value);
  });

  // ✅ Visible page numbers (ឧ. [1, 2, 3, ..., 10])
  const visiblePages = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    const maxVisible = 5;

    if (total <= maxVisible + 2) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    // ដំបូង
    if (current <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    }
    // ចុងក្រោយ
    else if (current >= total - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 3; i <= total; i++) pages.push(i);
    }
    // កណ្តាល
    else {
      pages.push(1);
      pages.push("...");
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push("...");
      pages.push(total);
    }

    return pages;
  });

  // Navigation
  const goToPage = (page: number) => {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value));
  };

  const nextPage = () => goToPage(currentPage.value + 1);
  const prevPage = () => goToPage(currentPage.value - 1);
  const firstPage = () => goToPage(1);
  const lastPage = () => goToPage(totalPages.value);

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    paginatedItems,
    visiblePages,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  };
};
