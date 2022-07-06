import React, { useState, Fragment } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native'
import { config, cores, estilos } from '../styles/Estilos'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { validarEmail } from '../helpers/FuncoesPadrao'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons/faGraduationCap'
import { faVanShuttle } from '@fortawesome/free-solid-svg-icons/faVanShuttle'
import BtnBlue from '../components/BtnBlue'


export default function TelaLogin() {
    const navigation = useNavigation<any>()

    const [email, setEmail] = useState<string>('')
    const [senha, setSenha] = useState<string>('')

    const [txtEmailInvalido, setTxtEmailInvalido] = useState<string>('')
    const [txtSenhaInvalida, setTxtSenhaInvalida] = useState<string>('')

    const [isDrive, setIsDrive] = useState<boolean>(false)
    const [loaderReq, setLoaderReq] = useState<boolean>(false)

    const verificaEmail = (email: string) => {
        const verificaRespostaEmail = validarEmail(email)
        if (!verificaRespostaEmail) {
            setTxtEmailInvalido('Email Inválido')
            return false
        }
        return true
    }

    const verificaSenha = (senha: string) => {
        if (senha.length <= 6) {
            setTxtSenhaInvalida('Senha muito curtam mínimo 7 caracteres')
            return false
        }
        return true
    }

    const alternarFormaLogin = () => {
        setIsDrive(!isDrive)
    }

    const realizarLogin = () => {
        setLoaderReq(true)

        txtEmailInvalido.length > 0 && setTxtEmailInvalido('')
        txtSenhaInvalida.length > 0 && setTxtSenhaInvalida('')

        verificaEmail(email)
        verificaSenha(senha)

        if ((!verificaEmail(email)) || (!verificaSenha(senha))) {
            setLoaderReq(false)
            return
        }
        // IMPLENTAR REQUISIÇÃO
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
                        <Text style={styles.txtTipoLogin}>{isDrive ? 'MOTORISTA' : 'ESTUDANTE'}</Text>
                        <FontAwesomeIcon icon={isDrive ? faVanShuttle : faGraduationCap} size={config.windowWidth / 16} color={cores.azulBtn} style={{ left: 10 }} />
                    </View>
                </View>

                <View style={{ paddingHorizontal: config.windowWidth / 20 }}>
                    <View style={{ paddingVertical: config.windowWidth / 10, alignItems: 'center' }}>
                        <Text style={styles.txtBold}>Login</Text>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                        <Text style={[styles.txtInput, txtEmailInvalido.length > 0 && { color: cores.vermelhoBorder }]}>Email</Text>
                        <TextInput
                            style={[styles.inputStyle, txtEmailInvalido.length > 0 && { borderColor: cores.vermelhoBorder }]}
                            value={email}
                            keyboardType={'email-address'}
                            onChangeText={(text) => setEmail(text)}
                            placeholder={'Digite seu Email'}
                            placeholderTextColor={cores.fonteCinza}
                            autoCapitalize={'none'}
                        />
                        <FontAwesomeIcon icon={faEnvelope} size={config.windowWidth / 16} color={txtEmailInvalido.length > 0 ? cores.vermelhoBorder : cores.branco} style={styles.styleIcon} />
                        {txtEmailInvalido.length > 0 &&
                            <View style={styles.containerInputInvalido}>
                                <Text style={styles.txtInputInvalido}>{txtEmailInvalido}</Text>
                            </View>
                        }
                    </View>

                    <View style={{ paddingTop: 10 }}>
                        <Text style={[styles.txtInput, txtSenhaInvalida.length > 0 && { color: cores.vermelhoBorder }]}>Senha</Text>
                        <TextInput
                            style={[styles.inputStyle, txtSenhaInvalida.length > 0 && { borderColor: cores.vermelhoBorder }]}
                            value={senha}
                            secureTextEntry={true}
                            onChangeText={(text) => setSenha(text)}
                            placeholder={'Digite sua Senha'}
                            placeholderTextColor={cores.fonteCinza}
                            autoCapitalize={'none'}
                        />
                        <FontAwesomeIcon icon={faLock} size={config.windowWidth / 16} color={txtSenhaInvalida.length > 0 ? cores.vermelhoBorder : cores.branco} style={styles.styleIcon} />
                        {txtSenhaInvalida.length > 0 &&
                            <View style={styles.containerInputInvalido}>
                                <Text style={styles.txtInputInvalido}>{txtSenhaInvalida}</Text>
                            </View>
                        }
                    </View>
                </View>

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
                        <Text style={styles.txtUnderline}>Entrar como {isDrive ? 'Estudante' : 'Motorista'}</Text>
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
        ontSize: 14,
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