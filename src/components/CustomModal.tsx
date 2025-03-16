import { Box, Modal, TextField, Typography } from "@mui/material";
import React from "react";

interface Props {
    show: boolean;
    onClose: () => void;
    children: any;
}

const CustomModal: React.FC<Props> = (props) => {
    return (
        <Modal open={props.show} onClose={props.onClose}>
            <Box
            sx={{
                position: "absolute", 
                top: "50%", 
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
            }}
            >
                {props.children}
            </Box>
        </Modal>
    )
}

export default CustomModal;