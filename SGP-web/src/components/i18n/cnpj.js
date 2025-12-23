// function calcChecker1 (firstNineDigits) {
//   let sum = null
//
//   for (let j = 0; j < 9; ++j) {
//     sum += firstNineDigits.toString().charAt(j) * (10 - j)
//   }
//
//   const lastSumChecker1 = sum % 11
//   const checker1 = (lastSumChecker1 < 2) ? 0 : 11 - lastSumChecker1
//
//   return checker1
// }
//
// function calcChecker2 (cpfWithChecker1) {
//   let sum = null
//
//   for (let k = 0; k < 10; ++k) {
//     sum += cpfWithChecker1.toString().charAt(k) * (11 - k)
//   }
//   const lastSumChecker2 = sum % 11
//   const checker2 = (lastSumChecker2 < 2) ? 0 : 11 - lastSumChecker2
//
//   return checker2
// }

// function cleaner (value) {
//   if (value) {
//     const digits = value.replace(/[^\d]/g, '')
//     return digits
//   }
// }
function getConstructor (value) {
  const string = Object.prototype.toString.call(value)
  const [ , constructor ] = /\[object (.*?)\]/.exec(string)
  return constructor
}
function is (value, constructor) {
  return constructor === getConstructor(value)
}

function validate (value) {
  if (!is(value, 'String')) {
    return false
  }

  const digits = value.replace(/[\D]/gi, '')

  let dig1 = 0
  let dig2 = 0

  const validation = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  const digito = parseInt(digits.charAt(12) + digits.charAt(13))

  const getRest = dig => (((dig % 11) < 2) ? 0 : (11 - (dig % 11)))

  validation.map((v, i) => {
    dig1 += (i > 0 ? (digits.charAt(i - 1) * v) : 0)
    dig2 += digits.charAt(i) * v
  })

  dig1 = getRest(dig1)
  dig2 = getRest(dig2)

  return (((dig1 * 10) + dig2) === digito)
}
export default validate
