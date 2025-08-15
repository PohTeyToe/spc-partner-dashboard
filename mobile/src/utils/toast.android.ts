import { ToastAndroid } from 'react-native';

export function toastSuccess(message: string) {
  ToastAndroid.show(message, ToastAndroid.SHORT);
}
export function toastError(message: string) {
  ToastAndroid.show(message, ToastAndroid.LONG);
}
export function toastInfo(message: string) {
  ToastAndroid.show(message, ToastAndroid.SHORT);
}

