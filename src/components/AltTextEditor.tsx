import { Textarea, Typography } from "@mui/joy";
import { Box, Button } from "@mui/material";
import React, { useState } from "react";

interface Props {
	file: File;
	fileIndex: number;
	onSetAltText: (altext: string) => void;
}

const AltTextEditor: React.FC<Props> = (props) => {

	const MAX_CHARACTERS = 2000;

	const { file, fileIndex, onSetAltText } = props;

	const [altEditorFocused, setAltEditorFocused] = useState<boolean>(false);
	const [altText, setAltText] = useState<string>('');
	const [charCount, setCharCount] = useState<number>(0);

	// TODO: criar o assistente de prompt para IAgen
	// TODO: adicionar limitador de caracteres até 2000 nesse editor

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = event.target;

		if (value.length <= MAX_CHARACTERS || value.length < altText.length) {
			setAltText(value);
			setCharCount(value.length);
		}
	}

	const renderCounter = () => (
		<Typography level="body-xs" sx={{ ml: 'auto' }}>
			{charCount} caracter{charCount > 1 && 'es'}
		</Typography>
	)

	return (
		<Box className='alt-editor'>
			<img
				src={URL.createObjectURL(file)}
				alt={`Pré visualização da imagem ${fileIndex + 1}`}
				style={{ maxWidth: '100%', maxHeight: '100%', marginBottom: 40 }}
			/>
			<Box sx={{ position: 'relative', mt: 1, mb: 1 }}>
				<Textarea
					className='text-editor'
					sx={{ opacity: altEditorFocused ? 0.7 : 1 }}
					onFocus={() => setAltEditorFocused(true)}
					onBlur={() => setAltEditorFocused(false)}
					onChange={handleChange}
					minRows={altEditorFocused ? 8 : 1}
					placeholder="Texto alternativo"
					endDecorator={renderCounter()}
				/>
			</Box>

			<Button color="success" fullWidth variant="contained" sx={{ mt: 2 }}>
				OK
			</Button>
		</Box>
	)
}

export default AltTextEditor;