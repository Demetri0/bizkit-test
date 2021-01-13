import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import MUIAssignment from '@material-ui/icons/Assignment'
import MUIExitToApp from '@material-ui/icons/ExitToApp'

import styles from './Sidebar.module.css'

export function Sidebar() {
  return (
    <Drawer
      className={styles.Drawer}
      variant="permanent"
      classes={{
        paper: styles.Drawer__paper
      }}
      anchor="left"
    >
      <div className={styles.Drawer__header} />
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <MUIAssignment />
          </ListItemIcon>
          <ListItemText primary='Клиенты' />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <MUIExitToApp />
          </ListItemIcon>
          <ListItemText primary='Выход' />
        </ListItem>
      </List>
    </Drawer>
  )
}
