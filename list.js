
export function* range(start, end, step) {
    // no argument: error
    if (!start) {
      throw new Error('Tried to create a range, but no argument was provided')
    }
    // only one argument: range(end)
    else if (!step && !end) {
      end = start
      start = 0
      step = 1
    }
    // only two arguments: range(start, end)
    else if (!step) {
      step = end >= start ? 1 : -1
    }
  
    for (let c = start; c < end; c += step) {
      yield c
    }
  }