import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';


function Card(props) {
  let show = ""
  if (props.show || props.matched.includes(props.letter)){
    show = ""
  } else {
    show = 'hidden'
  }
  return (
      <div className='box' onClick={() => props.toggle(props.card)}>
        <h3 className={show}>{props.letter}</h3>
      </div>
  );
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      clicks: 0,      
      matched: [],
      moveOne: -1,
      moveTwo: -1,
      cards: []
    }
    this.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => { alert("Unable to join:\n" + resp); });
    }

  gotView(view) {
    console.log(this.state)
    this.setState(view.game);
  }

  reset() {
    this.channel.push("new")
      .receive("ok", this.gotView.bind(this))
  }

  toggle(idx){
    console.log(idx)
    this.channel.push("toggle", {idx: idx})
      .receive('ok', this.gotView.bind(this));
  }

  buildBoard(letters) {
    var toggle = this.toggle.bind(this);

    var rows = []
    for (var idx = 0; idx < letters.length; idx++) {
      rows.push(<Card
        letter={letters[idx]}
        key={idx}
        card={idx}
        toggle={toggle}
        matched={this.state.matched}
        show={this.state.moveOne == idx | this.state.moveTwo == idx }/>)
    }
    return rows
  }


  render() {
    return (
      <div>
          <div>
            <h3>{"Clicks:" + this.state.clicks}</h3>
          </div>

          <div className='row'>
            {this.buildBoard(this.state.cards)}
          </div>

          <Button onClick={this.reset}>Reset</Button>
      </div>
    )
  }
}

export default function run_game(root, channel) {
  ReactDOM.render(<MemoryGame channel={channel}/>, root);
}