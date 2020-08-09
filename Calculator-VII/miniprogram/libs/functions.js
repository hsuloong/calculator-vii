
export function add(operands) {
  return Number(operands[0]) + Number(operands[1])
}

export function sub(operands) {
  return Number(operands[0]) - Number(operands[1])
}

export function mul(operands) {
  return Number(operands[0]) * Number(operands[1])
}

export function div(operands) {
  return Number(operands[0]) / Number(operands[1])
}

export function mod(operands) {
  return parseInt(operands[0]) % parseInt(operands[1])
}

export function factorial(operands) {
  let operand = parseInt(operands[0])
  let result = 1
  for (let i = 1; i <= operand; i++) {
    result *= i;
  }
  return result
}

export function randomChoose(operands) {
  let i = Math.floor(Math.random() * operands.length)
  return operands[i]
}

export function binary(operands) {
  let operand = operands[0]
  return operand.toString(2)
}

export function hex(operands) {
  let operand = operands[0]
  return operand.toString(16)
}

export function randomInt(operands) {
  let operand1 = parseInt(operands[0])
  let operand2 = parseInt(operands[1])
  return parseInt(Math.floor(Math.random()*(operand2 - operand1 + 1) + operand1))
}