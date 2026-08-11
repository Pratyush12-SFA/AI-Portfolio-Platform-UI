declare namespace Shared {
  interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration: number;
  }
}
