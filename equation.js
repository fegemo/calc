import { range } from "./list.js"
import { power, variable, minus, sine, times, plus } from "./expression.js"

class MathFunction {
  constructor(variableNames, expression) {
    this.variables = variableNames.map(v => variable(v))
    this.expression = expression.call(this, ...this.variables)
  }

  sample(variableNames, domain) {
    variableNames = ensureArray(variableNames)
    domain = ensureIterable(domain)
    const image = []
    for (let sample of domain) {
      const context = variableNames.reduce((prev, curr) => {
        prev[curr] = sample
        return prev
      }, {})
      image.push(this.expression.eval(context))
    }

    return image
  }
}

function ensureIterable(values) {
  if (!(Symbol.iterator in Object(values))) {
    values = [values]
  }
  return values
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [value]
}

function f(variableNames, expression) {
  return new MathFunction(ensureArray(variableNames), expression)
}


function plot(domain, image) {
  for (let y of image) {
    console.log(`(${domain.next().value}, ${y})`)
  }
}



// const y = f('x', x => power(x, 3))
const y = f('x', x => plus(power(x, 3), minus(10, sine(times(x, Math.PI)))))
const domain = range(-5, 6)
const image = y.sample('x', range(-5, 6))

plot(domain, image)
