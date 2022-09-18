import React from 'react';
import {View, Text, StyleProp, ViewStyle} from 'react-native'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { config, cores } from '../styles/Estilos'

export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props:any) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'green' }}
      contentContainerStyle={{paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 20,
        fontWeight: '400'
      }}text2Style={{
        fontSize: 16
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props:any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17
      }}
      text2Style={{
        fontSize: 15
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ text1, props }:any) => (
    <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  )
};

export const popUpErroGenerico = (props:any) => {
    Toast.show({
      type: props.type,
      text1: props.text1,
      text2: props.text2,
    });
}
