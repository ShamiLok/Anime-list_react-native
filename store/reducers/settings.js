const initialState = {
  isWeb: true,
  login: '',
  password: '',
  token: '',
  serverAddress: ''
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_IS_WEB':
      return {
        ...state,
        isWeb: action.payload
      };
    case 'SET_LOGIN':
      return {
        ...state,
        login: action.payload
      };
    case 'SET_PASSWORD':
      return {
        ...state,
        password: action.payload
      };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload
      };
    case 'SET_SERVER_ADDRESS':
      return {
        ...state,
        serverAddress: action.payload
      };
    default:
      return state;
  }
};

export default settingsReducer;



// const initialState = {
//     count: 0
//   };
  
//   const counterReducer = (state = initialState, action) => {
//     switch (action.type) {
//       case 'INCREMENT':
//         return {
//           ...state,
//           count: state.count + 1
//         };
//       case 'DECREMENT':
//         return {
//           ...state,
//           count: state.count - 1
//         };
//       default:
//         return state;
//     }
//   };
  
//   export default counterReducer;
  