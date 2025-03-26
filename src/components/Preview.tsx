import { DeleteForever } from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";
import { Interweave } from "interweave";
import { FileWithAlt } from "../pages/PostScreen";

interface Props {
	preview: string;
	files: FileWithAlt[];
	onRemoveFile: (fileIndex: number) => void;
	onAltEdit: (fileIndex: number) => void;
}

const Preview: React.FC<Props> = (props) => {

	const { preview, files, onRemoveFile, onAltEdit } = props;
	
	return (
		<>
			<Interweave className={'preview-text'} content={preview} />
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent:'center' }}>
			{
				files && files.map((fileWithAlt, index) => (
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
							<span className='alt-btn' onClick={() => onAltEdit(index)}>+ ALT</span>
							<DeleteForever fontSize='small' color='error' style={{
								backgroundColor: '#444444',
								borderRadius: '4px',
								opacity: 0.7,
								cursor: 'pointer'
							}} onClick={() => onRemoveFile(index)}/>
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
		</>
	);
}

export default Preview;