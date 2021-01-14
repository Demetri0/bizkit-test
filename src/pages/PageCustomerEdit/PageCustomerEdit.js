import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Snackbar,
} from '@material-ui/core'

import MUIMenu from '@material-ui/icons/Menu'

import { Alert } from '../../components/Alert'

import { getCompanyById } from '../../core/api/companies/getCompanyById'
import { patchCompany } from '../../core/api/companies/patchCompany'

import styles from './PageCustomerEdit.module.css'

function TabPanel({ children, value, index}) {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && (
        <Box paddingTop={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function Loading() {
  return <div className={styles.Loading}>
    <Typography>Загрузка...</Typography>
  </div>
}

const defaultValues = {
  'name' : '',
  'shortname' : '',
  'workscope' : '',
  'region' : '',
  'city' : '',
  'email' : '',
  'phone' : '',
  'description' : '',
  'registered_name' : '',
  'registered_type' : '',
  'bin_iin' : '',
  'leader' : '',
  'leader_position' : '',
  'registered_address' : '',
  'address' : '',
}
const defaultAlert = {
  open: false,
  type: 'info',
  message: '',
}
export function PageCustomerEdit() {
  const { id } = useParams()

  const [alert, setAlert] = useState({...defaultAlert})
  function handleCloseAlert() {
    setAlert({...defaultAlert})
  }

  const [tab, setTab] = useState(0)
  function onChange(e, idx) {
    setTab(idx)
  }
  const [values, setValues] = useState(null)
  function onChangeField(e) {
    setValues(data => ({...data, [e.target.name]: e.target.value}))
  }
  useEffect(() => {
    getCompanyById(id)
      .then(({ data }) => {
        let merged = {}
        Object.keys(data).forEach(k => merged[k] = data[k] ?? defaultValues[k])
        setValues(merged)
      })
      .catch(() => {
        setAlert({open: true, type: 'error', message: 'Ошибка. Попробуйте перезагрузить страницу'})
      })
  }, [id])

  function addButtonClick() {
    alert('Так ведь мы редактируем вроде как. Что "Добавить"?')
  }

  function handleSubmit(e) {
    e.preventDefault()
    patchCompany(id, values)
      .then(({ data }) => {
        setAlert({open: true, type: 'success', message: 'Данные сохранены'})
      })
      .catch(error => {
        const data = error.response.data
        if (data) {
          console.log(data)
          const key = Object.keys(data)[0]
          setAlert({open: true, type: 'error', message: `[${key}] ${data[key]}`})
        } else {
          setAlert({open: true, type: 'error', message: 'Не удалось сохранить данные'})
        }
      })
  }

  return <>
    <AppBar color='inherit' position="static" className={styles.Root}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="меню" className={styles.MenuButton}>
          <MUIMenu />
        </IconButton>
        <Typography variant="h6" className={styles.Title}>
          {values?.name ?? 'Загрузка...'}
        </Typography>
        <Button onClick={addButtonClick} color="primary" variant="contained">Добавить</Button>
      </Toolbar>
    </AppBar>

    <Paper className={styles.Page}>
      <Tabs value={tab} onChange={onChange}>
        <Tab label='Информация' />
        <Tab label='Банковские реквизиты' />
      </Tabs>

      {(!values) ? (
        <Loading />
      ) : <>
        <TabPanel value={tab} index={0}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={6} >
              <Grid container item xs={12} md={6} spacing={2} alignContent='flex-start'>
                <Grid item xs={12}>
                  <Typography variant='h6' component='h2'>Основная информация</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label='Наименование компании'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='name'
                    value={values.name}
                    onChange={onChangeField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label='Короткое название'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='shortname'
                    value={values.shortname}
                    onChange={onChangeField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label='Сфера деятельности'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='workscope'
                    value={values.workscope}
                    onChange={onChangeField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label='Регион'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='region'
                    value={values.region}
                    onChange={onChangeField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label='Город'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='city'
                    value={values.city}
                    onChange={onChangeField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    type='email'
                    label='Email'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='email'
                    value={values.email}
                    onChange={onChangeField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    type='tel'
                    label='Телефон'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='phone'
                    value={values.phone}
                    onChange={onChangeField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Дополнительно (описание)'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='description'
                    multiline
                    rows={3}
                    value={values.description}
                    onChange={onChangeField}
                  />
                </Grid>
              </Grid>
              <Grid container item xs={12} md={6} spacing={2} alignContent='flex-start'>
                <Grid item xs={12}>
                  <Typography variant='h6' component='h2'>Реквизиты компании</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label='Наименование юр.лица'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='registered_name'
                    value={values.registered_name}
                    onChange={onChangeField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label='Тип юр.лица'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='registered_type'
                    value={values.registered_type}
                    onChange={onChangeField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label='БИН/ИИН'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='bin_iin'
                    value={values.bin_iin}
                    onChange={onChangeField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label='Руководитель'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='leader'
                    value={values.leader}
                    onChange={onChangeField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label='Должность руководителя'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='leader_position'
                    value={values.leader_position}
                    onChange={onChangeField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label='Юридический адрес'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='registered_address'
                    value={values.registered_address}
                    onChange={onChangeField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label='Фактический адрес'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    name='address'
                    value={values.address}
                    onChange={onChangeField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    value='left'
                    control={<Switch color='primary' />}
                    label='Плательщик НДС (нет/да)'
                    labelPlacement='start'
                    margin='dense'
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} className={styles.SaveButtonWrap}>
                <Button type='submit' variant='contained' color='primary' size='large'>Сохранить</Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          teststs
        </TabPanel>
      </>}
    </Paper>

    <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
      <Alert onClose={handleCloseAlert} severity={alert.type}>
        {alert.message}
      </Alert>
    </Snackbar>
  </>
}
