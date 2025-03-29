import { Textarea, Typography } from "@mui/joy";
import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { FileWithAlt } from "../pages/PostScreen";
import CharCounter from '../components/CharCounter';
import './AltTextEditor.css';

interface Props {
	files: FileWithAlt[];
	fileIndex: number;
	onClose: () => void;
}

const AltTextEditor: React.FC<Props> = (props) => {

	const MAX_CHARACTERS = 2000;

	const { files, fileIndex, onClose } = props;

	const [altEditorFocused, setAltEditorFocused] = useState<boolean>(false);
	const [altText, setAltText] = useState<string>(files[fileIndex].alt);
	const [charCount, setCharCount] = useState<number>(0);

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

	const handleAccept = () => {
		files[fileIndex].alt = altText;
		onClose();
	}

	return (
		<Box className='alt-editor'>
			<img
				src={URL.createObjectURL(files[fileIndex].file)}
				alt={files[fileIndex].alt}
				style={{ maxWidth: '100%', maxHeight: '100%', marginBottom: 40 }}
			/>
			<Box sx={{ position: 'relative', mt: 1, mb: 1 }}>
				<Textarea
					className='text-editor'
					value={altText}
					sx={{ opacity: altEditorFocused ? 0.9 : 1 }}
					onFocus={() => setAltEditorFocused(true)}
					onBlur={() => setAltEditorFocused(false)}
					onChange={handleChange}
					minRows={altEditorFocused ? 8 : 1}
					maxRows={altEditorFocused ? 8 : 1}
					placeholder="Texto alternativo"
					endDecorator={<CharCounter count={charCount}/>}
				/>
			</Box>

			<Button color="success" fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleAccept}>
				OK
			</Button>
		</Box>
	)
}

export default AltTextEditor;