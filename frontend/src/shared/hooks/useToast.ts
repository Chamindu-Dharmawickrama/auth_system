import toast from 'react-hot-toast';

/**
 * Typed wrapper around react-hot-toast.
 * Provides consistent toast styling across the application.
 */
export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
    dismiss: (id?: string) => toast.dismiss(id),
    promise: <T>(
      promise: Promise<T>,
      messages: { loading: string; success: string; error: string },
    ) => toast.promise(promise, messages),
  };
}
