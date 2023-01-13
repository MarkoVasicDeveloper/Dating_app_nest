export function fillObject(array: any, data: {}) {
    if(array !== null) {
        return [...array, data]
    }else{
        return [data]
    }
}