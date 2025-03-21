import { DeleteForever } from "@mui/icons-material";
import { Box } from "@mui/material";
import { Interweave } from "interweave";
import { useState } from "react";
import CustomModal from "./CustomModal";
import AltTextEditor from "./AltTextEditor";

interface Props {
	preview: string;
	files: File[];
}

const Preview: React.FC<Props> = (props) => {

	const { preview, files } = props;

	const [showAltEditor, setShowAltEditor] = useState<boolean>(false);
	const [imgSelected, setImgSelected] = useState<number>();

	return (
		<>
			<Interweave className={'preview-text'} content={preview} />
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent:'center' }}>
			{
				files && files.map((file, index) => (
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
							}}>ALT</span>
							<DeleteForever fontSize='small' color='error' style={{
								backgroundColor: '#444444',
								borderRadius: '4px',
								opacity: 0.7
							}} />
						</div>
						<img
							src={URL.createObjectURL(file)}
							alt={`Pré visualização da imagem ${index + 1}`}
							style={{maxWidth: '100x', maxHeight: '100px'}}
						/>
					</Box>
				))
			}
			</Box>
			<CustomModal show={showAltEditor} onClose={() => setShowAltEditor(false)}>
			{
				files && imgSelected !== undefined && files[imgSelected] ? (
					<AltTextEditor
						file={files[imgSelected]}
						fileIndex={imgSelected}
						onSetAltText={(altText) => {
							// TODO: passar o alt text para a imagem no array do postBody
						}}
					/>
				) : (<></>)
			}
			</CustomModal>
		</>
	);
}

export default Preview;