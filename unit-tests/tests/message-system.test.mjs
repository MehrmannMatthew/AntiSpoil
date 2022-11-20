import { test, expect, mock } from '../test-framework.mjs';
import extensionContext from '../../components/extension-context.mjs';
import MessageSystem from '../../components/message-system.mjs';

// browser mock setup
extensionContext.runtime = {
    onMessage: {
        addListener: mock,
    },
    sendMessage: mock
};

test('Message System - constructor should call add listener through the extension context', async () => {

    const messageSystem = new MessageSystem();

    const [constructorHandler] = mock().getArguments();

    expect(typeof constructorHandler === 'function');

});

test('Message System - should call send message through the extension context', async () => {

    const messageSystem = new MessageSystem();

    const messageSignature = 'signature';
    const messageBody = 'body';

    messageSystem.send(messageSignature, messageBody);

    const [{ signature, body }] = mock().getArguments();

    expect(signature === messageSignature);
    expect(body === messageBody);

});

test('Message System - add handler should add a function to the handlers property', async () => {

    const messageSystem = new MessageSystem();

    messageSystem.addHandler('example', () => 0);

    expect(typeof messageSystem.handlers['example'] === 'function');

});