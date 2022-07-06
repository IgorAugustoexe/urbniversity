import { Dimensions } from 'react-native';

const largura = Dimensions.get("window").width
const altura = Dimensions.get("window").height

/*
const fonte = {
    titiRegular: "Titillium Web Regular",
    titiSemiBold: "Titillium Web SemiBold",
    titiBold: "Titillium Web Bold",
}
*/

const config = {
    windowWidth: largura,
    windowHeight: altura,
}

const cores = {
    backgroundPadrao: '#1D2740',
    azulPrimario: '#3B4E80',
    azulBtn: '#5875BF',
    azulEscuro: '#2F3F66',
    azulDisabled: 'rgba(29, 39, 64, 0.3)',
    disabled: 'rgba(255,255,255, 0.3)',
    branco: '#FFFFFF',
    fonteBranco: '#F5F2F2',
    fonteCinza: '#7C7979',
    pretoBorder: '#181818'
}

const estilos = {
    containerPrincipal: {
        flex: 1,
        backgroundColor: cores.backgroundPadrao
    }
}

export { config, cores, estilos }