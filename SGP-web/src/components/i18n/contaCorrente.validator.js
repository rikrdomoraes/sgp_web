const validator = {
  validate (value) {
    let conta = value.replace('-', '')
    return conta.length > 3 && conta !== '000' && conta !== '0000' && conta !== '00000' && conta !== '000000' && conta !== '0000000' && conta !== '0000000000'
  }
}
export default validator
