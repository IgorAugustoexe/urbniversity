import React, { Fragment, useState } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native'
import { config, cores, estilos } from '../styles/Estilos'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextInputMask } from 'react-native-masked-text'
import NavBar from '../components/NavBar'
import BtnBlue from '../components/BtnBlue'
import InputDadosUser, { stylesInput } from '../components/InputDadosUser'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCarSide } from '@fortawesome/free-solid-svg-icons/faCarSide'
import { faIdCard } from '@fortawesome/free-solid-svg-icons/faIdCard'
import { faSchool } from '@fortawesome/free-solid-svg-icons/faSchool'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons/faGraduationCap'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot'


type navigation = {
    props: {
        isDrive: boolean
    }
}

export default function TelaFinalizacaoCadastro() {
    const navigation = useNavigation<any>()
    const route = useRoute<RouteProp<navigation, 'props'>>()

    console.log(route.params.isDrive)

    const [cnh, setCnh] = useState<string>('')
    const [cpf, setCpf] = useState<string>('')
    const [faculdade, setFaculdade] = useState<string>('')
    const [curso, setCurso] = useState<string>('')

    const [cep, setCep] = useState<string>('')
    const [endereco, setEndereco] = useState<string>('')
    const [numero, setNumero] = useState<string>('')
    const [bairro, setBairro] = useState<string>('')
    const [estado, setEstado] = useState<string>('')
    const [cidade, setCidade] = useState<string>('')
    const [complemento, setComplemento] = useState<string>('')

    const [txtCnhInvalida, setTxtCnhInvalida] = useState<string>('')
    const [txtCpfInvalido, setTxtCpfInvalido] = useState<string>('')
    const [txtFaculdadeInvalida, setTxtFaculdadeInvalida] = useState<string>('')
    const [txtCursoInvalido, setTxtCursoInvalido] = useState<string>('')
    const [txtCepInvalido, setTxtCepInvalido] = useState<string>('')
    const [txtEnderecoInvalido, setTxtEnderecoInvalido] = useState<string>('')
    const [txtNumeroInvalido, setTxtNumeroInvalido] = useState<string>('')
    const [txtBairroInvalido, setTxtBairroInvalido] = useState<string>('')

    const [loaderReq, setLoaderReq] = useState<boolean>(false)
    const [loaderCEp, setLoaderCep] = useState<boolean>(false)

    const [cepGeral, setCepGeral] = useState<boolean>(false)

    const finalizarCadastro = () => {

    }

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <NavBar titulo='Finalizar Cadastro' botaoEsquerdo={true} backgroundColor={cores.backgroundPadrao} />
            <KeyboardAwareScrollView
                extraHeight={config.windowWidth / 2}
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: cores.fonteBranco, fontWeight: '700', padding: config.windowWidth / 20, textAlign: 'center' }}>Tudo certo agora vamos finalizar seu cadastro como {route.params.isDrive ? 'Motorista' : 'Estudante'}!</Text>
                </View>

                {route.params.isDrive ?
                    <Fragment>
                        <View style={styles.espacoInputs}>
                            <InputDadosUser
                                onChangeText={(text) => setCnh(text)}
                                value={cnh}
                                textoInput={'CNH'}
                                placeholder={'Digite o número da sua CNH'}
                                keyboardType={'number-pad'}
                                onFocus={() => txtCnhInvalida.length > 0 && setTxtCnhInvalida('')}
                                txtErro={txtCnhInvalida}
                                icon={faCarSide}
                                maxLenght={11}
                            />
                        </View>
                        <View style={styles.espacoInputs}>
                            <Text style={[stylesInput.txtInput, txtCpfInvalido.length > 0 && { color: cores.vermelhoBorder }]}>CPF</Text>
                            <TextInputMask
                                style={[stylesInput.inputStyle, txtCpfInvalido.length > 0 && { borderColor: cores.vermelhoBorder }]}
                                value={cpf}
                                type={'cpf'}
                                placeholder={'Digite o número do seu CPF'}
                                placeholderTextColor={cores.fonteCinza}
                                onChangeText={(text) => setCpf(text)}
                                onFocus={() => txtCpfInvalido.length > 0 && setTxtCpfInvalido('')}
                                maxLength={14}
                            />
                            <FontAwesomeIcon icon={faIdCard} size={config.windowWidth / 16} color={txtCpfInvalido.length > 0 ? cores.vermelhoBorder : cores.branco} style={stylesInput.styleIcon} />
                            {txtCpfInvalido.length > 0 &&
                                <View style={stylesInput.containerInputInvalido}>
                                    <Text style={stylesInput.txtErro}>{txtCpfInvalido}</Text>
                                </View>
                            }
                        </View>
                    </Fragment>
                    :
                    <Fragment>
                        <View style={[styles.espacoInputs, { width: '90%', marginLeft: config.windowWidth / 20 }]}>
                            <Text style={[stylesInput.txtInput, txtCpfInvalido.length > 0 && { color: cores.vermelhoBorder }]}>CPF</Text>
                            <TextInputMask
                                style={[stylesInput.inputStyle, txtCpfInvalido.length > 0 && { borderColor: cores.vermelhoBorder }]}
                                value={cpf}
                                type={'cpf'}
                                placeholder={'Digite o número do seu CPF'}
                                placeholderTextColor={cores.fonteCinza}
                                onChangeText={(text) => setCpf(text)}
                                onFocus={() => txtCpfInvalido.length > 0 && setTxtCpfInvalido('')}
                                maxLength={14}
                            />
                            <FontAwesomeIcon icon={faIdCard} size={config.windowWidth / 16} color={txtCpfInvalido.length > 0 ? cores.vermelhoBorder : cores.branco} style={stylesInput.styleIcon} />
                            {txtCpfInvalido.length > 0 &&
                                <View style={stylesInput.containerInputInvalido}>
                                    <Text style={stylesInput.txtErro}>{txtCpfInvalido}</Text>
                                </View>
                            }
                        </View>
                        <View style={styles.espacoInputs}>
                            <InputDadosUser
                                onChangeText={(text) => setFaculdade(text)}
                                value={faculdade}
                                textoInput={'Faculdade'}
                                placeholder={'Digite o nome da sua Faculdade'}
                                onFocus={() => txtFaculdadeInvalida.length > 0 && setTxtFaculdadeInvalida('')}
                                txtErro={txtFaculdadeInvalida}
                                icon={faSchool}
                            />
                        </View>
                        <View style={styles.espacoInputs}>
                            <InputDadosUser
                                onChangeText={(text) => setCurso(text)}
                                value={curso}
                                textoInput={'Curso'}
                                placeholder={'Digite o nome do seu Curso'}
                                onFocus={() => txtCursoInvalido.length > 0 && setTxtCursoInvalido('')}
                                txtErro={txtCursoInvalido}
                                icon={faGraduationCap}
                            />
                        </View>
                        <View style={[styles.espacoInputs, { flexDirection: 'row' }]}>
                            <InputDadosUser
                                style={{ width: '40%' }}
                                styleIcon={{ right: 0 }}
                                onChangeText={(text) => setCep(text)}
                                value={cep}
                                textoInput={'CEP'}
                                placeholder={'Digite seu CEP'}
                                keyboardType={'number-pad'}
                                onFocus={() => txtCepInvalido.length > 0 && setTxtFaculdadeInvalida('')}
                                txtErro={txtCepInvalido}
                                icon={faLocationDot}
                                maxLenght={9}
                            />
                            <TouchableOpacity style={{ justifyContent: 'center', left: config.windowWidth / 10, top: 10 }}>
                                <Text style={{ fontSize: 13, color: cores.azulBtn, fontWeight: '700', textDecorationLine: 'underline' }}>NÃO SEI MEU CEP</Text>
                            </TouchableOpacity>
                        </View>
                    </Fragment>
                }

                <TouchableOpacity onPress={() => finalizarCadastro()} disabled={loaderReq} style={styles.btnRodape}>
                    <BtnBlue
                        text={'FINALIZAR CADASTRO'}
                        loader={loaderReq}
                    />
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    espacoInputs: {
        paddingTop: 10
    },

    btnRodape: {
        marginVertical: config.windowWidth / 8,
        marginHorizontal: config.windowWidth / 5
    }

})