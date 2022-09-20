import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import TelaHome from './screens/home/TelaHome'
import TelaLogin from './screens/loginCadastro/TelaLogin'
import TelaCadastro from './screens/loginCadastro/TelaCadastro'
import TelaFinalizarCadastro from './screens/loginCadastro/TelaFinalizarCadastro'
import ModalErroGenerico from './screens/ModalErroGenerico'
import TelaVeiculo from './screens/motorista/TelaVeiculo'
import TelaPesquisaMotorista from './screens/estudante/TelaPesquisaMotorista'
import { useSelector } from 'react-redux'
import TelaMapa from './screens/TelaMapa'
import TelaRota from './screens/motorista/TelaRota'
import TelaNotificacoes from './screens/motorista/TelaNotificacoes'
import {navigationRef} from './apis/AuthContext';


const Stack = createStackNavigator()

export default function App() {
    const store = useSelector(({ user }) => {
        return {
            user: user
        }
    })
    //Usar o token guardado na store para validar o usuario
    //Caso logado, ir para home
    //Caso deslogado, ir para login/registrar
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{headerShown: false }}>
                {store.user.access_token ? 
                <>
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
                    name="mapa"
                    component={TelaMapa}
                />
                <Stack.Screen
                    name="telaRota"
                    component={TelaRota}
                />
                <Stack.Screen
                    name="notificacoes"
                    component={TelaNotificacoes}
                />
            </>: 
            <>
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
                </>
                }
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