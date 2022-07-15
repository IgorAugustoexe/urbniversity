import axios from 'axios'

export const pesquisaEndereco = (cep: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.get(`https://viacep.com.br/ws/${cep}/json/`)
            .then(resp => resolve(resp.data))
            .catch(e => reject(new Error(`pesquisaEndereco: ${e}`)))
    })
}
