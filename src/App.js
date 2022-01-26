import {Component} from 'react';
import './Stlyles/SnakeXenzia.css';
import Snake from './Components/Snake';
import Fruit from './Fruit';


export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generateRandomFruit = () => {
  let x = getRandomNumber(0, 10);
  let y = getRandomNumber(0, 10);

  return ([x, y])
}


const initialState = {
  score: 0,
  speed: 400,
  snakePosition: [[0, 0], [0, 1], [0,2]],
  snakePositionMap: {
    '0,0': true,
    '0,1': true,
    '0,2': true,
  },
  snakeFruit: generateRandomFruit(),
  direction: 'right'

}

class App extends Component {

  state = initialState

  componentDidMount() {
    this.interval = setInterval(() => this.move(), this.state.speed)
    document.addEventListener('keydown', this.handleKeyDown);
  }

  getNewPosition(snakePosition, direction){
    const snakeHead = snakePosition[snakePosition.length - 1];

    switch (direction){
      case "right":
        return [snakeHead[0], snakeHead[1] + 1]
      case "left":
        return [snakeHead[0], snakeHead[1] - 1]
      case "up":
        return [snakeHead[0] - 1, snakeHead[1]]
      case "down":
        return [snakeHead[0] + 1, snakeHead[1]]
    }
  }

  move(){
    this.setState(state => {
      const newPosition = this.getNewPosition(state.snakePosition, state.direction);

      if(newPosition[0] > 9 ||
        newPosition[0] < 0 ||
        newPosition[1] > 9 ||
        newPosition[1] < 0
      ){
        //New node is invalid
        return state;
      }

      if(this.state.snakePositionMap[`${newPosition[0]},${newPosition[1]}`]){
        alert('Game over stop eating yourself')
        return Object.assign(initialState)
      }

      //Add new position to snake position map
      const newPositionMap = {...this.state.snakePositionMap};

      newPositionMap[`${newPosition[0]},${newPosition[1]}`] = true;

      //Check if head matches the snake position
      if(newPosition[0] === this.state.snakeFruit[0] && newPosition[1] === this.state.snakeFruit[1]){

        //If head matches snake position then do not remove tail
        return {
          ...state,
          snakePosition: [...state.snakePosition, newPosition],
          snakePositionMap: newPositionMap,
          snakeFruit: generateRandomFruit() //Generate new position for snake
        }
      }

      const [firstX, firstY] = state.snakePosition[0];
      newPositionMap[`${firstX},${firstY}`] = false;

      return {
        ...state,
        snakePosition: [...state.snakePosition.slice(1), newPosition],
        snakePositionMap: newPositionMap
      }
    })
  }

  //Checks when user goes in a direction
  handleKeyDown = (e) => {
    const isDirectionKey = [37, 38, 39, 40].includes(e.keyCode);

    if(isDirectionKey){
      clearInterval(this.interval)
    }

    let newDirection;
    let isReversed = false;
    switch (e.keyCode) {
      case  37:
        newDirection = 'left';
        isReversed = this.state.direction === 'right';

        break;

      case 38:
        newDirection = 'up'
        isReversed = this.state.direction === 'down'

        break;

      case 39 :
        newDirection = 'right'
        isReversed = this.state.direction === 'left'

        break;


      case 40:
        newDirection = 'down'
        isReversed = this.state.direction === 'up'

        break;
    }

    if(isDirectionKey){
      this.setState(state => {
          let currentPositions = [...state.snakePosition];

          if(isReversed){
            currentPositions = currentPositions.reverse()
          }

          return {
            ...state,
            snakePosition: currentPositions,
            direction: newDirection
          }
      }, () => {
        this.move()

        this.interval = setInterval(() => this.move(), this.state.speed)
      })
    }
  }

  render() {
    return (
      <div className='App'>
        <main className='snake-board'>
          <div className='container'>
            <div className='snake-field'>
              <Snake snakePosition={this.state.snakePosition}/>
              <Fruit position={this.state.snakeFruit}/>
            </div>
          </div>
        </main>
      </div>

    );
  }
}

export default App;
