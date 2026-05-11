export function isEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
  }
  
  export function minLength(value, length) {
    return value.length >= length
  }