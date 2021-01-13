import { useContext, useState } from 'react'
import {
    Paper,
    Box,
    Typography,
    Button,
    TextField,
    Snackbar,
    FormControl,
    OutlinedInput,
    InputLabel,
    InputAdornment,
    IconButton,
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles'

import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import { createToken } from '../../core/api/token/createToken'
import { getMe } from '../../core/api/user/me'
import { UserContext } from '../../core/UserContext'


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '25ch',
    },
}));

export function LoginForm() {
    const classes = useStyles();
    const [open, setOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('testkit1301@mail.ru')
    const [password, setPassword] = useState('class456')
    const [user, setUser] = useContext(UserContext)
    function handleSubmit(e){
        e.preventDefault()
        createToken({email, password})
            .then(({ data }) => {
                if (data.access) {
                    localStorage.setItem('token/access', data.access)
                } else {
                    throw data
                }
            })
            .then(getMe)
            .then(({ data }) => {
                setUser(data)
            })
            .catch(err => {
                setOpen(true)
            })
        return false;
    }
    function handleClose() {
        setOpen(false)
    }
    function handleClickShowPassword() {
        setShowPassword(!showPassword);
    }
    function handleMouseDownPassword(event) {
        event.preventDefault();
    };

    return <Paper elevation={3}>
        <Box padding={3}>
            <form onSubmit={handleSubmit}>
                <Typography color="textPrimary" variant="h6" component="h1">
                    Авторизация
                </Typography>
                <Box marginTop={1}>
                    <TextField
                        margin="dense"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </Box>
                <Box marginTop={1}>
                    <FormControl variant="outlined" margin="dense">
                        <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            margin="dense"
                            fullWidth
                            onChange={e => setPassword(e.bubbles.value)}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }
                            labelWidth={70}
                        />
                    </FormControl>
                    {/* <TextField
                        margin="dense"
                        type="password"
                        label="Пароль"
                        variant="outlined"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    /> */}
                </Box>
                <Box marginTop={2} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" type="submit">
                        Войти
                    </Button>
                </Box>
            </form>
        </Box>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
                Ошибка авторизации
            </Alert>
        </Snackbar>
    </Paper>
}
