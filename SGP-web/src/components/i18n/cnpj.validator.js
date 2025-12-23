import CnpjValidate from './cnpj'
const validator = {
  getMessage (field, args) { // will be added to default English messages.
    return 'CNPJ inválido'
  },
  validate (value, args) {
    return CnpjValidate(value)
  }
}
export default validator
