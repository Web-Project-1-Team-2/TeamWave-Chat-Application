import Button from '@mui/material/Button';

const Btn = () => {

    return <Button 
    variant="contained"
    color="secondary" 
    onClick={() => alert('Something')}>Default</Button>
}

Btn.propTypes = {};

export default Btn
