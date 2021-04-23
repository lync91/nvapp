import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Board from './Board/Board';
import ModalRoot from './rootModal';
import DrawerRoot from './rootDrawer';
import BoardLists from './Board/BoardList/BoardList';
import CreateBoard from './Board/BoardCreateOrUpdate/BoardCreateOrUpdate';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

const GET_PROFILE_OF_CURRENT_USER = gql`
  query GetProjects {
    projects {
      name
    }
  }
`;

export default function ScrumBoard() {
  const { data, loading, error } = useQuery(GET_PROFILE_OF_CURRENT_USER);
  console.log(data);
  const match = useRouteMatch();
  return (
    <>
      <Switch>
        <Route exact path={`${match.path}`} component={BoardLists} />
        <Route exact path={`${match.path}/:id`} component={CreateBoard} />
        <Route path={`${match.path}/project/:id`} component={Board} />
      </Switch>
      <ModalRoot />
      <DrawerRoot />
    </>
  );
}
