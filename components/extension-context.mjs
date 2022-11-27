const getExtensionContext = () => {
    try {
        if(window) {
            return window.chrome || window.browser;
        }
    }
    catch(err) {
        return {};
    }
};

const extensionContext = getExtensionContext();

export default extensionContext;