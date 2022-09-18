import React from 'react';
import {View, Text,StyleSheet} from 'react-native'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons/faCircleExclamation'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck'
import { faBolt } from '@fortawesome/free-solid-svg-icons/faBolt'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { config, cores } from '../styles/Estilos'
import { height, width } from '@fortawesome/free-solid-svg-icons/faGear';

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
  customSuccess: ({ text1,text2 }:any) => (
    <View style={styles.notificationWrapper}>
      <View style={styles.leftSide}>
        <FontAwesomeIcon icon={faCircleCheck} size={config.windowWidth / 13} color={cores.verde} />
      </View>
      <View style={styles.rightView}>
        <Text style={styles.title}>{text1}</Text>
        <Text style={styles.message}>{text2}</Text>
      </View>    
    </View>
  ),
  customError: ({ text1,text2 }:any) => (
    <View style={styles.notificationWrapper}>
      <View style={styles.leftSide}>
        <FontAwesomeIcon icon={faCircleExclamation} size={config.windowWidth / 13} color={cores.vermelho} />
      </View>
      <View style={styles.rightView}>
        <Text style={styles.title}>{text1}</Text>
        <Text style={styles.message}>{text2}</Text>
      </View>    
    </View>
  ),
  customInfo: ({ text1,text2 }:any) => (
    <View style={styles.notificationWrapper}>
      <View style={styles.leftSide}>
        <FontAwesomeIcon icon={faBolt} size={config.windowWidth / 20} color={cores.branco} />
      </View>
      <View style={styles.rightView}>
        <Text style={styles.title}>{text1}</Text>
        {text2 &&
          <Text style={styles.message}>{text2}</Text>
        }
        
      </View>    
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

const styles = StyleSheet.create({
notificationWrapper: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    width:'85%',
    backgroundColor:cores.backgroundToast,
    color:'white',
    borderRadius:8,
    shadowColor:'#091433',
    paddingVertical:15,
  },
  rightView:{
    flex:6,
    flexDirection:'column',
    height:'100%',
    paddingHorizontal:'3%',
  },
  leftSide:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    height:'100%',
    paddingLeft:'1%'
  },
  title: {
    fontSize:config.windowWidth/23,
    color:'#e6e6e6',
    fontWeight:'900'
  },
  message:{
    fontSize:config.windowWidth/28,
    color:'#cccccc',
    fontWeight:'600'
    
  }


})
