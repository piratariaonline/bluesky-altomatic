import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useDropzone } from 'react-dropzone';
import './UploadMedia.css';


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
		onDrop: (acceptedFiles) =>
			// Incrementa os arquivos caso busque novamente tendo já carregado
			// files.length < 4 && setFiles((prev) => [...prev].concat(acceptedFiles).slice(0, 4)),

			// Substitui o que já existe pelo novo carregado
			setFiles(acceptedFiles.slice(0, 4)),
	});

	const handleAccept = () => {
		onUpload(files);
		setFiles([]);
		onClose()
	}

	return (
		<>
			<Box className='upload-box' {...getRootProps()}>
				<input {...getInputProps()} />
				<Typography color='textSecondary'>
					{
						files.length > 0
							? `${files.length} image${files.length > 1 ? 'ns' : 'm'} selecionada${files.length > 1 ? 's' : ''}`
							: 'Arraste e solte imagens para carregar, ou clique para escolher'
					}
				</Typography>
				<Button variant="contained" color='info' className='select-button'>
					Escolher imagens
				</Button>
			</Box>
			<Box className='confirm-button'>
				<Button variant="contained" color='success' fullWidth onClick={handleAccept}>OK</Button>
			</Box>
		</>
	);
};

export default UploadMedia;
