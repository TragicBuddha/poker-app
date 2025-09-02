import { TextInput } from 'react-native';

export const removeFocus = () => {
  TextInput.State.blurTextInput(TextInput.State.currentlyFocusedInput());
};