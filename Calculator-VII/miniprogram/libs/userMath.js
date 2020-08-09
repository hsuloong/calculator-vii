import * as Functions from './functions'
// 调度场算法

// 操作符
// 优先级	 |	符号	|	运算顺序
// 1		      !		    从右至左
// 2		      * / %	  从左至右
// 3		      + -		  从左至右
// 4		      =		    从右至左
const right2Left = 1
const left2Right = 2

const precedenceLevel0 = 0
const precedenceLevel1 = 1
const precedenceLevel2 = 2
const precedenceLevel3 = 3
const precedenceLevel4 = 4
const precedenceLevel5 = 5
const precedenceLevel6 = 6
const precedenceLevel7 = 7
const precedenceLevel8 = 8


const typeFlagOperation = 1
const typeFlagFunction = 2

const operation_map = {'!': {'precedence':precedenceLevel4, 'argcount':1, 'associativity':right2Left, 'call': Functions.factorial, 'typeFlag': typeFlagOperation},
                       '*': {'precedence':precedenceLevel3, 'argcount':2, 'associativity':left2Right, 'call': Functions.mul,       'typeFlag': typeFlagOperation},
                       '/': {'precedence':precedenceLevel3, 'argcount':2, 'associativity':left2Right, 'call': Functions.div,       'typeFlag': typeFlagOperation},
                       '%': {'precedence':precedenceLevel3, 'argcount':2, 'associativity':left2Right, 'call': Functions.mod,       'typeFlag': typeFlagOperation},
                       '+': {'precedence':precedenceLevel2, 'argcount':2, 'associativity':left2Right, 'call': Functions.add,       'typeFlag': typeFlagOperation},
                       '-': {'precedence':precedenceLevel2, 'argcount':2, 'associativity':left2Right, 'call': Functions.sub,       'typeFlag': typeFlagOperation},
                       '=': {'precedence':precedenceLevel1, 'argcount':0, 'associativity':right2Left, 'call': null,                'typeFlag': typeFlagOperation},

                       'randomChoose': {'precedence':precedenceLevel5, 'argcount':3, 'call': Functions.randomChoose, 'typeFlag': typeFlagFunction},
                       'binary':       {'precedence':precedenceLevel5, 'argcount':1, 'call': Functions.binary,       'typeFlag': typeFlagFunction},
                       'hex':          {'precedence':precedenceLevel5, 'argcount':1, 'call': Functions.hex,          'typeFlag': typeFlagFunction},
                       'randomInt':    {'precedence':precedenceLevel5, 'argcount':2, 'call': Functions.randomInt,    'typeFlag': typeFlagFunction},
                      }

function isOperation(token) {
  return (token in operation_map) && operation_map[token].typeFlag == typeFlagOperation
}

function isFunction(token) {
  return (token in operation_map) && operation_map[token].typeFlag == typeFlagFunction
}

function isNumber(token) {
  return !isNaN(Number(token))
}

function getOperationPrecedence(operation) {
  if (operation in operation_map) {
    return operation_map[operation].precedence
  }
  return 0;
}

function getOperationArgCount(operation) {
  if (operation in operation_map) {
    return operation_map[operation].argcount
  }
  return 0;
}

function getOperationAssociativity(operation) {
  return operation_map[operation].associativity
}

function callFunctionProxy(operation, operands) {
  if (operation in operation_map) {
    return operation_map[operation].call(operands)
  }
  return null
}

