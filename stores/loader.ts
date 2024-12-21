export const useLoaderStore = defineStore("loader", () => {
  const isLoading = ref(true);
  const setLoading = (value: boolean) => {
    isLoading.value = value;
  };
  return { isLoading, setLoading };
});
