import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   // // 可以用 state 来实现“记忆”功能
//   // // 用 this.state 来初始化state， this.state 应该被视为一个组件的私有属性
//   // constructor(props) {
//   //   // 在 js 类中，定义子类的构造函数时，都需要调用super方法，在所有含有构造函数的react组件中，构造函数必须以 super(props) 开头
//   //   super(props);
//   //   this.state = {
//   //     value: null,
//   //   };
//   // }

//   render() {
//     return (
//       // 这里用箭头函数能少输入代码，更重要的是避免了 this 指向所带来的问题
//       // 这里如果写成 onClick = {alert('click)} 会导致每次这个组件渲染的时候都会触发弹出框
//       <button className="square"
//         // 每次在组件中调用 setState 时，react都会自动更新其子组件
//         // onClick={() => this.setState({ value: 'X' })}>

//         // 改造
//         // 每个square被点击时，Board提供的onClick函数就会触发
//         // 1. 向DOM内置元素button 添加onClick prop，让react开启对点击事件的监听
//         // 2. 当button 被点击时，react调用Square 组件render()方法中的onClick
//         // 3. onClick触发了传入其中的 this.props.onClick()方法，这个方法是由Board传递给Square的
//         // 4. 由于Boardo把 onClick={() => this.handleClick(i)} 传递给了 Square，所以当 Square 中的事件处理函数触发时，其实就是触发 Board 当中的 this.handleClick(i) 方法。
//         onClick={() => this.props.onClick()} 
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

// 可以把Square组件改写为一个函数组件，因为组件中只包含了一个render方法，不包含state。
// 可以定义一个函数，这个函数接收props作为参数，然后返回需要渲染的元素
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // // 当遇到需要同时获取多个子组件数据，或者在两个组件之间需要相互通讯的情况时，需要把子组件的state数据提升到其共同的父组件中进行保存
  // // 之后，父组件可以通过 props 将状态数据传递到子组件中。 这样应用当中所有的组件状态数据就都方便的同步共享了。
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,    // 默认设置 X 为先手棋，点击后反转变为 O
  //   };

  // }

  // handleClick(i) {
  //   const squares = this.state.squares.slice();   // 这里用slice方法创建了一个squares数组的副本
  //   // 当有玩家获胜，或者某个Square已被填充时，该函数不做任何处理就返回。。
  //   if (calculateWinner(squares) || squares[i]) { 
  //     return;
  //   }
  //   squares[i] = this.state.xIsNext ? 'X' : 'O'; 
  //   this.setState({ 
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    // // const status = 'Next player is: ' + (this.state.xIsNext ? 'X' : 'O');
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if(winner) {
    //   status = 'Winner' + winner;
    // } else {
    //   status = 'Next player is: ' + (this.state.xIsNext ? 'X' : 'O');
    // }

    return (
      <div>
        {/* <div className="status">{status}</div> */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(porps) {
    super(porps);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,   // 记录正在查看哪一项记录
      xIsNext: true,   // 默认先手值
    };
  }

  handleClick(i) {
    // const history = this.state.history;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) { 
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'; 
    this.setState({ 
      history: history.concat([{    // 把新的历史记录拼接到history上。concat方法不会改变原数组
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // 使用最新一次的历史记录来确定并展示游戏的状态
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // 调用history的map方法，把历史步骤映射为代表按钮的React元素，展示出一个按钮列表，点击按钮跳转到对应的历史步骤
    const moves = history.map((step, move) => {
      const desc = move ? 
      'Go to move #' + move :
      'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={ current.squares }
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}