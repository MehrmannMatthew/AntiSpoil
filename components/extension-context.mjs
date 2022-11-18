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

// use this for multi browser support

export default extensionContext;