import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import TelaHome from './screens/home/TelaHome'
import TelaLogin from './screens/loginCadastro/TelaLogin'
import TelaCadastro from './screens/loginCadastro/TelaCadastro'
import TelaFinalizarCadastro from './screens/loginCadastro/TelaFinalizarCadastro'
import ModalErroGenerico from './screens/ModalErroGenerico'

const Stack = createStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name="login"
                    component={TelaLogin}
                />
                <Stack.Screen
                    name="cadastro"
                    component={TelaCadastro}
                />
                <Stack.Screen
                    name="finalizarCadastro"
                    component={TelaFinalizarCadastro}
                />
                <Stack.Screen
                    name="home"
                    component={TelaHome}
                />
                <Stack.Screen
                    name="modalErro"
                    component={ModalErroGenerico}
                    options={{
                        presentation: 'transparentModal',
                        animationEnabled: true,
                        cardOverlay: true
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}