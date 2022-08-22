import React, { Fragment, useState, useContext, useEffect } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native'
import { config, cores, estilos } from '../../styles/Estilos'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { verificaEmail } from '../../helpers/FuncoesPadrao'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock'
import { faUserGraduate } from '@fortawesome/free-solid-svg-icons/faUserGraduate'
import { faVanShuttle } from '@fortawesome/free-solid-svg-icons/faVanShuttle'
import BtnBlue from '../../components/BtnBlue'
import InputDadosUser from '../../components/InputDadosUser'
import { AuthContext } from '../../apis/AuthContext';

export default function TelaLogin() {
    const navigation = useNavigation<any>()


    const [email, setEmail] = useState<string>('email@email.com')
    const [senha, setSenha] = useState<string>('senha@senha')

    const [txtEmailInvalido, setTxtEmailInvalido] = useState<string>('')
    const [txtSenhaInvalida, setTxtSenhaInvalida] = useState<string>('')

    const [loginMotorista, setLoginMotorista] = useState<boolean>(false)
    const [loaderReq, setLoaderReq] = useState<boolean>(false)

    const { userInfo, login } = useContext(AuthContext)

    const validarEmail = (email: string) => {
        const verificaRespostaEmail = verificaEmail(email)
        if (!verificaRespostaEmail) {
            setTxtEmailInvalido('Email Inválido')
            return false
        }
        return true
    }

    const validarSenha = (senha: string) => {
        if (senha.length <= 6) {
            setTxtSenhaInvalida('Senha muito curta mínimo 7 caracteres')
            return false
        }
        return true
    }

    const alternarFormaLogin = () => {
        setLoginMotorista(!loginMotorista)
    }

    const realizarLogin = () => {
        setLoaderReq(true)

        navigation.navigate('home', { isDrive: true })

        txtEmailInvalido.length > 0 && setTxtEmailInvalido('')
        txtSenhaInvalida.length > 0 && setTxtSenhaInvalida('')

        validarEmail(email)
        validarSenha(senha)

        if ((!validarEmail(email)) || (!validarSenha(senha))) {
            setLoaderReq(false)
            return
        }
        try {
            login(email, senha, setLoaderReq)
            navigation.navigate("home", { isDrive: true })
        } catch (error) {
            console.log(error)
        }

    }

    // useEffect(() => {
    //     //This code makes the same as isLoggedIn from src/apis/AuthContext without the request part. Is necessary (At least for now) 
    //     //to continue the login process by verifying if the userInfo has the access token to foward the user
    //     if (!userInfo.access_token) {
    //         setLoaderReq(true)

    //         userInfo.type == 'driver' ?
    //             navigation.navigate('home', { isDrive: true })
    //             :
    //             navigation.navigate('home', { isDrive: false })

    //         setLoaderReq(false)
    //     }
    // }, [userInfo.access_token]);

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <KeyboardAwareScrollView
                extraHeight={config.windowWidth / 2}
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.txtLogo}>URBNiversity</Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                        <Text style={styles.txtTipoLogin}>{loginMotorista ? 'MOTORISTA' : 'ESTUDANTE'}</Text>
                        <FontAwesomeIcon icon={loginMotorista ? faVanShuttle : faUserGraduate} size={config.windowWidth / 16} color={cores.azulBtn} style={{ left: 10 }} />
                    </View>
                </View>
                <Fragment>
                    <View style={{ paddingVertical: config.windowWidth / 10, alignItems: 'center' }}>
                        <Text style={styles.txtBold}>Login</Text>
                    </View>
                    <View style={styles.espacoInputs}>
                        <InputDadosUser
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            textoInput={'Email'}
                            placeholder={'Digite seu Email'}
                            keyboardType={'email-address'}
                            onFocus={() => txtEmailInvalido.length > 0 && setTxtEmailInvalido('')}
                            txtErro={txtEmailInvalido}
                            icon={faEnvelope}
                            autoCapitalize={'none'}
                        />
                    </View>
                    <View style={styles.espacoInputs}>
                        <InputDadosUser
                            onChangeText={(text) => setSenha(text)}
                            value={senha}
                            textoInput={'Senha'}
                            placeholder={'Digite sua Senha'}
                            onFocus={() => txtSenhaInvalida.length > 0 && setTxtSenhaInvalida('')}
                            txtErro={txtSenhaInvalida}
                            icon={faLock}
                            autoCapitalize={'none'}
                            secureText={true}
                        />
                    </View>
                </Fragment>

                <TouchableOpacity onPress={() => realizarLogin()} disabled={loaderReq} style={{ marginVertical: config.windowWidth / 8, marginHorizontal: config.windowWidth / 4 }}>
                    <BtnBlue
                        text={'ENTRAR'}
                        loader={loaderReq}
                    />
                </TouchableOpacity>

                <View style={{ marginHorizontal: config.windowWidth / 10 }}>
                    <TouchableOpacity
                        style={{ alignItems: 'center' }}
                        onPress={() => navigation.navigate('cadastro')}
                        hitSlop={styles.hitSlopBtns}
                    >
                        <Text style={styles.txt}>Não tem uma conta?
                            <Text style={[styles.txt, { color: cores.fonteBranco }]}> Cadastre-se</Text>
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.bordaDivisoria}>
                        <Text style={styles.txtBordaDivisoria}>OU</Text>
                    </View>
                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => alternarFormaLogin()} hitSlop={styles.hitSlopBtns}>
                        <Text style={styles.txtUnderline}>Entrar como {loginMotorista ? 'Estudante' : 'Motorista'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    header: {
        paddingTop: config.windowWidth / 10, paddingHorizontal: config.windowWidth / 4
    },

    txtLogo: {
        fontSize: 26,
        fontWeight: '700',
        color: cores.fonteBranco,
    },

    txtTipoLogin: {
        fontSize: 18,
        fontWeight: 'bold',
        color: cores.azulBtn
    },

    txtBold: {
        fontSize: 26,
        fontWeight: 'bold',
        color: cores.fonteBranco
    },

    txtInput: {
        fontSize: 16,
        color: cores.fonteBranco
    },

    inputStyle: {
        borderBottomWidth: 1,
        borderColor: cores.azulBtn,
        padding: 5,
        color: cores.fonteBranco,
        paddingRight: config.windowWidth / 9
    },

    styleIcon: {
        position: 'absolute',
        right: 10,
        bottom: 10
    },

    espacoInputs: {
        paddingTop: 10
    },

    containerInputInvalido: {
        position: 'absolute',
        bottom: -20,
        right: 5
    },

    txtInputInvalido: {
        fontSize: 14,
        color: cores.vermelhoBorder
    },


    txt: {
        color: cores.fonteCinza,
        fontSize: 14
    },

    bordaDivisoria: {
        alignItems: 'center',
        marginVertical: config.windowWidth / 13,
        borderTopWidth: 2,
        borderColor: cores.fonteCinza
    },

    txtBordaDivisoria: {
        position: 'absolute',
        backgroundColor: cores.backgroundPadrao,
        color: cores.fonteBranco,
        fontSize: 14,
        paddingHorizontal: 5,
        top: -10
    },

    txtUnderline: {
        fontSize: 18,
        fontWeight: 'bold',
        color: cores.fonteBranco,
        textDecorationLine: 'underline'
    },

    hitSlopBtns: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    }

})