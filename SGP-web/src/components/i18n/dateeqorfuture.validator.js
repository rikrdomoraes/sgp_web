import moment from 'moment'
const validator = {
  validate (value) {
    let newdate = moment(value, 'DD/MM/YYYY', true)
    if (newdate.isValid()) {
      let datenow = moment()
      return newdate.isSameOrAfter(datenow, 'date')
    } else {
      return false
    }
  }
}
export default validator
