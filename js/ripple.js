function randRipple() {
  let x = Math.floor(Math.random() * window.innerWidth)
  let y = Math.floor(Math.random() * window.innerHeight)
  Rippler(null, x, y)
}

(function callRandom() {
  let rand = Math.floor(Math.random() * 5000 + 100)
  setTimeout(function () {
    randRipple()
    callRandom()
  }, rand)
}())

const Ripples = {
  limit: 0,
  counter: 0,
  makeRipple: (e, x, y) => {
    if (Ripples.limit < 5) {
      Ripples.counter++
      Ripples.limit++
      if (e !== null) {
        x = e.clientX
        y = e.clientY - 120
      }
      const ripple = document.createElement("div")
      ripple.setAttribute('class', 'ripple')
      ripple.setAttribute('id', `ripple${Ripples.counter}`)
      ripple.setAttribute('style', `left:${x}px;top:${y}px`)
      document.getElementById("pond").appendChild(ripple)
      const setRipple = document.getElementById(`ripple${Ripples.counter}`)
      setTimeout(function () { setRipple.setAttribute('class', 'ripple rippleExpand') }, 50)
      setTimeout(function () {
        document.getElementById("pond").removeChild(setRipple)
        Ripples.limit--
      }, 2000)
    }
  }
}
const Rippler = (e, x, y) => {
  Ripples.makeRipple(e, x, y)
}