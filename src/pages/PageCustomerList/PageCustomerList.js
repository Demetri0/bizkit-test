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
  Snackbar,
} from '@material-ui/core'
import MUIMenu from '@material-ui/icons/Menu'
import MUIEdit from '@material-ui/icons/Edit'
import MUIDelete from '@material-ui/icons/Delete'
import MUIReplay from '@material-ui/icons/Replay'

import { Alert } from '../../components/Alert'

import { getCompanies } from '../../core/api/companies/getCompanies'
import { deleteCompany } from '../../core/api/companies/deleteCompany'

import styles from './PageCustomerList.module.css'

const defaultFilter = {
  name: '',
  type: '',
  region: '',
  city: '',
}
const defaultAlert = {
  open: false,
  type: 'default',
  message: '',
}
export function PageCustomerList() {
  const [alert, setAlert] = useState({...defaultAlert})
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalClients, setTotalClients] = useState(0)
  const [clients, setClients] = useState([])
  const [filter, setFilter] = useState({...defaultFilter})
  const [page, setPage] = useState(0)
  function handleChangePage(event, newPage) {
    setPage(newPage);
  }
  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  function handleClose() {
    setAlert({...defaultAlert})
  }
  function handleDelete(id) {
    return () => {
      deleteCompany(id)
        .then(({ data }) => {
          setClients([...clients].filter(c => c.id !== id))
          setAlert({open: true, type: 'success', message: 'Клиент успешно удалён'})
        })
        .catch(() => {
          setAlert({open: true, type: 'error', message: 'Не удалось удалить клиента'})
        })
    }
  }
  useEffect(() => {
    getCompanies({ page: 1 }) // Just because API isn't support filtration
      .then(({ data }) => {
        console.log(data)
        if (!data.results) {
          setAlert({open: true, type: 'error', message: 'Не удалось загрузить список компаний'})
        }
        setClients(data.results)
        setTotalClients(data.count)
      })
      .catch(({ data }) => {
        setAlert({open: true, type: 'error', message: 'Не удалось загрузить список компаний'})
      })
  }, [])
  const regions = useMemo(() => {
    return Array.from(new Set(clients.map(c => (c.region ?? '').trim()))).filter(r => r !== '')
  }, [clients])
  const types = useMemo(() => {
    return Array.from(new Set(clients.map(c => (c.type ?? '').trim()))).filter(r => r !== '')
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
    return result.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [clients, filter, page, rowsPerPage])

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
                  <IconButton onClick={handleDelete(item.id)}><MUIDelete/></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'Все', value: -1 }]}
                count={totalClients}
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

    <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={alert.type}>
        {alert.message}
      </Alert>
    </Snackbar>
  </>
}
