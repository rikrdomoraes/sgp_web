import moment from 'moment'
const validator = {
  validate (value) {
    let newdate = moment(value, 'DD/MM/YYYY', true)
    return newdate.isValid()
  }
}
export default validator
