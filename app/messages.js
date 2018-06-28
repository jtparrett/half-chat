import React from 'react'
import {compose, lifecycle} from 'recompose'
import injectSheet from 'react-jss'
import ReactAutolink from 'react-autolink'
import {shell} from 'electron'

const styles = {
  main: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  messages: {
    flex: 1,
    overflow: 'auto',
    padding: 10
  },
  input: {
    boxSizing: 'border-box',
    padding: 15,
    width: '100%',
    border: 'none',
    borderTop: '1px solid #ddd',
    outline: 'none',
    fontSize: 12
  },
  message: {
    margin: 0,
    padding: 5,
    fontSize: 12
  }
}


let foot
let main

const openLink = (e) => {
  e.preventDefault()
  shell.openExternal(e.target.href)
  return false
}

const View = ({messages, currentMessage, createMessage, updateCurrentMessage, classes}) => (
  <div className={classes.main}>
    <div className={classes.messages} ref={el => main = el}>
      {Object.values(messages).map((message, i) => (
        <p key={i} className={classes.message} style={{ color: message.color }}>{ReactAutolink.autolink(message.message, {onClick: openLink})}</p>
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