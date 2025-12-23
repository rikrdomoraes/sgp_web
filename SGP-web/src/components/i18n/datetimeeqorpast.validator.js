import moment from 'moment'
const validator = {
  validate (value) {
    let newdate = moment(value, 'DD/MM/YYYY HH:mm', true)
    if (newdate.isValid()) {
      let datenow = moment()
      return newdate.isSameOrBefore(datenow)
    } else {
      return false
    }
  }
}
export default validator
