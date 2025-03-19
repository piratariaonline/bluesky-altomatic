import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useDropzone } from 'react-dropzone';
import AtpAgent from "@atproto/api";

interface Props {
	agent: AtpAgent,
	onUpload: (images: any[]) => void ,
	onClose: () => void
}

// TODO: Adicionar loading no OK e fechar modal ao completar

const UploadMedia: React.FC<Props> = (props) => {

	const { agent, onUpload, onClose } = props;

	const [files, setFiles] = useState<any[]>([])

	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			'image/*': ['.jpeg', '.jpg', '.png', '.gif'], // Accept only image files
		},
		onDrop: (acceptedFiles) => {
			setFiles(acceptedFiles.slice(0, 4))
			onUpload(acceptedFiles.slice(0, 4));
		},
	});

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
				<Button variant="contained" color='success' fullWidth onClick={onClose}>OK</Button>
			</Box>
		</>
	);
};

export default UploadMedia;
