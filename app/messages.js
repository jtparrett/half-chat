import React from 'react'
import {compose, lifecycle} from 'recompose'
import injectSheet from 'react-jss'

const styles = {
  main: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  messages: {
    flex: 1,
    overflow: 'auto'
  },
  input: {
    boxSizing: 'border-box',
    padding: 15,
    width: '100%',
    border: 'none',
    borderTop: '1px solid #ddd',
    outline: 'none',
    fontSize: 14
  },
  message: {
    margin: 0,
    padding: 15,
    fontSize: 14
  }
}


let foot
let main

const View = ({messages, currentMessage, createMessage, updateCurrentMessage, classes}) => (
  <div className={classes.main}>
    <div className={classes.messages} ref={el => main = el}>
      {Object.values(messages).map((message, i) => (
        <p key={i} className={classes.message}>{message}</p>
      ))}
      <div ref={el => foot = el} />
    </div>
    <form onSubmit={createMessage}>
      <input className={classes.input} autoFocus onChange={e => updateCurrentMessage(e.target.value)} value={currentMessage} />
    </form>
  </div>
)

export default compose(
  injectSheet(styles),
  lifecycle({
    componentDidMount(){
      foot.scrollIntoView()
    },
    componentDidUpdate(){
      if(main.scrollTop >= (main.scrollHeight - main.clientHeight) - 100){
        foot.scrollIntoView()
      }
    }
  })
)(View)