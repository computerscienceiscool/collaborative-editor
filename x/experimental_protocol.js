// File: toygrid/x/experimental_protocols.js
// Experimental protocols and agents under toygrid/x

const { ProtocolRegistry, Agent } = require('../simulator');

// Protocol ID for random-message routing
const SID_RANDOM = 'SID_RANDOM';

/**
 * Handler for the random-message protocol.
 * On receiving a message, pick a random peer and forward the payload.
 */
function randomMessageHandler(agent, message) {
  const peers = agent.getPeers();
  if (!peers || peers.length === 0) return;
  const nextPeer = peers[Math.floor(Math.random() * peers.length)];
  agent.send(nextPeer, { protocol: SID_RANDOM, payload: message.payload });
}

// Register the handler with the protocol registry
ProtocolRegistry.register(SID_RANDOM, randomMessageHandler);

/**
 * ThreatAgent: constructs a hyper-tree topology over peers.
 */
class ThreatAgent extends Agent {
  constructor(id, peers) {
    super(id);
    this.peers = peers;
    this.buildHyperTree();
  }

  /**
   * Build a binary hyper-tree: each node connects to its parent and children.
   */
  buildHyperTree() {
    const sortedPeers = [...this.peers];
    sortedPeers.sort();
    sortedPeers.forEach((peerId, idx) => {
      const position = idx + 1;
      // Parent index
      const parentPos = Math.floor(position / 2);
      if (parentPos > 0) {
        const parentId = sortedPeers[parentPos - 1];
        this.addNeighbor(parentId);
      }
      // Child indices
      [2 * position, 2 * position + 1].forEach(childPos => {
        if (childPos <= sortedPeers.length) {
          const childId = sortedPeers[childPos - 1];
          this.addNeighbor(childId);
        }
      });
    });
  }

  /**
   * Convenience: send a payload under the random-message protocol.
   */
  sendMessage(payload) {
    randomMessageHandler(this, { protocol: SID_RANDOM, payload });
  }
}

module.exports = { SID_RANDOM, ThreatAgent };


