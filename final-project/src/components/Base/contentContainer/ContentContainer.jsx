import PropTypes from 'prop-types';
import './ContentContainer.css';

const ContentContainer = ({ children }) => {
    return (
        <div id='content-container'>
            {children}
        </div>

    )
}

ContentContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ContentContainer
