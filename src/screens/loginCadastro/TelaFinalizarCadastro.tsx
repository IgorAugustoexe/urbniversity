import React, { Fragment, useState, useEffect, useContext } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator, Image, Linking, Alert, PermissionsAndroid } from 'react-native'
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
import { requisitarPermissaoGaleria } from '../../controllers/PermissoesController'
import { escolherImagem } from '../../controllers/ImagemController'
import avatarPadrao from '../../../assets/img/avatarPadrao.jpg'
import { AuthContext } from '../../apis/AuthContext';
import { useSelector } from 'react-redux'

type navigation = {
    props: {
        isDrive: boolean,
        id: string,
        email: string,
        nome: string,
        telefone: string,
        senha: string,
    }
}

export default function TelaFinalizarCadastro() {
    const store: any = useSelector<any>(({ user }) => {
        return {
            user: user
        }
    })


    const navigation = useNavigation<any>()
    const route = useRoute<RouteProp<navigation, 'props'>>()

    const [cpf, setCpf] = useState<string>('')
    const [txtCpfInvalido, setTxtCpfInvalido] = useState<string>('')

    //motorista
    const [cnh, setCnh] = useState<string>('')
    const [placa, setPlaca] = useState<string>('')
    const [modelo, setModelo] = useState<string>('')
    const [marca, setMarca] = useState<string>('')
    const [ano, setAno] = useState<string>('')
    const [crlv, setCrlv] = useState<string>('')
    const [assentos, setAssentos] = useState<string>('')
    const [corPredominante, setCorPredominante] = useState<string>('')

    const [txtCnhInvalida, setTxtCnhInvalida] = useState<string>('')
    const [txtPlacaInvalida, setTxtPlacaInvalida] = useState<string>('')
    const [txtModeloInvalido, setTxtModeloInvalido] = useState<string>('')
    const [txtMarcaInvalida, setTxtMarcaInvalida] = useState<string>('')
    const [txtCrlvInvalido, setTxtCrlvInvalido] = useState<string>('')
    const [txtAnoInvalido, setTxtAnoInvalido] = useState<string>('')
    const [txtAssentosInvalidos, setTxtAssentosInvalidos] = useState<string>('')
    const [txtCorPredominante, setTxtCorPredominante] = useState<string>('')

    //estudante
    const [faculdade, setFaculdade] = useState<string>('')
    const [curso, setCurso] = useState<string>('')
    const [cep, setCep] = useState<string>('')
    const [endereco, setEndereco] = useState<string>('')
    const [numero, setNumero] = useState<string>('')
    const [bairro, setBairro] = useState<string>('')
    const [estado, setEstado] = useState<string>('')
    const [cidade, setCidade] = useState<string>('')
    const [complemento, setComplemento] = useState<string>('')

    const [loaderCep, setLoaderCep] = useState<boolean>(false)

    const [txtFaculdadeInvalida, setTxtFaculdadeInvalida] = useState<string>('')
    const [txtCursoInvalido, setTxtCursoInvalido] = useState<string>('')
    const [txtCepInvalido, setTxtCepInvalido] = useState<string>('')
    const [txtEnderecoInvalido, setTxtEnderecoInvalido] = useState<string>('')
    const [txtNumeroInvalido, setTxtNumeroInvalido] = useState<string>('')
    const [txtBairroInvalido, setTxtBairroInvalido] = useState<string>('')

    const [loaderReq, setLoaderReq] = useState<boolean>(false)

    const [imagem, setImagem] = useState<any>('https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg')

    //Register Function
    const {register } = useContext(AuthContext)

    const validarCpf = () => {
        txtCpfInvalido.length > 0 && setTxtCpfInvalido('')
        const cpfFormatado = removerAcento(cpf)
        if (cpfFormatado.length <= 10) {
            setTxtCpfInvalido('CPF Inválido')
            return false
        }
        return true
    }

    const validarDadosEstudante = () => {
        let controleEstudante = true
        txtFaculdadeInvalida.length > 0 && setTxtFaculdadeInvalida('')
        txtCursoInvalido.length > 0 && setTxtCursoInvalido('')
        txtCepInvalido.length > 0 && setTxtCepInvalido('')
        txtEnderecoInvalido.length > 0 && setTxtEnderecoInvalido('')
        txtNumeroInvalido.length > 0 && setTxtNumeroInvalido('')
        txtBairroInvalido.length > 0 && setTxtBairroInvalido('')

        if (!validarCpf()) {
            controleEstudante = false
        }

        if (faculdade.length == 0) {
            setTxtFaculdadeInvalida('Campo Obrigatório')
            controleEstudante = false
        }

        if (curso.length == 0) {
            setTxtCursoInvalido('Campo Obrigatório')
            controleEstudante = false
        }

        if (cep.length == 0) {
            setTxtCepInvalido('Campo Obrigatório')
            controleEstudante = false
        }

        if (endereco.length == 0) {
            setTxtEnderecoInvalido('Campo Obrigatório')
            controleEstudante = false
        }

        if (endereco.length == 0) {
            setTxtEnderecoInvalido('Campo Obrigatório')
            controleEstudante = false
        }

        if (numero.length == 0) {
            setTxtNumeroInvalido('Campo Obrigatório')
            controleEstudante = false
        }

        if (bairro.length == 0) {
            setTxtBairroInvalido('Campo Obrigatório')
            controleEstudante = false
        }

        return controleEstudante
    }

    const validarDadosMotorista = () => {
        let controleMotorista = true
        txtCnhInvalida.length > 0 && setTxtCnhInvalida('')
        txtCrlvInvalido.length > 0 && setTxtCrlvInvalido('')
        txtAnoInvalido.length > 0 && setTxtAnoInvalido('')

        if (!validarCpf()) {
            controleMotorista = false
        }
        //Mudei pra 11, cnh com 13 é loucura
        if (cnh.length <= 10) {
            console.log(1)
            setTxtCnhInvalida('CNH Inválida')
            controleMotorista = false
        }
        //Mudei pra 11, acredito que senha o Renavan que também tem 11 digitos
        if (crlv.length <= 10) {
            console.log(1)
            setTxtCnhInvalida('CRLV Inválido')
            controleMotorista = false
        }

        if (ano < '1990' || ano > '2023') {
            setTxtAnoInvalido('Ano Inválido')
            controleMotorista = false
        }

        return controleMotorista
    }

    const finalizarCadastro = () => {
        setLoaderReq(true)
        //console.log(`${route.params.id} ${route.params.email} ${route.params.nome} ${route.params.telefone} ${route.params.senha}`)
        if (route.params.isDrive) {
            if (!validarDadosMotorista()) {
                setLoaderReq(false)
                return
            }
        } else {
            if (!validarDadosEstudante()) {
                setLoaderReq(false)
                return
            }
        }

        // if (route.params.isDrive) {
        //     navigation.navigate('home', { isDrive: true })
        // } else {
        //     navigation.naviate('home', { isDrive: false })
        // }
        let object = route.params.isDrive ? {
            cnh: cnh,
            fullName: route.params.nome,
            cpf: cpf,
            email: route.params.email,
            password: route.params.senha,
            phone: route.params.telefone
        } : {
            fullName: route.params.nome,
            cpf: cpf,
            email: route.params.email,
            password: route.params.senha,
            phone: route.params.telefone,
            course: curso,
            university: faculdade,
            street: endereco,
            number: numero,
            district: bairro,
            cep: cep,
            city: cidade,
            state: estado
        }

        let complement = route.params.isDrive ? {
            crlv: crlv,
            brand: marca,
            model: modelo,
            year: parseInt(ano),
            color: corPredominante,
            seats: assentos
        }
            :
            {}

        route.params.isDrive ? register('driver', object, complement, setLoaderReq) : register('student', object, complement, setLoaderReq)

        setLoaderReq(false)
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

    const callBackImagem = (img: string) => {
        setImagem(img)
    }

    const acessarGaleria = async () => {
        const permissaoGaleria = await requisitarPermissaoGaleria()
        if (permissaoGaleria == PermissionsAndroid.RESULTS.GRANTED) {
            escolherImagem(callBackImagem)
            return
        }
        Alert.alert(
            "Permissão da Galeria",
            "Libere o acesso ao Urbniversity para acessar a Galeria.",
            [
                {
                    text: "Cancelar"
                },
                { text: "Liberar Acesso", onPress: () => Linking.openSettings() }
            ]
        )
    }

    const DadosMotorista = () => (
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
            <View style={styles.espacoInputs}>
                <InputDadosUser
                    onChangeText={(text) => setCrlv(text)}
                    value={crlv}
                    textoInput={'Crlv'}
                    placeholder={'Digite o CRLV'}
                    onFocus={() => txtCrlvInvalido.length > 0 && setTxtCrlvInvalido('')}
                    txtErro={txtCrlvInvalido}
                />
            </View>
            <View style={styles.espacoInputs}>
                <InputDadosUser
                    onChangeText={(text) => setMarca(text)}
                    value={marca}
                    textoInput={'Marca'}
                    placeholder={'Digite a Marca'}
                    onFocus={() => txtMarcaInvalida.length > 0 && setTxtMarcaInvalida('')}
                    txtErro={txtMarcaInvalida}
                />
            </View>
            <View style={styles.espacoInputs}>
                <InputDadosUser
                    onChangeText={(text) => setModelo(text)}
                    value={modelo}
                    textoInput={'Modelo'}
                    placeholder={'Digite o Modelo'}
                    onFocus={() => txtModeloInvalido.length > 0 && setTxtModeloInvalido('')}
                    txtErro={txtModeloInvalido}
                />
            </View>
            <View style={[styles.espacoInputs, { flexDirection: 'row' }]}>
                <InputDadosUser
                    style={{ width: '40%' }}
                    onChangeText={(text) => setPlaca(text)}
                    value={placa}
                    textoInput={'Placa'}
                    placeholder={'Digite a Placa'}
                    onFocus={() => txtPlacaInvalida.length > 0 && setTxtPlacaInvalida('')}
                    txtErro={txtPlacaInvalida}
                    autoCapitalize={'characters'}
                    maxLenght={7}
                />
                <InputDadosUser
                    style={{ width: '40%' }}
                    onChangeText={(text) => setAno(text)}
                    value={ano}
                    textoInput={'Ano'}
                    placeholder={'Digite o Ano'}
                    keyboardType={'number-pad'}
                    onFocus={() => txtModeloInvalido.length > 0 && setTxtModeloInvalido('')}
                    txtErro={txtModeloInvalido}
                    maxLenght={4}
                />
            </View>
            <View style={[styles.espacoInputs, { flexDirection: 'row' }]}>
                <InputDadosUser
                    style={{ width: '40%' }}
                    onChangeText={(text) => setAssentos(text)}
                    value={assentos}
                    textoInput={'Assentos Totais'}
                    placeholder={'Qtd Assentos'}
                    keyboardType={'number-pad'}
                    onFocus={() => txtAssentosInvalidos.length > 0 && setTxtAssentosInvalidos('')}
                    txtErro={txtAssentosInvalidos}
                    maxLenght={2}
                />
                <InputDadosUser
                    style={{ width: '40%' }}
                    onChangeText={(text) => setCorPredominante(text)}
                    value={corPredominante}
                    textoInput={'Cor Predominante'}
                    placeholder={'Cor do veículo'}
                    onFocus={() => txtCorPredominante.length > 0 && setTxtCorPredominante('')}
                    txtErro={txtCorPredominante}
                />
            </View>
        </Fragment>
    )

    const DadosEstudante = () => (
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
                    style={{ width: '30%', }}
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
                    style={{ width: '50%' }}
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
    )
    // useEffect(() => {
    //     //This code makes the same as isLoggedIn from src/apis/AuthContext without the request part. Is necessary (At least for now) 
    //     //to continue the login process by verifying if the userInfo has the access token to foward the user
    //     if (store.user.access_token) {
    //         setLoaderReq(true)

    //         store.user.type == 'driver' ?
    //             navigation.navigate('home', { isDrive: true })
    //             :
    //             navigation.navigate('home', { isDrive: false })

    //         setLoaderReq(false)
    //     }
    // }, [store.user.access_token]);

    return (
        <SafeAreaView style={estilos.containerPrincipal}>
            <NavBar titulo='Finalizar Cadastro' botaoEsquerdo={true} backgroundColor={cores.backgroundPadrao} />
            <KeyboardAwareScrollView
                extraHeight={config.windowWidth / 2}
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.textoInformativo}>Tudo certo agora vamos finalizar seu cadastro como {route.params.isDrive ? 'Motorista' : 'Estudante'}!</Text>
                </View>

                {route.params.isDrive ?
                    DadosMotorista()
                    :
                    DadosEstudante()
                }
                <View style={{ alignItems: 'center', paddingTop: 15 }}>
                    <TouchableOpacity onPress={() => acessarGaleria()} style={{ paddingBottom: 10 }}>
                        <Text>Enviar Imagem</Text>
                    </TouchableOpacity>
                    <Image
                        style={styles.imgUser}
                        source={{ uri: imagem }}
                    />
                </View>

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
    },

    textoInformativo: {
        fontSize: 16,
        color: cores.fonteBranco,
        fontWeight: '700',
        padding: config.windowWidth / 20,
        textAlign: 'center'
    },

    imgUser: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderWidth: 2,
        borderColor: cores.branco,
        borderRadius: 3
    },

})