import { useState, useMemo, useEffect } from 'react'

import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  TableHead,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from '@material-ui/core'
import MUIMenu from '@material-ui/icons/Menu'
import MUIEdit from '@material-ui/icons/Edit'
import MUIDelete from '@material-ui/icons/Delete'
import MUIReplay from '@material-ui/icons/Replay'

import { getClients } from '../../core/api/clients/getClients'

import styles from './PageCustomerList.module.css'

const defaultFilter = {
    name: '',
    type: '',
    region: '',
    city: '',
  }
export function PageCustomerList() {
  const [clients, setClients] = useState([])
  const [filter, setFilter] = useState({...defaultFilter})
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  function handleChangePage(event, newPage) {
    setPage(newPage);
  }
  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }
  const rowsView = useMemo(() => {
    return clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [page, rowsPerPage, clients])
  useEffect(() => {
    getClients().then(({ data }) => {
      if (!data.results) {
        alert('Smth went wrong AHTUNG!')
      }
      setClients(data.results)
    })
  }, [])
  const regions = useMemo(() => {
    return Array.from(new Set(clients.map(c => c.region ?? '')))
  }, [clients])
  const types = useMemo(() => {
    return Array.from(new Set(clients.map(c => c.type ?? '')))
  }, [clients])

  return <>
    <AppBar color='inherit' position="static" className={styles.Root}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="меню" className={styles.MenuButton}>
          <MUIMenu />
        </IconButton>
        <Typography variant="h6" className={styles.Title}>
          Клиенты
        </Typography>
        <Button color="primary" variant="contained">Добавить</Button>
      </Toolbar>
    </AppBar>

    <Paper className={styles.Page}>
      <div className={styles.Filter}>
        <TextField variant='outlined' fullWidth label='Наименование компании' value={filter.name} onChange={e => setFilter({...filter, name: e.target.value})} />
        <FormControl variant='outlined' fullWidth>
          <InputLabel>Тип юр.лица</InputLabel>
          <Select value={filter.type} onChange={e => setFilter({...filter, type: e.target.value})}>
            <MenuItem value={''}>Не указано</MenuItem>
            {types.map(item => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant='outlined' fullWidth>
          <InputLabel>Регион</InputLabel>
          <Select variant='outlined' value={filter.region} onChange={e => setFilter({...filter, region: e.target.value})}>
            <MenuItem value={''}>Не указано</MenuItem>
            {regions.map(item => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField variant='outlined' fullWidth label='Город' value={filter.city} onChange={e => setFilter({...filter, city: e.target.value})} />
        <IconButton onClick={() => setFilter({...defaultFilter})}>
          <MUIReplay />
        </IconButton>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Наименование компании</TableCell>
              <TableCell>Тип юр.лица</TableCell>
              <TableCell>Регион</TableCell>
              <TableCell>Город</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsView.map(item => (
              <TableRow key={item.id}>
                <TableCell width='30%'>{item.name}</TableCell>
                <TableCell width='10%'>{item.type || 'N/A'}</TableCell>
                <TableCell>{item.region}</TableCell>
                <TableCell>{item.city}</TableCell>
                <TableCell width='10%' align="right">
                  <IconButton><MUIEdit/></IconButton>
                  <IconButton><MUIDelete/></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'Все', value: -1 }]}
                // colSpan={5}
                count={clients.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'Записей на странице' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

    </Paper>
  </>
}
