export const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 6,
    borderRadius: 2,
  };

  export const editModalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    bgcolor: '#00000080',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

export const editBoxStyle = {
    bgcolor: 'background.paper',
    padding: 2,
    borderRadius: 2,
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2,
}

export const editTeamButtonSection = {
  width: '50%',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
}