const drawerWidth = 70;

const openDrawerWidth = 280;

export const sideBarStyles = {
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        justifyContent: "space-between",
        gap: "10px",
        textAlign: 'center',
    },
    position: 'relative',
}

export const sideBarOpenStyles = (open) => {

    const hideDrawer = open ? openDrawerWidth : drawerWidth;

    return {
        width: hideDrawer,
        flexShrink: 0,
        display: open ? 'block' : 'none',
        left: open ? drawerWidth : 0,
        '& .MuiDrawer-paper': {
            width: hideDrawer,
            boxSizing: 'border-box',
            zIndex: 1000,
            left: drawerWidth,
            alignItems: 'center',
            justifyContent: 'space-between',
        },
    }
}

export const sideBarUnreadMessages = { 
    borderRadius: '50%', 
    bgcolor: 'error.dark', 
    width: '10px', 
    height: '10px', 
    position: 'absolute', 
    right: '1px', 
    bottom: '6px', 
    zIndex: 1500 
}