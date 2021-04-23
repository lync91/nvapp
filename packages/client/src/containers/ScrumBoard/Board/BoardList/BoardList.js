import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import scrumBoardActions from '@iso/redux/scrumBoard/actions';
import NoBoardFounds from '../BoardNotFound/BoardNotFound';
import BoardListCard from './BoardListCard/BoardListCard';
import AppLayout from '../../AppLayout/AppLayout';
import { filterProjects } from '@iso/lib/helpers/filterProjects';
import { Table } from './BoardList.style';

import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

const GET_PROFILE_OF_CURRENT_USER = gql`
  query GetProjects {
    Projects{
      _id
      project_id
      project_title
    }
  }
`;

function BoardLists({
  boards,
  deleteBoardWatcher,
  editBoard,
  history,
  match,
  boardsRenderWatcher,
}) {
  useEffect(() => {
    boardsRenderWatcher();
  }, [boardsRenderWatcher]);

  const handleEdit = board => {
    editBoard(board);
    history.push(`/dashboard/scrum-board/${board._id}`);
  };
  const { data, loading, error } = useQuery(GET_PROFILE_OF_CURRENT_USER);
  return (
    <AppLayout history={history} match={match}>
      {!isEmpty(data) ? (
        <Table>
          {Object.values(data.Projects).map(project => (
            <BoardListCard
              key={project._id}
              item={project}
              onDelete={() => deleteBoardWatcher(project._id)}
              onEdit={() => handleEdit(project)}
            />
          ))}
        </Table>
      ) : (
        <NoBoardFounds history={history} match={match} />
      )}
    </AppLayout>
  );
}

export default connect(
  state => ({
    boards: filterProjects(
      state.scrumBoard.boards,
      state.scrumBoard.searchText
    ),
  }),
  { ...scrumBoardActions }
)(BoardLists);
