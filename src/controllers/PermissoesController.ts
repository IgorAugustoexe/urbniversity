import { PermissionsAndroid } from 'react-native'

export const requisitarPermissaoGaleria = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        )
        return granted
    } catch (err) {
        throw new Error(`erro ao requisitar a galeria: ${err}`)
    }
}