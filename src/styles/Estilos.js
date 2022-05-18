import { Dimensions } from 'react-native';

const largura = Dimensions.get("window").width
const altura = Dimensions.get("window").height

/*
const fonte = {
    narrowRegular: "PT Sans Narrow",
    narrowBold: "PT Sans Narrow Bold",
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
    backgroundPadrao: '#5875BF',
    fontePadrao: '#181818',
}

export { config, cores }