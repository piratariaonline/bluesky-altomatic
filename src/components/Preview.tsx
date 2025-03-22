import { DeleteForever } from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";
import { Interweave } from "interweave";
import { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import AltTextEditor from "./AltTextEditor";
import { Button, Typography } from "@mui/joy";
import { FileWithAlt } from "../pages/PostScreen";

interface Props {
	preview: string;
	filesWithAlt: FileWithAlt[];
	onRemoveFile: (files: FileWithAlt[]) => void;
	onAltEdit: (files: FileWithAlt[]) => void;
}

const Preview: React.FC<Props> = (props) => {

	const { preview, filesWithAlt, onRemoveFile, onAltEdit } = props;

	const [showAltEditor, setShowAltEditor] = useState<boolean>(false);
	const [imgSelected, setImgSelected] = useState<number>();
	const [images, setImages] = useState<FileWithAlt[]>(filesWithAlt);
	const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

	useEffect(() => setImages(filesWithAlt), [filesWithAlt]);

	const handleRemoveImage = () => {
		if (imgSelected !== undefined) {
			const toRemove = [...images];
			toRemove.splice(imgSelected, 1);
			setImages(toRemove);
			onRemoveFile(toRemove);
		}
		setShowConfirmDelete(false);
	}

	return (
		<>
			<Interweave className={'preview-text'} content={preview} />
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent:'center' }}>
			{
				filesWithAlt && filesWithAlt.map((fileWithAlt, index) => (
					<Box
						key={index}
						sx={{
							border: '1px solid #ccc',
							borderRadius: '4px',
							padding: '0',
							textAlign: 'center',
							overflow: 'hidden',
							width: '120px',
							height: '80px',
							marginTop: '10px'
						}}
					>
						<div className='preview-image-toolbar'>
							<span className='alt-btn' onClick={() => {
								setImgSelected(index);
								setShowAltEditor(true);
							}}>+ ALT</span>
							<DeleteForever fontSize='small' color='error' style={{
								backgroundColor: '#444444',
								borderRadius: '4px',
								opacity: 0.7,
								cursor: 'pointer'
							}} onClick={() => {
								setImgSelected(index);
								setShowConfirmDelete(true);
							}}/>
						</div>
						<Tooltip arrow title={fileWithAlt.alt} placement='top-start'>
							<img
								src={URL.createObjectURL(fileWithAlt.file)}
								alt={fileWithAlt.alt}
								style={{maxWidth: '100x', maxHeight: '100px'}}
							/>
						</Tooltip>
					</Box>
				))
			}
			</Box>
			<CustomModal show={showAltEditor} onClose={() => setShowAltEditor(false)}>
			{
				images && imgSelected !== undefined && images[imgSelected] ? (
					<AltTextEditor
						files={images}
						fileIndex={imgSelected}
						onSetAltText={onAltEdit}
						onClose={() => setShowAltEditor(false)}
					/>
				) : (<></>)
			}
			</CustomModal>
			<CustomModal show={showConfirmDelete} onClose={() => setShowConfirmDelete(false)}>
				<Typography>Remover esta imagem?</Typography>
				<Button color='success' onClick={handleRemoveImage}>OK</Button>
			</CustomModal>
		</>
	);
}

export default Preview;