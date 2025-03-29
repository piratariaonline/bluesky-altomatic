import { DeleteForever } from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";
import { Interweave } from "interweave";
import { FileWithAlt } from "../pages/PostScreen";
import './Preview.css';

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
			<Interweave className='preview-text' content={preview} />
			<Box className='preview-images-container'>
			{
				files && files.map((fileWithAlt, index) => (
					<Box key={`preview-image-box-${index}`} className='preview-image-box'>
						<div className='preview-image-toolbar'>
							<Tooltip arrow title={`${fileWithAlt.alt === '' ? 'Adicionar' : 'Editar'} texto alternativo`}>
								<span className='alt-btn' onClick={() => onAltEdit(index)}>
									{fileWithAlt.alt === '' ? '+' : '✓'} ALT
								</span>
							</Tooltip>
							<Tooltip arrow title='Remover imagem'>
								<DeleteForever className='del-btn' onClick={() => onRemoveFile(index)}/>
							</Tooltip>
						</div>
						<Tooltip arrow title={fileWithAlt.alt} placement='top-start'>
							<img src={URL.createObjectURL(fileWithAlt.file)} alt={fileWithAlt.alt}/>
						</Tooltip>
					</Box>
				))
			}
			</Box>
		</>
	);
}

export default Preview;