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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@material-ui/core'
import MUIMenu from '@material-ui/icons/Menu'
import MUIEdit from '@material-ui/icons/Edit'
import MUIDelete from '@material-ui/icons/Delete'
import MUIReplay from '@material-ui/icons/Replay'

import { Alert } from '../../components/Alert'

import { getCompanies } from '../../core/api/companies/getCompanies'
import { deleteCompany } from '../../core/api/companies/deleteCompany'
import { getCompanyById } from '../../core/api/companies/getCompanyById'
import { createCompany } from '../../core/api/companies/createCompany'
import { patchCompany } from '../../core/api/companies/patchCompany'

import styles from './PageCustomerList.module.css'

const defaultFilter = {
  name: '',
  type: '',
  region: '',
  city: '',
}
const defaultAlert = {
  open: false,
  type: 'info',
  message: '',
}
export function PageCustomerList() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [editItemId, setEditItemId] = useState('')
  const [alert, setAlert] = useState({...defaultAlert})
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalClients, setTotalClients] = useState(0)
  const [clients, setClients] = useState([])
  const [filter, setFilter] = useState({...defaultFilter})
  const [page, setPage] = useState(0)
  function handleChangePage(event, newPage) {
    setPage(newPage);
  }
  function handleEditItem(id) {
    return () => {
      setEditItemId(id)
      setDialogOpen(true)
    }
  }
  function handleCloseDialog(updatedData, id) {
    setDialogOpen(false)
    setEditItemId('')
    if (updatedData) {
      if (id) {
        setClients(clients => clients.map(item => {
          if (item.id !== id) {
            return item
          }
          return {...item, ...updatedData}
        }))
      } else {
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
      }
    }
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
        <Button onClick={handleEditItem('')} color="primary" variant="contained">Добавить</Button>
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
                  <IconButton onClick={handleEditItem(item.id)}><MUIEdit/></IconButton>
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

    <ClientEditDialog open={isDialogOpen} id={editItemId} onClose={handleCloseDialog} />

    <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={alert.type}>
        {alert.message}
      </Alert>
    </Snackbar>
  </>
}

const defaultData = {
  name: '',
  shortname: '',
  type: '',
  registered_type: '',
  region: '',
  city: '',
  email: '',
  phone: '',
  description: '',
}
function ClientEditDialog({ id, open, onClose }) {
  const [alert, setAlert] = useState({...defaultAlert})
  const [data, setData] = useState({...defaultData})
  useEffect(() => {
    if (id === '') {
      setData({...defaultData})
      return
    }
    getCompanyById(id)
      .then(({ data }) => {
        console.log(data)
        setData({
          name: data.name || '',
          shortname: data.shortname || '',
          type: data.type || '',
          registered_type: data.registered_type || '',
          region: data.region || '',
          city: data.city || '',
          email: data.email || '',
          phone: data.phone || '',
          description: data.description || '',
        })
      })
      .catch(console.error)
  }, [id])
  function handleSubmit(e) {
    e.preventDefault()
    const action = (id === '') ? createCompany : patchCompany
    action(id, data)
      .then(() => {
        setAlert({open: true, type: 'success', message: 'Данные успешно сохранены'})
        setTimeout(() => {
          onClose(data, id)
        }, 2500)
      })
      .catch((data) => {
        setAlert({open: true, type: 'error', message: 'Не удалось сохранить данные'})
      })
  }
  function handleChange(e) {
    setData(state => ({...state, [e.target.name]: e.target.value}))
  }
  function handleCloseAlert() {
    setAlert({...defaultAlert})
  }

  return <Dialog open={open} onClose={onClose} aria-labelledby="edit-dialog-title">
    <DialogTitle id="edit-dialog-title">
      {id !== ''? 'Редактирование клента' : 'Добавление клиента'}
    </DialogTitle>
    <DialogContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              required
              value={data.name}
              onChange={handleChange}
              name='name'
              label='Наименование компании'
              margin='dense'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              value={data.shortname}
              onChange={handleChange}
              name='shortname'
              label='Короткое название'
              margin='dense'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              value={data.type}
              onChange={handleChange}
              name='type'
              label='Тип юр.лица'
              margin='dense'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              value={data.registered_type}
              onChange={handleChange}
              name='registered_type'
              label='Сфера деятельности'
              margin='dense'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              value={data.region}
              onChange={handleChange}
              name='reion'
              label='Регион'
              margin='dense'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              value={data.city}
              onChange={handleChange}
              name='city'
              label='Город'
              margin='dense'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              value={data.email}
              onChange={handleChange}
              name='email'
              type='email'
              label='Email'
              margin='dense'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              value={data.phone}
              onChange={handleChange}
              name='phone'
              label='Телефон'
              margin='dense'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={data.description}
              onChange={handleChange}
              name='description'
              label='Дополнительно (описание)'
              rows={3}
              multiline
              margin='dense'
              variant='outlined'
              fullWidth
            />
          </Grid>
        </Grid>
      </form>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Отменить
      </Button>
      <Button onClick={handleSubmit} color="primary">
        {id !== '' ? 'Сохранить' : 'Добавить'}
      </Button>
    </DialogActions>

    <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
      <Alert onClose={handleCloseAlert} severity={alert.type}>
        {alert.message}
      </Alert>
    </Snackbar>
  </Dialog>
}
