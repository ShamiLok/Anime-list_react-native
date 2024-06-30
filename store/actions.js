export const setLoginRedux = (login) => ({
    type: 'SET_LOGIN',
    payload: login
  });
  
  export const setPasswordRedux = (password) => ({
    type: 'SET_PASSWORD',
    payload: password
  });
  
  export const setTokenRedux = (token) => ({
    type: 'SET_TOKEN',
    payload: token
  });
  
  export const setServerAddressRedux = (serverAddress) => ({
    type: 'SET_SERVER_ADDRESS',
    payload: serverAddress
  });
  
  export const setIsWebRedux = (isWeb) => ({
    type: 'SET_IS_WEB',
    payload: isWeb
  });
  