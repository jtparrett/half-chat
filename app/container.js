import {compose, withState, withHandlers, branch, renderComponent} from 'recompose'
import net from 'net'
import SHA256 from 'crypto-js/sha256'

import ConnectView from './connect'
import MessagesView from './messages'

const port = 1995

const addMessage = ({messages, updateMessages}) => (id, message) => {
  updateMessages({
    ...messages,
    [id]: message
  })
}

const broadcast = ({peers}) => (data, sender) => {
  const msg = JSON.stringify(data)
  Object.values(peers).forEach(peer => {
    if(peer === sender) return
    peer.write(msg)
  })
}

const removePeer = ({updatePeers, peers}) => (host) => {
  const update = {...peers}
  delete update[host]
  updatePeers(update)
}

const createPeer = ({updatePeers, peers, removePeer, addMessage, messages, broadcast}) => (peer, host) => {
  const selfHost = host || peer.remoteAddress.replace(/^.*:/, '')
  updatePeers({
    ...peers,
    [selfHost]: peer
  })

  peer.on('data', (data) => {
    try {
      const msg = JSON.parse(data.toString())

      if(msg.message && !messages[msg.id]){
        new Notification('Half-Chat', { body: msg.message })
        addMessage(msg.id, msg.message)
        broadcast(msg, peer)
      }
    } catch(err) {
      console.error('Invalid Message Received'.red)
    }
  })

  peer.on('error', () => removePeer(selfHost))
  peer.on('end', () => removePeer(selfHost))
}

const connectHost = ({host, createPeer}) => (e) => {
  e.preventDefault()
  const hostPeer = net.connect({host, port})
  createPeer(hostPeer, host)
}

const createMessage = ({currentMessage, updateCurrentMessage, addMessage, broadcast}) => (e) => {
  e.preventDefault()
  const id = SHA256(currentMessage).toString()
  addMessage(id, currentMessage)
  broadcast({ id, message: currentMessage })
  updateCurrentMessage('')
}

export default compose(
  withState('currentMessage', 'updateCurrentMessage'),
  withState('host', 'updateHost', '46.101.53.251'),
  withState('messages', 'updateMessages', {}),
  withState('peers', 'updatePeers', {}),
  withHandlers({ addMessage }),
  withHandlers({ broadcast }),
  withHandlers({ removePeer }),
  withHandlers({ createPeer }),
  withHandlers({ connectHost, createMessage }),
  branch(
    ({peers}) => Object.values(peers).length > 0,
    renderComponent(MessagesView)
  )
)(ConnectView)