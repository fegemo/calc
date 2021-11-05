import { ExpressionError, AbstractError } from "./error.js"

class Entity {
  constructor() {
    this.parents = []
  }

  eval(context) {
    if (context) {
      this.context = context
    }
  }
  
  get root() {
    let root = this
    while (!!root.parents.length) {
      root = root.parents[0]
    }
    return root
  }

  get context() {
    return this.root.ctx
  }
  
  set context(ctx) {
    this.root.ctx = ctx
  }

  write() {
    throw new AbstractError('write on Entity')
  }
}

class Scalar extends Entity {
  constructor(value) {
    super()
    this.value = value
  }

  eval(context) {
    super.eval(context)
    return this.value
  }

  write() {
    const formattedValue = Math.round((this.value + Number.EPSILON) * 100) / 100
    return '' + formattedValue
  }
}

class Operator extends Entity {
  constructor(operands) {
    super()
    this.operands = Array.isArray(operands) ? operands : [operands]
    this.operands = this.operands.map(o => typeof o === 'number' ? scalar(o) : o)
    this.operands.forEach(o => attachParent(o, this))
  }  
}

class Sine extends Operator {
  constructor(expr) {
    super([expr])
  }
  
  eval(context) {
    super.eval(context)
    return Math.sin(resolve(this.operands[0]))
  }

  write() {
    return `sin(${this.operands[0].write()})`
  }
}

class Plus extends Operator {
  constructor(a, b) {
    super([a, b])
  }
  
  eval(context) {
    super.eval(context)
    return this.operands.reduce((accum, current) => accum + resolve(current), 0)
  }

  write() {
    return this.operands.map(o => o.write()).join('+')
  }
}

class Minus extends Operator {
  constructor(a, b) {
    super([a, b])
  }
  
  eval(context) {
    super.eval(context)
    return this.operands.reduce((accum, current) => accum - resolve(current), 2*resolve(this.operands[0]))
  }

  write() {
    return this.operands.map(o => o.write()).join('-')
  }
}


class Times extends Operator {
  constructor(a, b) {
    super([a, b])
  }

  eval(context) {
    super.eval(context)
    return this.operands.reduce((accum, current) => accum * resolve(current), 1)
  }

  write() {
    return this.operands.map(o => o.write()).join('*')
  }
}


class Divide extends Operator {
  constructor(a, b) {
    super([a, b])
  }

  eval(context) {
    super.eval(context)
    return this.operands.reduce((accum, current) => accum / resolve(current), 1)
  }

  write() {
    return this.operands.map(o => o.write()).join('/')
  }
}

class Power extends Operator {
  constructor(a, b) {
    super([a, b])
  }
  
  eval(context) {
    super.eval(context)
    return resolve(this.operands[0]) ** resolve(this.operands[1])
  }

  write() {
    return `${this.operands[0].write()}^${this.operands[1].write()}`
  }
}

class Variable extends Entity {
  constructor(name) {
    super()
    this.name = name
  }
  
  eval(context) {
    super.eval(context)
    const value = this.context[this.name]
    
    return value ?? this.name
  }

  write() {
    return this.name
  }
}

function resolve(something) {
  // maybe cache resolution?
  
  // actually resolve
  if (something instanceof Entity) {
    return something.eval()
  } else {
    throw new ExpressionError(`Tried to resolve ${something} but it was neither a number nor an expression entity.`)
  }
}

function attachParent(something, parent) {
  if (something instanceof Entity) {
    something.parents.push(parent)
  }
}



export function plus(operand1, operand2) {
  return new Plus(operand1, operand2)
}

export function minus(operand1, operand2) {
  return new Minus(operand1, operand2)
}

export function times(operand1, operand2) {
  return new Times(operand1, operand2)
}

export function divide(operand1, operand2) {
  return new Divide(operand1, operand2)
}

export function power(base, exponent) {
  return new Power(base, exponent)
}

export function sine(expr) {
  return new Sine(expr)
}

export function variable(name) {
  return new Variable(name)
}

function scalar(value) {
  return new Scalar(value)
}




const x = variable('x')
const expr = plus(power(x, 3), minus(10, sine(times(x,Math.PI))))

console.log(expr.write())
console.log(expr.eval({x: 2}))
