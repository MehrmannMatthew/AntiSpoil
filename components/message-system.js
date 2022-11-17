import extensionContext from './extension-context.js';

class MessageSystem {
  constructor() {
    this.handlers = {};
    extensionContext.runtime.onMessage.addListener(({ signature, body }, sender) => {
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
      for(const tab of tabs){
        console.log(tab);
        extensionContext.tabs.sendMessage(tab.id, {
          signature,
          body
        });
      }
    });
  }
}

export default MessageSystem;