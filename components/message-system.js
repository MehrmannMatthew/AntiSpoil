class MessageSystem {
  constructor() {
    this.handlers = {};
    chrome.runtime.onMessage.addListener(({ signature, body }, sender) => {
      const handler = this.handlers[signature];
      if(handler) {
        handler(body);
      }
    });
  }
  addHandler(signature, handler) {
    this.handlers[signature] = handler;
  }
  send(signature, body) {
    chrome.runtime.sendMessage({
      signature,
      body
    });
  }
}

export default MessageSystem;