import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { config, cores, estilos } from '../../styles/Estilos'
import { useNavigation } from '@react-navigation/native'
import { faEnvelope, faLock, faPhone, faUser } from '@fortawesome/free-solid-svg-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AsYouType } from 'libphonenumber-js'
import { verificaEmail } from '../../helpers/FuncoesPadrao'
import NavBar from '../../components/NavBar'
import InputDadosUser from '../../components/InputDadosUser'
import BtnBlue from '../../components/BtnBlue'

export default function TelaCadastro() {
    const navigation = useNavigation<any>()

    const [email, setEmail] = useState<string>('')
    const [nome, setNome] = useState<string>('')
    const [telefone, setTelefone] = useState<string>('')
    const [senha, setSenha] = useState<string>('')

    const [txtEmailInvalido, setTxtEmailInvalido] = useState<string>('')
    const [txtNomeInvalido, setTxtNomeInvalido] = useState<string>('')
    const [txtTelefoneInvalido, setTxtTelefoneInvalido] = useState<string>('')
    const [txtSenhaInvalida, setTxtSenhaInvalida] = useState<string>('')

    const [tipoCadastro, setTipoCadastro] = useState<number>(0)
    const [tipoCadastrovalido, setTipoCadastroValido] = useState<boolean>(true)
    const [loaderReq, setLoaderReq] = useState<boolean>(false)

    const attTextTelefone = (text: string) => {
        if (text.length >= 4) {
            const telefoneFormatado = new AsYouType('BR').input(text)
            setTelefone(telefoneFormatado)
            return
        }
        setTelefone(text)
    }

    const validarTipoCadastro = (tipoCadastro: number) => {
        if (tipoCadastro == 0) {
            setTipoCadastroValido(false)
            return false
        }
        return true
    }

    const validarEmail = (email: string) => {
        const verificaRespostaEmail = verificaEmail(email)
        if (!verificaRespostaEmail) {
            setTxtEmailInvalido('Email Inválido')
            return false
        }
        return true
    }

    const validarNome = (nome: string) => {
        const reg = /\b[A-Za-zÀ-ú][A-Za-zÀ-ú]+,?\s[A-Za-zÀ-ú][A-Za-zÀ-ú]{2,19}\b/gi
        if (!(reg.test(nome.trim()))) {
            setTxtNomeInvalido('Nome Inválido')
            return false
        }
        return true
    }

    const validarTelefone = (telefone: string) => {
        if (telefone.length <= 13) {
            setTxtTelefoneInvalido('Telefone Inválido')
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

    const realizarCadastro = () => {
        setLoaderReq(true)
        !tipoCadastrovalido && setTipoCadastroValido(true)
        txtEmailInvalido.length > 0 && setTxtEmailInvalido('')
        txtNomeInvalido.length > 0 && setTxtNomeInvalido('')
        txtSenhaInvalida.length > 0 && setTxtSenhaInvalida('')

        if ((!validarTipoCadastro(tipoCadastro)) || (!validarEmail(email)) || (!validarNome(nome)) || (!validarTelefone(telefone)) || (!validarSenha(senha))) {
            setLoaderReq(false)
            return
        }
        if (tipoCadastro == 2) {
            navigation.navigate('finalizarCadastro', { isDrive: true, email, nome, telefone, senha })
        } else {
            navigation.navigate('finalizarCadastro', { isDrive: false, email, nome, telefone, senha })
        }
        setLoaderReq(false)
    }

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <NavBar titulo='Registrar Conta' botaoEsquerdo={true} backgroundColor={cores.backgroundPadrao} />
            <KeyboardAwareScrollView
                extraHeight={config.windowWidth / 2}
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingTop: config.windowWidth / 20 }}>
                    <View>
                        <Text style={[styles.txt, !tipoCadastrovalido && { color: cores.vermelhoBorder }]}>Deseja-se Cadastrar como?</Text>
                        <View style={styles.containerBtnTipoCadastro}>
                            <TouchableOpacity
                                style={[styles.btn, tipoCadastro == 1 && { backgroundColor: cores.azulPrimario, borderColor: cores.branco }, !tipoCadastrovalido && { borderColor: cores.vermelhoBorder }]}
                                onPress={() => { setTipoCadastro(1), setTipoCadastroValido(true) }}
                            >
                                <Text style={[styles.txtBtn, !tipoCadastrovalido && { color: cores.vermelhoBorder }]}>Estudante</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.btn, tipoCadastro == 2 && { backgroundColor: cores.azulPrimario, borderColor: cores.branco }, !tipoCadastrovalido && { borderColor: cores.vermelhoBorder }]}
                                onPress={() => { setTipoCadastro(2), setTipoCadastroValido(true) }}
                            >
                                <Text style={[styles.txtBtn, !tipoCadastrovalido && { color: cores.vermelhoBorder }]}>Motorista</Text>
                            </TouchableOpacity>
                        </View>
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
                            onChangeText={(text) => setNome(text)}
                            value={nome}
                            textoInput={'Nome e Sobrenome'}
                            placeholder={'Digite seu Nome e Sobrenome'}
                            onFocus={() => txtNomeInvalido.length > 0 && setTxtNomeInvalido('')}
                            txtErro={txtNomeInvalido}
                            icon={faUser}
                        />
                    </View>
                    <View style={styles.espacoInputs}>
                        <InputDadosUser
                            onChangeText={(text) => attTextTelefone(text)}
                            value={telefone}
                            textoInput={'Telefone'}
                            placeholder={'Digite seu Número de Telefone'}
                            keyboardType={'number-pad'}
                            onFocus={() => txtTelefoneInvalido.length > 0 && setTxtTelefoneInvalido('')}
                            txtErro={txtTelefoneInvalido}
                            maxLenght={15}
                            icon={faPhone}

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
                            secureText={true}
                            autoCapitalize={'none'}
                            icon={faLock}
                        />
                    </View>
                </View>

                <TouchableOpacity onPress={() => realizarCadastro()} disabled={loaderReq} style={styles.btnRodape}>
                    <BtnBlue
                        text={'CADASTRAR'}
                        loader={loaderReq}
                    />
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    txt: {
        fontSize: 16,
        color: cores.fonteBranco,
        textAlign: 'center',
        fontWeight: '500'
    },
    containerBtnTipoCadastro: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingBottom: config.windowWidth / 20
    },
    btn: {
        backgroundColor: cores.disabled,
        borderColor: cores.disabled,
        borderWidth: 1, borderRadius: 20,
        padding: 10,
        marginTop: config.windowWidth / 20,
        alignItems: 'center'
    },
    txtBtn: {
        fontSize: 16,
        color: cores.fonteBranco,
        fontWeight: '700'
    },
    espacoInputs: {
        paddingTop: 10
    },
    btnRodape: {
        marginVertical: config.windowWidth / 8,
        marginHorizontal: config.windowWidth / 4
    }
})