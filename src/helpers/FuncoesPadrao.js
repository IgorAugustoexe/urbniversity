import { useEffect, useRef } from 'react'

/**
 *   useEffect customizado que não pega no didmount dos componentes
 */
export const useAfterMountEffect = (func, deps) => {
    const didMount = useRef(false)
    useEffect(() => {
        if (didMount.current) func()
        else didMount.current = true
    }, deps)
}

export const removerAcento = (string) => {
    string = string.toLowerCase();
    string = string.replace(new RegExp('[ÁÃÀÂÄÅÆ]', 'gi'), 'a')
    string = string.replace(new RegExp('[ÉÊÈĘĖĒË]', 'gi'), 'e')
    string = string.replace(new RegExp('[ÍÎÌÏĮĪ]', 'gi'), 'i')
    string = string.replace(new RegExp('[ÓÕÔÒÖŒØŌ]', 'gi'), 'o')
    string = string.replace(new RegExp('[ÚÜÙÛŪ]', 'gi'), 'u')
    string = string.replace(new RegExp('[Ç]', 'gi'), 'c')
    string = string.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '')
    string = string.replace(/\\/g, "\\\\")
    return string
}

export const verificaEmail = (email) => {
    /* eslint-disable */
    const reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
    if (!(reg.test(email.trim()))) {
        return false
    }
    return true
}

export const selection_sort = (A, comp) => {
    var len = A.length;
    for (var i = 0; i < len - 1; i = i + 1) {
        var j_min = i;
        for (var j = i + 1; j < len; j = j + 1) {
            let n1 = Math.pow(A[j].latitude + A[j].longitude,2) 
            let n2 = Math.pow(A[j_min].latitude + A[j_min].longitude,2) 
            if (n1 < n2) {
                j_min = j;
            } else {}
        }
        if (j_min !== i) {
            swap(A, i, j_min);
        } else {}
    }
    A.reverse();
}
function swap(A, x, y) {
    var temp = A[x];
    A[x] = A[y];
    A[y] = temp;
}