import React from 'react'
import { AppRegistry } from 'react-native'
import App from './src/Router'
import { name as appName } from './app.json'
import { Provider } from 'react-redux'
import { store, persistor } from './src/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import Alerta from './src/components/Alerta'

const Redux = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
                <Alerta />
            </PersistGate>
        </Provider>
    )
}

AppRegistry.registerComponent(appName, () => Redux)