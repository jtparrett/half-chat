import React from 'react'
import ReactDOM from 'react-dom'
import injectSheet from 'react-jss'

import Container from './container'

const styles = {
  '@global': {
    body: {
      margin: 0
    }
  }
}

const App = injectSheet(styles)(Container)

ReactDOM.render(<App />, document.getElementById('root'))