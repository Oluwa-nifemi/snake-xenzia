import {Component} from 'react';
import './Stlyles/SnakeXenzia.css';
import Snake from './Components/Snake';
import Fruit from './Fruit';


const fruitCordinate = () => {
  let x = Math.floor(Math.random() * 21);
  let y = Math.floor(Math.random() * 21);

  return ([x, y])
}


class App extends Component {

  state = {
    score: 0,
    speed: 700,
    snakePosition: [[0, 0], [0, 1], [0,2]],
    snakeFruit: fruitCordinate(),
    direction: 'right'

  }

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

      return {
        ...state,
        snakePosition: [...state.snakePosition.slice(1), newPosition]
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
              {/*<Fruit fruit={this.state.snakeFruit}/>*/}
            </div>
          </div>
        </main>
      </div>

    );
  }
}

export default App;
