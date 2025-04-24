import { IconButton, Textarea } from "@mui/joy";
import { Box, Button, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { FileWithAlt } from "../pages/PostScreen";
import CharCounter from '../components/CharCounter';
import './AltTextEditor.css';
import { Bolt, HourglassFull } from "@mui/icons-material";
import LLMService from "../services/LLMService";

interface Props {
	files: FileWithAlt[];
	fileIndex: number;
	onClose: () => void;
}

const AltTextEditor: React.FC<Props> = (props) => {

	const MAX_CHARACTERS = 2000;
	const llm = new LLMService();

	const { files, fileIndex, onClose } = props;

	const [altEditorFocused, setAltEditorFocused] = useState<boolean>(false);
	const [altText, setAltText] = useState<string>(files[fileIndex].alt);
	const [charCount, setCharCount] = useState<number>(0);
	const [loadingAltGen, setLoadingAltGen] = useState<boolean>(false);

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = event.target;

		if (value.length <= MAX_CHARACTERS || value.length < altText.length) {
			setAltText(value);
			setCharCount(value.length); 
		}
	}

	const handleAccept = () => {
		files[fileIndex].alt = altText;
		onClose();
	}

	const generateAltText = async () => {
		setLoadingAltGen(true);
		const fileToCaption = files.map(f => f.file)[fileIndex];
		const res = await llm.sendImage(fileToCaption);
		const altText = res ? res.data.translated : files[fileIndex].alt;
		files[fileIndex].alt = altText;
		setAltText(altText);
		setLoadingAltGen(false);
	}

	const renderToolbox = () => {
		const handleAICaptioning = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			event.currentTarget.blur();
			generateAltText();
		}

		return (
			<Box className='editor-toolbox'>
				<Tooltip arrow title='Gerar descrição' placement='top'>
					<IconButton variant="outlined" color="neutral" onClick={handleAICaptioning} disabled={loadingAltGen}>
						{loadingAltGen ? <HourglassFull/> : <Bolt/>}
					</IconButton>
				</Tooltip>
			</Box>
		)
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
					startDecorator={renderToolbox()}
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