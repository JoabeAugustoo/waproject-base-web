import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from 'components/Layout/Toolbar';
import CardLoader from 'components/Shared/CardLoader';
import EmptyAndErrorMessages from 'components/Shared/Pagination/EmptyAndErrorMessages';
import SearchField from 'components/Shared/Pagination/SearchField';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import TableCellSortable from 'components/Shared/Pagination/TableCellSortable';
import TablePagination from 'components/Shared/Pagination/TablePagination';
import TableWrapper from 'components/Shared/TableWrapper';
import usePaginationObservable from 'hooks/usePagination';
import IDemand from 'interfaces/models/demand';
import RefreshIcon from 'mdi-react/RefreshIcon';
import React, { Fragment, memo, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import demandService from 'services/demand';

import ListItem from './ListItem';

interface IProps extends RouteComponentProps<{ t: string }> {}

const DemandListPage = memo((props: IProps) => {
  const { history } = props;
  const [params, mergeParams, loading, data, error, , refresh] = usePaginationObservable(
    params => demandService.list(params),
    { orderBy: 'name', orderDirection: 'asc' },
    []
  );

  const { total, results } = data || ({ total: 0, results: [] } as typeof data);
  const handleRefresh = useCallback(() => refresh(), [refresh]);

  const handleCreate = useCallback(() => {
    history.push('/pedidos-form');
  }, [history]);

  const handleShow = useCallback(
    (current: IDemand) => {
      history.push('/pedidos-form', { idDemand: current.id });
    },
    [history]
  );

  return (
    <Fragment>
      <Toolbar title='Pedidos' />

      <Card>
        <CardLoader show={loading} />

        <CardContent>
          <Grid container justify='space-between' alignItems='center' spacing={2}>
            <Grid item xs={12} sm={6} lg={4}>
              <SearchField paginationParams={params} onChange={mergeParams} />
            </Grid>

            <Grid item xs={12} sm={'auto'}>
              <Button fullWidth variant='contained' color='primary' onClick={handleCreate}>
                Adicionar
              </Button>
            </Grid>
          </Grid>
        </CardContent>

        <TableWrapper minWidth={500}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCellSortable paginationParams={params} disabled={loading} onChange={mergeParams} column='name'>
                  Nome
                </TableCellSortable>
                <TableCellActions>
                  <IconButton disabled={loading} onClick={handleRefresh}>
                    <RefreshIcon />
                  </IconButton>
                </TableCellActions>
              </TableRow>
            </TableHead>
            <TableBody>
              <EmptyAndErrorMessages
                colSpan={3}
                error={error}
                loading={loading}
                hasData={results.length > 0}
                onTryAgain={refresh}
              />
              {results.map(demand => (
                <ListItem key={demand.id} demand={demand} onShow={handleShow} />
              ))}
            </TableBody>
          </Table>
        </TableWrapper>

        <TablePagination total={total} disabled={loading} paginationParams={params} onChange={mergeParams} />
      </Card>
    </Fragment>
  );
});

export default DemandListPage;
