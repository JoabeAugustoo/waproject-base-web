import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from 'components/Layout/Toolbar';
import Toast from 'components/Shared/Toast';
import IProduct from 'interfaces/models/product';
import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import demandService from 'services/demand';

interface IProps extends RouteComponentProps<{ t: string }> {}

export class Product implements IProduct {
  name: string = '';
  value: number = 0;
  amount: number = 0;
}

const useStyle = makeStyles(() => ({
  cardActions: {
    marginTop: '10px',
    display: 'flex'
  },
  dGrid: {
    display: 'grid'
  }
}));

const DemandFormPage = memo((props: IProps) => {
  const { history } = props;
  const [products, setProducts] = useState<IProduct[]>([]);
  const [idDemand, setIdDemand] = useState<number>(null);
  const [wrapper, setWrapper] = useState<Product>(new Product());
  const classes = useStyle(props);

  const onLoadDemand = useCallback((id: number) => {
    load(id);
    function load(id: number) {
      return (
        demandService.findByProducts(id).subscribe((prods: IProduct[]) => {
          setProducts(prods);
        }),
        (err: any) => {
          console.log(err);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!!props.location.state && !!props.location.state['idDemand']) {
      setIdDemand(props.location.state['idDemand']);
      onLoadDemand(props.location.state['idDemand']);
    }
  }, [props.location.state, onLoadDemand]);

  const oncomplete = useCallback(() => {
    history.push('/pedidos');
  }, [history]);

  const handleCreate = useCallback(() => {
    if (!wrapper.name) {
      Toast.error('Necessário colocar o nome no produto');
      return;
    }
    if (!wrapper.amount) {
      Toast.error('Necessário colocar a quantidade no produto');
      return;
    }
    if (!wrapper.value) {
      Toast.error('Necessário colocar o valor no produto');
      return;
    }

    const wrp = [...products, { ...wrapper }];
    setWrapper(new Product());
    setProducts(wrp);
  }, [wrapper, products]);

  const handleSave = useCallback(() => {
    onSubmit(products);
    function onSubmit(model: Array<IProduct>) {
      return (
        demandService.saveAllProducts(model).subscribe(() => {
          Toast.show('Lista de Produtos salva com sucesso');
          oncomplete();
        }),
        (err: any) => {
          console.log(err);
        }
      );
    }
  }, [products, oncomplete]);

  function onChangeName(e: any) {
    setWrapper({ ...wrapper, name: e.target.value });
  }

  function onChangeAmount(e: any) {
    setWrapper({ ...wrapper, amount: e.target.value });
  }

  function onChangeValue(e: any) {
    setWrapper({ ...wrapper, value: e.target.value });
  }

  return (
    <Fragment>
      <Toolbar title='Cadastro de Pedidos' />
      <Card>
        {!idDemand && (
          <CardContent>
            <Grid container alignItems='center' spacing={2}>
              <Grid item xs={12} sm={12} lg={5} className={classes.dGrid}>
                <TextField value={wrapper.name} label='Nome' onChange={onChangeName} />
              </Grid>
              <Grid item xs={12} sm={6} lg={3} className={classes.dGrid}>
                <TextField label='Quanditade' type='number' value={wrapper.amount} onChange={onChangeAmount} />
              </Grid>
              <Grid item xs={12} sm={6} lg={3} className={classes.dGrid}>
                <TextField label='Valor Unitário' value={wrapper.value} type='number' onChange={onChangeValue} />
              </Grid>
              <Grid item xs={12} sm={12} lg={1}>
                <Button variant='contained' color='primary' onClick={handleCreate}>
                  Adicionar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        )}
        <TableContainer component={Paper}>
          <Table aria-label='customized table'>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align='right'>Quantidade</TableCell>
                <TableCell align='right'>Valor Unitário</TableCell>
                <TableCell align='right'>Valor Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(row => (
                <TableRow key={row.name}>
                  <TableCell component='th' scope='row'>
                    {row.name}
                  </TableCell>
                  <TableCell align='right'>{row.amount}</TableCell>
                  <TableCell align='right'>{row.value}</TableCell>
                  <TableCell align='right'>{row.amount * row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      {!idDemand && (
        <Card className={classes.cardActions}>
          <CardContent>
            <Grid container alignItems='center' spacing={5}>
              <Grid item xs={12} sm={12} lg={3}>
                <Button fullWidth variant='contained' color='primary' onClick={handleSave}>
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Fragment>
  );
});

export default DemandFormPage;
