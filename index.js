import React from 'react'
import { AppRegistry } from 'react-native'
import App from './src/Router'
import { name as appName } from './app.json'
import { Provider } from 'react-redux'
import { store, persistor } from './src/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import Alerta from './src/components/Alerta'
import { AuthProvider } from './src/apis/AuthContext'
import { enableLatestRenderer } from 'react-native-maps'
import Toast from 'react-native-toast-message';
import toastConfig from './src/screens/PopUpErroGenerico'

enableLatestRenderer()

const Redux = () => {
    return (
        <Provider store={store}>
            <AuthProvider>
                <PersistGate loading={null} persistor={persistor}>
                    <App />
                    <Alerta />
                    <Toast config={toastConfig}/>
                </PersistGate>
            </AuthProvider>
        </Provider>
    )
}

AppRegistry.registerComponent(appName, () => Redux)