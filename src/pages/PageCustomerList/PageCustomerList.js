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
  const [totalClients, setTotalClients] = useState(0)
  const [clients, setClients] = useState([])
  const [filter, setFilter] = useState({...defaultFilter})
  const [page, setPage] = useState(0)
  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  useEffect(() => {
    getClients({ page: page + 1 }).then(({ data }) => {
      if (!data.results) {
        alert('Smth went wrong AHTUNG!')
      }
      console.log(data)
      setClients(data.results)
      setTotalClients(data.count)
    })
  }, [page])
  const regions = useMemo(() => {
    return Array.from(new Set(clients.map(c => c.region ?? '')))
  }, [clients])
  const types = useMemo(() => {
    return Array.from(new Set(clients.map(c => c.type ?? '')))
  }, [clients])
  const filteredClients = useMemo(() => {
    let result = [...clients]
    if (filter.name !== '') {
      result = result.filter(c => c.name.includes(filter.name))
    }
    if (filter.type !== '') {
      result = result.filter(c => c.type === filter.type)
    }
    if (filter.region !== '') {
      result = result.filter(c => c.region === filter.region)
    }
    if (filter.city !== '') {
      result = result.filter(c => c.city.includes(filter.city))
    }
    return result
  }, [clients, filter])

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
            {filteredClients.map(item => (
              <TableRow key={item.id}>
                <TableCell width='30%'>{item.name}</TableCell>
                <TableCell width='10%'>{item.type || 'N/A'}</TableCell>
                <TableCell>{item.region || 'N/A'}</TableCell>
                <TableCell>{item.city || 'N/A'}</TableCell>
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
                rowsPerPageOptions={[10]}
                // colSpan={5}
                count={totalClients}
                rowsPerPage={clients.length}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'Записей на странице' },
                  native: true,
                }}
                onChangePage={handleChangePage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

    </Paper>
  </>
}
