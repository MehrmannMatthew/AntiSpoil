import extensionContext from './extension-context.mjs';

class MessageSystem {
  constructor() {
    this.handlers = {};
    extensionContext.runtime.onMessage.addListener(({ signature, body }) => {
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
    extensionContext.runtime.sendMessage({
      signature,
      body
    });
  }
}

export default MessageSystem;