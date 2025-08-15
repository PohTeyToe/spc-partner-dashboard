import { Alert } from 'react-native';

export function toastSuccess(message: string) {
  Alert.alert(message);
}
export function toastError(message: string) {
  Alert.alert('Error', message);
}
export function toastInfo(message: string) {
  Alert.alert(message);
}

