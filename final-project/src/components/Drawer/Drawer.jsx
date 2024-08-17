// import { makeStyles } from '@material-ui/core/styles';
import PermanentDrawer from './PermanentDrawer';


// const useStyles = makeStyles((theme) => ({
//     root: {
//         display: 'flex',
//     },
//     content: {
//         flexGrow: 1,
//         padding: theme.spacing(3),
//     },
// }));

const DrawerNav = () => {
    // const classes = useStyles();

    return (
        <div>
            <PermanentDrawer />
            <main>
                {/* Your main content goes here */}
                <h1>Main Content</h1>
                <p>This is where your main content will appear.</p>
            </main>
        </div>
    );
};

export default DrawerNav;

        // <div className={classes.root}>
        //     <PermanentDrawer />
        //     <main className={classes.content}>
        //         <h1>Main Content</h1>
        //         <p>This is where your main content will appear.</p>
        //     </main>
        // </div>