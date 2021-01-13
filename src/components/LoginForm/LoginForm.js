import { useState } from 'react'
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
import MuiAlert from '@material-ui/lab/Alert'

import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function LoginForm({ login }) {
    const [open, setOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('testkit1301@mail.ru')
    const [password, setPassword] = useState('class456')
    function handleSubmit(e){
        e.preventDefault()
        login({email, password}).catch(err => {
            setOpen(true)
        })
    }
    function handleClose() {
        setOpen(false)
    }
    function handleClickShowPassword() {
        setShowPassword(!showPassword)
    }
    function handleMouseDownPassword(event) {
        event.preventDefault()
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
                        <InputLabel shrink htmlFor="outlined-adornment-password">Пароль</InputLabel>
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
