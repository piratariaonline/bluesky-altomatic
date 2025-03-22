import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useDropzone } from 'react-dropzone';
interface Props {
	onUpload: (images: any[]) => void ,
	onClose: () => void
}

const UploadMedia: React.FC<Props> = (props) => {

	const { onUpload, onClose } = props;

	const [files, setFiles] = useState<any[]>([])

	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			'image/*': ['.jpeg', '.jpg', '.png'],
		},
		onDrop: (acceptedFiles) => {
			setFiles(acceptedFiles.slice(0, 4))
		},
	});

	const handleAccept = () => {
		onUpload(files);
		onClose()
	}

	return (
		<>
			<Box
			{...getRootProps()}
			sx={{
				border: '2px dashed #ccc',
				borderRadius: '4px',
				padding: '20px',
				textAlign: 'center',
				cursor: 'pointer',
			}}
			>
			<input {...getInputProps()} />
			<Typography color='textSecondary'>
				{
					files.length > 0
						? `${files.length} image${files.length > 1 ? 'ns' : 'm'} selecionada${files.length > 1 ? 's' : ''}`
						: 'Arraste e solte imagens para carregar, ou clique para escolher'
				}
				</Typography>
				<Button variant="contained" color='info' sx={{ mt: 2 }}>
					Escolher imagens
				</Button>
			</Box>
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
				<Button variant="contained" color='success' fullWidth onClick={handleAccept}>OK</Button>
			</Box>
		</>
	);
};

export default UploadMedia;
