export class AbstractError extends Error {
    constructor(message) {
        super(`An abstract method was called directly: ${message}`)
        this.name = this.constructor.name
    }
}

export class ExpressionError extends Error {
    constructor(message) {
        super(`Error in an expression: ${message}`)
        this.name = this.constructor.name
    }
}