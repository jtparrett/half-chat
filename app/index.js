import React from 'react'
import ReactDOM from 'react-dom'
import injectSheet from 'react-jss'

import Container from './container'

const styles = {
  '@global': {
    '@font-face': [{
      fontFamily: 'Open Sans',
      fontWeight: 700,
      src: 'url("assets/fonts/OpenSans-Bold.ttf")'
    },{
      fontFamily: 'Open Sans',
      fontWeight: 400,
      src: 'url("assets/fonts/OpenSans-Regular.ttf")'
    }],
    body: {
      margin: 0,
      fontFamily: 'Open Sans, Arial, sans-serif'
    },
    a: {
      color: '#ff8330'
    }
  }
}

const App = injectSheet(styles)(Container)

ReactDOM.render(<App />, document.getElementById('root'))