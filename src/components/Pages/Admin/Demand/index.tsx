import React, { memo } from 'react';
import { Route, Switch } from 'react-router-dom';

import DemandListPage from './List';

const DemandIndexPage = memo(() => {
  return (
    <Switch>
      <Route path='/' component={DemandListPage} />
    </Switch>
  );
});

export default DemandIndexPage;
