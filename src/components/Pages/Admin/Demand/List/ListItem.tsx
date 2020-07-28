import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { IOption } from 'components/Shared/DropdownMenu';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import IDemand from 'interfaces/models/demand';
import EyeIcon from 'mdi-react/EyeIcon';
import React, { memo, useCallback, useMemo } from 'react';

interface IProps {
  demand: IDemand;
  onShow: (demand: IDemand) => void;
}

const ListItem = memo((props: IProps) => {
  const { demand, onShow } = props;
  const handleShow = useCallback(() => {
    onShow(demand);
  }, [onShow, demand]);

  const options = useMemo<IOption[]>(() => {
    return [{ text: 'Visualizar', icon: EyeIcon, handler: handleShow }];
  }, [handleShow]);

  return (
    <TableRow>
      <TableCell>{demand.name}</TableCell>
      <TableCellActions options={options} />
    </TableRow>
  );
});

export default ListItem;
