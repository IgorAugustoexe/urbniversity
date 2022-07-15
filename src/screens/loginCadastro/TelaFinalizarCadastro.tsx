import React, { Fragment, useState } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { config, cores, estilos } from '../../styles/Estilos'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextInputMask } from 'react-native-masked-text'
import NavBar from '../../components/NavBar'
import BtnBlue from '../../components/BtnBlue'
import InputDadosUser, { stylesInput } from '../../components/InputDadosUser'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCarSide } from '@fortawesome/free-solid-svg-icons/faCarSide'
import { faIdCard } from '@fortawesome/free-solid-svg-icons/faIdCard'
import { faSchool } from '@fortawesome/free-solid-svg-icons/faSchool'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons/faGraduationCap'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot'
import { faTreeCity } from '@fortawesome/free-solid-svg-icons/faTreeCity'
import { faHouseChimneyUser } from '@fortawesome/free-solid-svg-icons/faHouseChimneyUser'
import { removerAcento } from '../../helpers/FuncoesPadrao'
import { pesquisaEndereco } from '../../apis/shearchApi'

type navigation = {
    props: {
        isDrive: boolean
    }
}

export default function TelaFinalizarCadastro() {
    const navigation = useNavigation<any>()
    const route = useRoute<RouteProp<navigation, 'props'>>()

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
    const [loaderCep, setLoaderCep] = useState<boolean>(false)

    const validarCpf = (cpfFormatado: string) => {
        if (cpfFormatado.length <= 10) {
            setTxtCpfInvalido('CPF Inválido')
            return false
        }
        return true
    }

    const validarCnh = (cnh: string) => {
        if (cnh.length <= 13) {
            setTxtCnhInvalida('CNH Inválida')
            return false
        }
        return true
    }

    const validarFaculdade = (faculdade: string) => {
        if (faculdade.length == 0) {
            setTxtFaculdadeInvalida('Campo Obrigatório')
            return false
        }
        return true
    }

    const validarCep = (cep: string) => {
        if (cep.length == 0) {
            setTxtCepInvalido('Campo Obrigatório')
            return false
        }
        return true
    }

    const validarCurso = (curso: string) => {
        if (curso.length == 0) {
            setTxtCursoInvalido('Campo Obrigatório')
            return false
        }
        return true
    }

    const validarEndereco = (endereco: string) => {
        if (endereco.length == 0) {
            setTxtEnderecoInvalido('Campo Obrigatório')
            return false
        }
        return true
    }

    const validarNumero = (numero: string) => {
        if (numero.length == 0) {
            setTxtNumeroInvalido('Campo Obrigatório')
            return false
        }
        return true
    }

    const validarBairro = (bairro: string) => {
        if (bairro.length == 0) {
            setTxtBairroInvalido('Campo Obrigatório')
            return false
        }
        return true
    }

    const finalizarCadastro = () => {
        setLoaderReq(true)

        if (route.params.isDrive) {
            navigation.navigate('home', { isDrive: true })
        } else {
            navigation.naviate('home', { isDrive: false })
        }

        setLoaderReq(false)

        return
        txtCpfInvalido.length > 0 && setTxtCpfInvalido('')
        txtCnhInvalida.length > 0 && setTxtCnhInvalida('')
        txtFaculdadeInvalida.length > 0 && setTxtFaculdadeInvalida('')
        txtCursoInvalido.length > 0 && setTxtCursoInvalido('')
        txtCepInvalido.length > 0 && setTxtCepInvalido('')
        txtEnderecoInvalido.length > 0 && setTxtEnderecoInvalido('')
        txtNumeroInvalido.length > 0 && setTxtNumeroInvalido('')
        txtBairroInvalido.length > 0 && setTxtBairroInvalido('')

        const cpfFormatado = removerAcento(cpf)

        validarCpf(cpfFormatado)

        if (route.params.isDrive) {
            validarCnh(cnh)
            if ((!validarCnh(cnh)) || (!validarCpf(cpf))) {
                setLoaderReq(false)
                return
            }
        }

        validarFaculdade(faculdade)
        validarCurso(curso)
        validarCep(cep)
        validarEndereco(endereco)
        validarNumero(numero)
        validarBairro(bairro)

        if ((!validarCpf(cpf)) || (!validarFaculdade(faculdade)) || (!validarCurso(curso)) || (!validarCep(cep)) || (!validarEndereco(endereco)) || (!validarNumero(numero)) || (!validarBairro(bairro))) {
            setLoaderReq(false)
            return
        }

        if (route.params.isDrive) {
            navigation.navigate('home', { isDrive: true })
        } else {
            navigation.naviate('home', { isDrive: false })
        }
    }

    const pesquisarCep = async (text: string) => {
        text = text.trim()
        setCep(text)

        if (text.length == 8) {
            setLoaderCep(true)
            try {
                const resp = await pesquisaEndereco(text)
                if (resp) {
                    if (resp.localidade) {
                        setCidade(resp.localidade)
                        setEstado(resp.uf)
                        setEndereco(resp.logradouro)
                        setBairro(resp.bairro)
                        return
                    }
                    setTxtCepInvalido('CEP Inválido')
                }
            } catch (error) {
                console.log('erro TelaFinalizacaoCadastro/pesquisaCep:', error)
                setTxtCepInvalido('CEP Inválido')
            } finally {
                setLoaderCep(false)
            }
        } else {
            loaderCep && setLoaderCep(false)
        }
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
                                onChangeText={(text) => pesquisarCep(text)}
                                value={cep}
                                textoInput={'CEP'}
                                placeholder={'Digite seu CEP'}
                                keyboardType={'number-pad'}
                                onFocus={() => txtCepInvalido.length > 0 && setTxtCepInvalido('')}
                                txtErro={txtCepInvalido}
                                icon={faLocationDot}
                                maxLenght={8}
                            />
                            {loaderCep &&
                                <View style={{ justifyContent: 'center', left: config.windowWidth / 10, top: 10 }}>
                                    <ActivityIndicator color={cores.azulBtn} size={'small'} />
                                    <Text style={{ fontSize: 13, color: cores.branco, fontWeight: '700' }}>Procurando CEP...</Text>

                                </View>
                            }
                        </View>
                        <View style={[{ paddingTop: 15, flexDirection: 'row' }]}>
                            <View style={{ width: '65%', marginLeft: config.windowWidth / 20 }}>
                                <Text style={stylesInput.txtInput}>Cidade</Text>
                                <TextInput
                                    style={[stylesInput.inputStyle, { borderColor: cores.disabled }]}
                                    value={cidade}
                                    placeholder={'Nome da Cidade'}
                                    placeholderTextColor={cores.fonteCinza}
                                    editable={false}
                                />
                                <FontAwesomeIcon icon={faTreeCity} size={config.windowWidth / 16} color={cores.branco} style={stylesInput.styleIcon} />
                            </View>
                            <View style={{ width: '20%', marginLeft: config.windowWidth / 20 }}>
                                <Text style={stylesInput.txtInput}>Estado</Text>
                                <TextInput
                                    style={[stylesInput.inputStyle, { borderColor: cores.disabled }]}
                                    value={estado}
                                    placeholder={'UF'}
                                    placeholderTextColor={cores.fonteCinza}
                                    editable={false}
                                    maxLength={2}
                                />
                            </View>
                        </View>
                        <View style={styles.espacoInputs}>
                            <InputDadosUser
                                onChangeText={(text) => setEndereco(text)}
                                value={endereco}
                                textoInput={'Endereço'}
                                placeholder={'Digite seu Endereço'}
                                onFocus={() => txtEnderecoInvalido.length > 0 && setTxtEnderecoInvalido('')}
                                txtErro={txtEnderecoInvalido}
                                icon={faHouseChimneyUser}
                            />
                        </View>
                        <View style={[styles.espacoInputs, { flexDirection: 'row' }]}>
                            <InputDadosUser
                                style={{ width: '30%' }}
                                onChangeText={(text) => setNumero(text)}
                                value={numero}
                                keyboardType={'number-pad'}
                                textoInput={'Número'}
                                placeholder={'N°'}
                                onFocus={() => txtNumeroInvalido.length > 0 && setTxtNumeroInvalido('')}
                                txtErro={txtNumeroInvalido}
                                maxLenght={5}
                            />
                            <InputDadosUser
                                style={{ width: '55%' }}
                                onChangeText={(text) => setBairro(text)}
                                value={bairro}
                                textoInput={'Bairro'}
                                placeholder={'Digite seu Bairro'}
                                onFocus={() => txtBairroInvalido.length > 0 && setTxtBairroInvalido('')}
                                txtErro={txtBairroInvalido}
                            />

                        </View>
                        <View style={{ paddingTop: 15 }}>
                            <View style={{ width: '90%', marginLeft: config.windowWidth / 20 }}>
                                <Text style={stylesInput.txtInput}>Complemento</Text>
                                <TextInput
                                    style={stylesInput.inputStyle}
                                    onChangeText={(text) => setComplemento(text)}
                                    value={complemento}
                                    placeholder={'Digite o complemento (opicional)'}
                                    placeholderTextColor={cores.fonteCinza}
                                />
                            </View>
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