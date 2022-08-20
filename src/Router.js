import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import TelaHome from './screens/home/TelaHome'
import TelaLogin from './screens/loginCadastro/TelaLogin'
import TelaCadastro from './screens/loginCadastro/TelaCadastro'
import TelaFinalizarCadastro from './screens/loginCadastro/TelaFinalizarCadastro'
import ModalErroGenerico from './screens/ModalErroGenerico'
import TelaCadastroVeiculo from './screens/motorista/cadastroVeiculo'

const Stack = createStackNavigator()

export default function App() {
    //Usar o token guardado na store para validar o usuario
    //Caso logado, ir para home
    //Caso deslogado, ir para login/registrar
    return (
        <NavigationContainer ref={navigationRef}>
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
                    name="veiculo"
                    component={TelaVeiculo}
                />
                <Stack.Screen
                    name="pesquisaMotorista"
                    component={TelaPesquisaMotorista}
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