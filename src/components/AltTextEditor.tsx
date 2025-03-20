import { Textarea } from "@mui/joy";
import { Box, Button } from "@mui/material";
import { useState } from "react";

interface Props {
	file: File;
	fileIndex: number;
	outputAltText: (altext: string) => void;
}

const AltTextEditor: React.FC<Props> = (props) => {

	const { file, fileIndex, outputAltText } = props;

	const [altEditorFocused, setAltEditorFocused] = useState<boolean>(false);
	
	// TODO: arrumar a "pulada" que a imagem dá quando o text perde foco
	// TODO: criar o assistente de prompt para IAgen
	return (
		<Box className='alt-editor'>
			<img
				src={URL.createObjectURL(file)}
				alt={`Pré visualização da imagem ${fileIndex + 1}`}
				style={{ maxWidth: '100%', maxHeight: '100%' }}
			/>
			<Box sx={{ position: 'relative', mt: 1, mb: 1 }}>
				<Textarea
					className='text-editor'
					sx={{
						position: altEditorFocused ? 'absolute' : 'relative',
						bottom: altEditorFocused ? 0 : 'auto',
						zIndex: altEditorFocused ? 1 : 'auto',
						backgroundColor: altEditorFocused ? 'background.paper' : 'transparent',
						opacity: altEditorFocused ? 0.9 : 1,
						height: altEditorFocused ? '200px' : '40px',
					}}
					onFocus={() => setAltEditorFocused(true)}
					onBlur={() => setAltEditorFocused(false)}
					minRows={altEditorFocused ? 8 : 1}
					placeholder="Add a description..."
				/>
			</Box>

			<Button color="success" fullWidth variant="contained" sx={{ mt: 2 }}>
				OK
			</Button>
		</Box>
	)
}

export default AltTextEditor;