function shuntingYardAlgorithm(input) {
  let output = []
  let errmsg = ''
  let operationStack = []
  for (let i = 0; i < input.length; i++) {
    if (isNumber(input[i])) {
      output.push(Number(input[i]))
    }
    else if (isFunction(input[i])) {
      operationStack.push(input[i])
    }
    else if (input[i] == ',') {
      let findPair = false
      while (operationStack.length > 0) {
        let operation = operationStack[operationStack.length-1];
        if (operation == '(') {
          findPair = true
          break
        }
        else {
          output.push(operationStack.pop())
        }
      }
      if (!findPair) {
        errmsg = 'Failed at ' + i + 'th token!'
        return {'status':false, 'result':output, 'errmsg':errmsg}
      }
    }
    else if (isOperation(input[i])) {
      while (operationStack.length > 0) {
        let operation = operationStack[operationStack.length-1]
        if (isOperation(operation)
            && ((getOperationAssociativity(input[i]) == left2Right && getOperationPrecedence(input[i]) <= getOperationPrecedence(operation))
                || (getOperationAssociativity(input[i]) == right2Left && getOperationPrecedence(input[i]) < getOperationPrecedence(operation)))) {
          output.push(operationStack.pop())
        }
        else {
          break
        }
      }
      operationStack.push(input[i])
    }
    else if (input[i] == '(') {
      operationStack.push(input[i])
    }
    else if (input[i] == ')') {
      let findPair = false
      while (operationStack.length > 0) {
        let operation = operationStack.pop();
        if (operation == '(') {
          findPair = true
          break
        }
        else {
          output.push(operation)
        }
      }
      if (!findPair) {
        errmsg = 'Failed at' + i + 'th token!'
        return {'status':false, 'result':output, 'errmsg':errmsg}
      }
      if (operationStack.length > 0 && isFunction(operationStack[operationStack.length-1])) {
        output.push(operationStack.pop())
      }
    }
    else {
      errmsg = 'Unkown token:' + input[i]
      return {'status':false, 'result':output, 'errmsg':errmsg}
    }
  }

  for (let i = operationStack.length-1; i >= 0; i--) {
    if (operationStack[i] == '(' || operationStack[i]==')') {
      errmsg = "Mismatch parentheses"
      return {'status':false, 'result':output, 'errmsg':errmsg}
    }
    output.push(operationStack[i])
  }
  return {'status':true, 'result':output, 'errmsg':errmsg}
}

function executeReversePolishNotationExpression(input) {
  let result = null
  let errmsg = ''
  let resultStack = []
  for (let i = 0; i < input.length; i++) {
    if (isNumber(input[i])) {
      resultStack.push(input[i])
    }
    else if (isOperation(input[i]) || isFunction(input[i])) {
      let needArgCount = getOperationArgCount(input[i])
      if (needArgCount > resultStack.length) {
        errmsg = 'Missing args at operation:' + input[i]
        return {'status':false, 'result':result, 'errmsg':errmsg}
      }
      let operands = []
      while (needArgCount > 0) {
        operands.push(resultStack.pop())
        --needArgCount;
      }
      operands.reverse()
      let executeResult = callFunctionProxy(input[i], operands)
      resultStack.push(executeResult)
    }
    else {
      errmsg = "Unknown token:" + input[i]
      return {'status':false, 'result':result, 'errmsg':errmsg}
    }
  }
  if (resultStack.length != 1) {
    errmsg = "Final Fail:" + resultStack
    return {'status':false, 'result':result, 'errmsg':errmsg}
  }
  result = resultStack.pop()
  return {'status':true, 'result':result, 'errmsg':errmsg}
}

// let output = {}

// output = shuntingYardAlgorithm(['1', '+', '2'])
// console.log(output);
// output = executeReversePolishNotationExpression(output.result)
// console.log(output);

// output= shuntingYardAlgorithm(['1', '+', '2', '+', '3'])
// console.log(output);
// output = executeReversePolishNotationExpression(output.result)
// console.log(output);

// output = shuntingYardAlgorithm(['1', '+', '2', '*', '3'])
// console.log(output);
// output = executeReversePolishNotationExpression(output.result)
// console.log(output);

// output = shuntingYardAlgorithm(['1', '+', '2', '*', '3', '-', '4', '/', '5'])
// console.log(output);
// output = executeReversePolishNotationExpression(output.result)
// console.log(output);

// output = shuntingYardAlgorithm(['(', '1', '+', '2', ')'])
// console.log(output);
// output = executeReversePolishNotationExpression(output.result)
// console.log(output);

// output = shuntingYardAlgorithm(['(', '1', '+', '2', ')', '*', '(', '3', '-', '4', ')', '/', '5'])
// console.log(output);
// output = executeReversePolishNotationExpression(output.result)
// console.log(output);

// output = shuntingYardAlgorithm(['(', '1', '+', '2', ')', '*', '(', '(', '3', '-', '4', ')', '/', '5', ')'])
// console.log(output);
// output = executeReversePolishNotationExpression(output.result)
// console.log(output);