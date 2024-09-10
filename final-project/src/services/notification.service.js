import { toast, Bounce } from 'react-toastify';


export const notifyError = (message) => toast.error(message, {
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
});

export const notifySuccess = (message) => toast.success(message, {
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
});

export const notifyDirectMessage = (messageComponent) => toast(messageComponent, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
});

export const notifyChannelMessage = (messageComponent) => toast(messageComponent, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
});