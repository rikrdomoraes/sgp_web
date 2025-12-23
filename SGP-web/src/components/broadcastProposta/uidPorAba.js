import { v4 as uuidv4 } from 'uuid'
if (!sessionStorage.getItem('uid_aba')) {
  sessionStorage.setItem('uid_aba', uuidv4())
}
export default sessionStorage.getItem('uid_aba')
