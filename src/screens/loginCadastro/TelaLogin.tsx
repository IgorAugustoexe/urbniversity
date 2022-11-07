import React, { Fragment, useState, useContext, useEffect } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert, PermissionsAndroid, Linking } from 'react-native'
import { config, cores, estilos } from '../../styles/Estilos'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { verificaEmail } from '../../helpers/FuncoesPadrao'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEnvelope, faLock, faUserGraduate, faVanShuttle } from '@fortawesome/free-solid-svg-icons'
import BtnBlue from '../../components/BtnBlue'
import InputDadosUser from '../../components/InputDadosUser'
import { AuthContext } from '../../apis/AuthContext'
import { requisitarPermissaoArmazenamento, requisitarPermissaoLocalizacao } from '../../controllers/PermissoesController'

export default function TelaLogin() {
    const navigation = useNavigation<any>()

    //Estudante
    //oliveira.luiz85@gmail.cm -> com motorista
    //vonishope.0134@gmail.com -> sem motorista

    //Motorista
    //email@email.com -> sem veiculo e sem rota
    //email@andrephoto.com -> com rota, com veiculo e com estudante

    //Todos os logins acima tem como senha: senha@senha

    const [email, setEmail] = useState<string>('oliveira.luiz85@gmail.cm')
    const [senha, setSenha] = useState<string>('senha@senha')

    const [txtEmailInvalido, setTxtEmailInvalido] = useState<string>('')
    const [txtSenhaInvalida, setTxtSenhaInvalida] = useState<string>('')

    const [loginMotorista, setLoginMotorista] = useState<boolean>(false)
    const [loaderReq, setLoaderReq] = useState<boolean>(false)

    const { login } = useContext(AuthContext)

    useEffect(() => {
        didMount()
    }, [])

    const didMount = () => {
        solicitarLocalizacao()
        solicitarArmazenamento()
    }

    const solicitarLocalizacao = async () => {
        const permissaoLocalizacao = await requisitarPermissaoLocalizacao()
        if (permissaoLocalizacao != PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
                "Permissão da Localização",
                "Libere o acesso ao Urbniversity para acessar sua localização.",
                [
                    {
                        text: "Cancelar"
                    },
                    { text: "Liberar Acesso", onPress: () => Linking.openSettings() }
                ]
            )
        }
    }

    const solicitarArmazenamento = async () => {
        const permissaoArmazenamento = await requisitarPermissaoArmazenamento()
        if (permissaoArmazenamento != PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
                "Permissão de armazenamento",
                "Libere o acesso ao Urbniversity para acessar seu armazenamento.",
                [
                    {
                        text: "Cancelar"
                    },
                    { text: "Liberar Acesso", onPress: () => Linking.openSettings() }
                ]
            )
            return
        }
    }

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
        if (!loginMotorista) {
            setEmail('email@andrephoto.com')
            return
        }
        setEmail('oliveira.luiz85@gmail.cm')
    }

    const realizarLogin = () => {
        setLoaderReq(true)
        try {
            setLoaderReq(true)

            txtEmailInvalido.length > 0 && setTxtEmailInvalido('')
            txtSenhaInvalida.length > 0 && setTxtSenhaInvalida('')

            validarEmail(email)
            validarSenha(senha)

            if ((!validarEmail(email)) || (!validarSenha(senha))) {
                setLoaderReq(false)
                return
            }
            login(email, senha, setLoaderReq)
        } catch (error) {
            console.log(error)
        } finally {
            setLoaderReq(false)
        }
    }

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

                <TouchableOpacity onPress={() => realizarLogin()} style={{ marginVertical: config.windowWidth / 8, marginHorizontal: config.windowWidth / 4 }}>
                    <BtnBlue
                        text={'ENTRAR'}
                        loader={loaderReq}
                    />
                </TouchableOpacity>

                <View style={{ marginHorizontal: config.windowWidth / 10 }}>
                    <TouchableOpacity
                        disabled={loaderReq}
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
                    {<TouchableOpacity
                        disabled={loaderReq}
                        style={{ alignItems: 'center' }}
                        onPress={() => alternarFormaLogin()}
                        hitSlop={styles.hitSlopBtns}>
                        <Text style={styles.txtUnderline}>Entrar como {loginMotorista ? 'Estudante' : 'Motorista'}</Text>
                    </TouchableOpacity>}
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    header: {
        paddingTop: config.windowWidth / 10,
        paddingHorizontal: config.windowWidth / 4
    },
    txtLogo: {
        fontSize: 26,
        fontWeight: '700',
        color: cores.fonteBranco
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