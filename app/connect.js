import React from 'react'
import injectSheet from 'react-jss'

const styles = {
  
}

const View = ({updateHost, host, connectHost}) => (
  <form onSubmit={connectHost}>
    <input autoFocus onChange={e => updateHost(e.target.value)} defaultValue={host} />
    <button type="submit">Connect</button>
  </form>
)

export default injectSheet(styles)(View)