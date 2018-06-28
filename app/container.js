import {compose, withState, withHandlers, branch, renderComponent} from 'recompose'
import net from 'net'
import SHA256 from 'crypto-js/sha256'

import ConnectView from './connect'
import MessagesView from './messages'

const genColor = () => Math.floor(Math.random() * 200) + 30

const color = `rgb(${genColor()}, ${genColor()}, ${genColor()})`
const port = 1995

const addMessage = ({messages, updateMessages}) => (id, message, color) => {
  updateMessages({
    ...messages,
    [id]: {message, color}
  })
}

const broadcast = ({peers}) => (data, sender) => {
  const msg = JSON.stringify(data)
  Object.values(peers).forEach(peer => {
    if(typeof peer !== 'object' || peer === sender) return
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
  let updatedPeers = {
    ...peers,
    [selfHost]: peer
  }
  updatePeers(updatedPeers)

  peer.on('data', (data) => {
    try {
      const msg = JSON.parse(data.toString())

      if(msg.connectionTable){
        updatedPeers = {
          ...msg.connectionTable,
          ...updatedPeers
        }

        delete updatedPeers[msg.selfHost]
        updatePeers(updatedPeers)
        findPeers({ peers: updatedPeers, createPeer })(0)
      }

      if(msg.message && !messages[msg.id]){
        addMessage(msg.id, msg.message, msg.color)
        broadcast(msg, peer)
      }
    } catch(err) {
      console.error('Invalid Message Received'.red)
    }
  })

  peer.on('error', () => removePeer(selfHost))
  peer.on('end', () => removePeer(selfHost))
}

const findPeers = ({peers, createPeer}) => (startPeerIndex) => {
  let searchIndex = 1
  const keys = Object.keys(peers)
  while(searchIndex < keys.length){
    const index = (startPeerIndex + searchIndex) % keys.length
    const host = keys[index-1]
    const preConnected = keys.some(k => k === host && typeof peers[k] === 'object')
    if(host && !preConnected){
      const newPeer = net.connect({host, port})
      createPeer(newPeer, host)
    }
    searchIndex *= 2
  }
}

const connectHost = ({host, createPeer}) => (e) => {
  e.preventDefault()
  const hostPeer = net.connect({host, port})
  createPeer(hostPeer, host)
}

const createMessage = ({currentMessage, updateCurrentMessage, addMessage, broadcast}) => (e) => {
  e.preventDefault()
  const id = SHA256(currentMessage + new Date().getTime()).toString()
  broadcast({ id, message: currentMessage, color })
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