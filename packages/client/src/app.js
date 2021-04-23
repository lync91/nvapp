import React from 'react';
import { Provider } from 'react-redux';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import GlobalStyles from '@iso/assets/styles/globalStyle';
import { store } from './redux/store';
import Boot from './redux/boot';
import Routes from './router';
import AppProvider from './AppProvider';

const client = new ApolloClient({
  uri: 'http://localhost:4040/graphql',
});

const App = () => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <AppProvider>
        <>
          <GlobalStyles />
          <Routes />
        </>
      </AppProvider>
    </Provider>
  </ApolloProvider>

);
Boot()
  .then(() => App())
  .catch(error => console.error(error));

export default App;
