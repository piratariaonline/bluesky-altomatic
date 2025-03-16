import * as React from 'react';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import Typography from '@mui/joy/Typography';
import { Image, InsertLink } from '@mui/icons-material';
import CustomModal from './CustomModal';
import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';


interface Props {
	outputPost: (content: string) => void,
	clearEditor: boolean,
	rows: number,
}

interface TextSelection {
	start: number,
	end: number
}

const TextEditor: React.FC<Props> = (props) => {

	const MD_REGEX = {
		LINK: /\[(.*?)\]\((.*?)\)/g
	}

	const MAX_CHARACTERS = 300;

	const [counter, setCounter] = useState<number>(0);
	const [editorContent, setEditorContent] = useState<string>('');
    const [selectedTextLimits, setSelectedTextLimits] = useState<TextSelection>({start: 0, end: 0})
    const [linkUrl, setLinkUrl] = useState<string>('');
    const [showInsertLinkBox, setShowInsertLinkBox] = useState<boolean>(false);

	useEffect(() => {
		if (props.clearEditor) {
			setEditorContent('');
			setCounter(0);
		}
			
	}, [props.clearEditor])

	const renderCounter = () => (
		<Typography level="body-xs" sx={{ ml: 'auto' }}>
			{counter} caracter{counter > 1 && 'es'}
		</Typography>
	)

	const renderToolbox = () => {
		const handleURLonClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			event.currentTarget.blur();
			setShowInsertLinkBox(true);
		}

		const handleImageonClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			event.currentTarget.blur();
			// TODO
		}

		return (
			<Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
			<IconButton variant="outlined" color="neutral" onClick={handleURLonClick} title='URL'>
				<InsertLink/>
			</IconButton>
			<IconButton variant="outlined" color="neutral" onClick={handleImageonClick} title='Imagens'>
				<Image/>
			</IconButton>
			</Box>
		)
	}

	const handleSelect = (event: any) => {
		const { selectionStart, selectionEnd } = event.target;
		const start = selectionStart ?? 0;
        const end = selectionEnd ?? event.target.length;
        setSelectedTextLimits({start, end})
	}

    const handleChange = (event: any) => {
        const { value } = event.target;

        if (value.length <= MAX_CHARACTERS || value.length < editorContent.length) {
			setEditorContent(value)
			countCharacters(value)
			props.outputPost(value)
		}
    }

	const countCharacters = (rawText: string) => {
		let rawCount = rawText.length;
		let adjustedCount = rawCount;
		let match;

		// Despreza caracteres adicionais do markdown de link
		while ((match = MD_REGEX.LINK.exec(rawText)) !== null) {
			const matchedLength = match[0].length;
			const textLength = match[1].length;
			adjustedCount = adjustedCount - matchedLength + textLength;
		}
	  
		setCounter(adjustedCount);
	}

	const handleCreateLink = () => {
		const {start, end } = selectedTextLimits;

		setEditorContent((prev) => {
			const newVal = `${[
				prev.slice(0, start),
				'[',prev.slice(start, end),']',
				'(',linkUrl,')',
				prev.slice(end, prev.length),
			].join('')}`
			props.outputPost(newVal);
			return newVal;
		})

		setShowInsertLinkBox(false);
	}

	useEffect(() => console.log(showInsertLinkBox), [showInsertLinkBox]);

  return (
    <>
		<Textarea
			placeholder="Cria sua postagem aqui!"
			value={editorContent}
			onChange={handleChange}
			onSelect={handleSelect}
			minRows={props.rows}
			maxRows={props.rows}
			startDecorator={renderToolbox()}
			endDecorator={renderCounter()}
			sx={{ minWidth: 300 }}
		/>

		<CustomModal show={showInsertLinkBox} onClose={() => setShowInsertLinkBox(false)}>
			<Typography>Criar link</Typography>
				<TextField
					label="URL do link"
					fullWidth
					margin="normal"
					onChange={(e) => setLinkUrl(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleCreateLink()}
				/>
		</CustomModal>
    </>
	);
}

export default TextEditor;