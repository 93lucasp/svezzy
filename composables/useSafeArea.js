import { SafeArea } from 'capacitor-plugin-safe-area';

export function useSafeArea() {
  const safeAreaStyles = ref({});

  onBeforeMount(async () => {
    const { insets } = await SafeArea.getSafeAreaInsets();
    for (const [key, value] of Object.entries(insets)) {
      safeAreaStyles.value[`--safe-area-inset-${key}`] = `${value}px`;
    }
  });
  return { safeAreaStyles };
}
