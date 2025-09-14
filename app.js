let userScore = 0
let compScore = 0
let round = 0
const choices = document.querySelectorAll('.choice')
const msg = document.querySelector('#mess')
const userScorePara = document.querySelector('#user')
const compScorePara = document.querySelector('#comp')
const historyList = document.querySelector('#history')
const resetBtn = document.querySelector('#resetBtn')
const bestOfInput = document.querySelector('#bestOf')
const bestOfNote = document.querySelector('#bestOfNote')
const roundDisplay = document.querySelector('#round')
const maxRoundsDisplay = document.querySelector('#maxRounds')

const getTargetWins = () => {
  let bestOf = parseInt(bestOfInput.value,10) || 5
  if(bestOf < 1) bestOf = 1
  if(bestOf % 2 === 0){
    bestOf = bestOf + 1
    bestOfInput.value = bestOf
    bestOfNote.innerText = 'Adjusted to next odd number'
  } else {
    bestOfNote.innerText = ''
  }
  maxRoundsDisplay.innerText = bestOf
  return Math.ceil(bestOf / 2)
}

let targetWins = getTargetWins()
bestOfInput.addEventListener('input',() => {
  targetWins = getTargetWins()
})
bestOfInput.addEventListener('change',() => {
  targetWins = getTargetWins()
  resetGame()
})

const genCompChoice = () => {
  const options = ['rock','paper','scissors']
  const randIdx = Math.floor(Math.random() * 3)
  return options[randIdx]
}

const setMessage = (text, color) => {
  msg.innerText = text
  msg.style.backgroundColor = color
}

const addHistory = (result, userChoice, compChoice) => {
  const li = document.createElement('li')
  li.className = result === 'draw' ? '' : result === 'win' ? 'win' : 'lose'
  const left = document.createElement('span')
  left.innerText = `You: ${userChoice}`
  const mid = document.createElement('span')
  mid.innerText = result === 'draw' ? 'Draw' : result === 'win' ? 'You win' : 'Computer wins'
  const right = document.createElement('span')
  right.innerText = `Comp: ${compChoice}`
  li.appendChild(left)
  li.appendChild(mid)
  li.appendChild(right)
  historyList.insertBefore(li,historyList.firstChild)
  if(historyList.childElementCount > 50){
    historyList.removeChild(historyList.lastChild)
  }
}

const endMatchIfNeeded = () => {
  if(userScore >= targetWins || compScore >= targetWins){
    if(userScore > compScore){
      setMessage('Match Over. You won the match!', 'green')
    } else {
      setMessage('Match Over. Computer won the match!', 'red')
    }
    disableChoices()
    return true
  }
  return false
}

const resetUISelections = () => {
  choices.forEach(c => {
    c.classList.remove('user-selected')
    c.classList.remove('comp-selected')
  })
}

const disableChoices = () => {
  choices.forEach(c => c.classList.add('disabled'))
}

const enableChoices = () => {
  choices.forEach(c => c.classList.remove('disabled'))
}

const animateScore = (el) => {
  el.style.transform = 'scale(1.08)'
  setTimeout(()=> el.style.transform = 'scale(1)',200)
}

const drawGame = (userChoice, compChoice) => {
  setMessage('Game was Draw. Play again.', '#081b31')
  addHistory('draw',userChoice,compChoice)
}

const showWinner = (userWin, userChoice, compChoice) => {
  if(userWin){
    userScore++
    userScorePara.innerText = userScore
    setMessage(`You win! Your ${userChoice} beats ${compChoice}`,'green')
    animateScore(userScorePara)
    addHistory('win',userChoice,compChoice)
  } else {
    compScore++
    compScorePara.innerText = compScore
    setMessage(`You lost. ${compChoice} beats your ${userChoice}`,'red')
    animateScore(compScorePara)
    addHistory('lose',userChoice,compChoice)
  }
}

const playRound = (userChoice) => {
  if(document.querySelector('.choice.disabled')) return
  const compChoice = genCompChoice()
  round++
  roundDisplay.innerText = round
  resetUISelections()
  const userEl = document.querySelector(`#${userChoice}`)
  const compEl = document.querySelector(`#${compChoice}`)
  userEl.classList.add('user-selected')
  compEl.classList.add('comp-selected')
  if(userChoice === compChoice){
    drawGame(userChoice,compChoice)
  } else {
    let userWin = true
    if(userChoice === 'rock'){
      userWin = compChoice === 'paper' ? false : true
    } else if(userChoice === 'paper'){
      userWin = compChoice === 'scissors' ? false : true
    } else {
      userWin = compChoice === 'rock' ? false : true
    }
    showWinner(userWin,userChoice,compChoice)
  }
  disableChoices()
  setTimeout(() => {
    const ended = endMatchIfNeeded()
    if(!ended){
      enableChoices()
      resetUISelections()
    }
  },800)
}

choices.forEach(choice => {
  choice.addEventListener('click',() => {
    const userChoice = choice.getAttribute('data-choice')
    playRound(userChoice)
  })
  choice.addEventListener('keydown',e => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault()
      const userChoice = choice.getAttribute('data-choice')
      playRound(userChoice)
    }
  })
})

document.addEventListener('keydown',e => {
  const k = e.key.toLowerCase()
  if(k === 'r') playRound('rock')
  if(k === 'p') playRound('paper')
  if(k === 's') playRound('scissors')
  if(k === 'n') resetGame()
})

resetBtn.addEventListener('click',() => {
  resetGame()
})

function resetGame(){
  userScore = 0
  compScore = 0
  round = 0
  userScorePara.innerText = userScore
  compScorePara.innerText = compScore
  roundDisplay.innerText = round
  historyList.innerHTML = ''
  setMessage('Play Your Move','#081b31')
  enableChoices()
  resetUISelections()
  targetWins = getTargetWins()
}
