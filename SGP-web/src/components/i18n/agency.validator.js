const validator = {
  validate (value) {
    let agencia = value.replace('-', '')
    return agencia.length === 5 && agencia !== '00000'
  }
}
export default validator
