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
  sendTabs(signature, body){
    extensionContext.tabs.query({}, function(tabs) {
      for(const tab of tabs) {
        try {
          if(typeof tab.id === 'number') {
            extensionContext.tabs.sendMessage(tab.id, {
              signature,
              body
            });
          }
        }
        catch(err) {
          console.warn(err);
        }
      }
    });
  }
}

export default MessageSystem;