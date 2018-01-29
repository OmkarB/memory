import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';


function Card(props) {
  let show = ""

  if (props.show){
    show = ""
  } else if (props.matched.includes(props.letter)) {
    show = 'Matched'
  } else {
    show = 'hidden'
  }

  return (
      <div className='box' onClick={() => props.flip(props.card)}>
        <h1 className={show}>{props.letter}</h1>
      </div>
  );
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicks: 0,
      moveOne: {
        idx: -1,
        flipped: false
      },
      moveTwo: {
        idx: -1,
        flipped: false
      },
      letters: this.randomizeBoard(),
      matched: [],
    }

    this.resetBoard = this.resetBoard.bind(this);
    this.flip = this.flip.bind(this)
  };

  randomizeBoard() {
    const letters = "AABBCCDDEEFFGGHH";
    return _.shuffle(letters.split(''));
  }


  checkCard() {
    const { moveOne, moveTwo, letters, matched } = this.state;
    var localMatch = matched
    if (letters[moveTwo.idx] == letters[moveOne.idx]) {
      localMatch.push(letters[moveTwo.idx])

    }

  // Inspiration from https://stackoverflow.com/questions/36270422/reactjs-settimeout-not-working
    setTimeout(() => {
      this.setState({
        matched: localMatch,
        moveOne: {
          idx: -1,
          flipped: false
        },
        moveTwo: {
          idx: -1,
          flipped: false
        },
      });
    }, 1500);
  }

  resetBoard() {
    this.setState = ({
      clicks: 0,
      moveOne: {
        idx: -1,
        flipped: false,
      },
      moveTwo: {
        idx: -1,
        flipped: false,
      },
      letters: this.randomizeBoard(),
      matched: [],
    })
  }

  flip(card) {
    const {moveOne, moveTwo, clicks} = this.state;

    if (!moveOne.flipped) {
      this.setState({
        moveOne: {
          idx: card,
          flipped: true
        },
        clicks: clicks + 1
      })
    } else if (!moveTwo.flipped) {
      this.setState({
        moveTwo: {
          idx: card,
          flipped: true
        },
        clicks: clicks + 1
      }, this.checkCard)
    }
  }

  buildBoard(letters) {
    var rows = []
    for (var idx = 0; idx < letters.length; idx++) {
      rows.push(<Card
        letter={letters[idx]}
        card={idx}
        flip={this.flip}
        matched={this.state.matched}
        show={this.state.moveOne.idx === idx || this.state.moveTwo.idx === idx}/>)
    }
    return rows
  }


  render() {
    return (
      <div>
          <div>
            <h3>{"Score:" + this.state.clicks}</h3>
          </div>

          <div className='row'>
            {this.buildBoard(this.state.letters)}
          </div>

          <Button onClick={this.reset}>Reset</Button>
      </div>
    )
  }
}

export default function run_game(root) {
  ReactDOM.render(<MemoryGame />, root);
}