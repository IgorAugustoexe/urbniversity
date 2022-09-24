import { Platform } from 'react-native'
import ImageResizer from 'react-native-image-resizer'
import RNFS from 'react-native-fs'
import ImageCropPicker from 'react-native-image-crop-picker'

export const PATH_IMAGEM = Platform.select({ // pega na pasta do app
    android: `file://${RNFS.DocumentDirectoryPath}/DownloadImagens`
})

export const JSON_IMAGENS = Platform.select({ // pega na galeria
    android: `file://${RNFS.DocumentDirectoryPath}/pathimagens.txt`
})

// escolhe a imagem desejada
export const escolherImagem = (callback: any) => {
    ImageCropPicker.openPicker({
        mediaType: 'photo',
        forceJpg: true,
    }).then(imagem => {
        tratarImagem(imagem, callback)
        return
    }).catch(err => {
        console.log(err)
    })
}

// apos a imagem ser escolhida ela sera tratada para que a sua resolucao seja diminuida para econimizar dados
const tratarImagem = (imagem: any, callback: any) => {
    let pathImagemReduzida = imagem.path
    ImageResizer.createResizedImage(pathImagemReduzida, 1280, 720, 'JPEG', 100).then((img) => {
        callback(img.uri, img)
    })
}