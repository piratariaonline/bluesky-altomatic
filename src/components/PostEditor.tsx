import * as React from 'react';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import { Image, InsertLink } from '@mui/icons-material';
import CustomModal from './CustomModal';
import { Button, TextField, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import UploadMedia from './UploadMedia';
import { FileWithAlt } from '../pages/PostScreen';
import CharCounter from './CharCounter';
import './PostEditor.css';

interface Props {
	onEditPost: (content: string) => void,
	onAttachImages: (images: FileWithAlt[]) => void,
	clearEditor: boolean,
	rows: number,
}

interface TextSelection {
	start: number,
	end: number
}

const PostEditor: React.FC<Props> = (props) => {

	const { onEditPost, onAttachImages, clearEditor, rows } = props;

	const MD_REGEX = {
		LINK: /\[(.*?)\]\((.*?)\)/g
	}

	const MAX_CHARACTERS = 300;

	const [counter, setCounter] = useState<number>(0);
	const [editorContent, setEditorContent] = useState<string>('');
    const [selectedTextLimits, setSelectedTextLimits] = useState<TextSelection>({start: 0, end: 0})
    const [linkUrl, setLinkUrl] = useState<string>('');
    const [showInsertLinkBox, setShowInsertLinkBox] = useState<boolean>(false);
    const [showInsertImageBox, setShowInsertImageBox] = useState<boolean>(false);

	const renderToolbox = () => {
		const handleURLonClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			event.currentTarget.blur();
			setShowInsertLinkBox(true);
		}

		const handleImageonClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			event.currentTarget.blur();
			setShowInsertImageBox(true);
		}

		return (
			<Box className='editor-toolbox'>
				<Tooltip arrow title='Criar link' placement='top'>
					<IconButton variant="outlined" color="neutral" onClick={handleURLonClick}>
						<InsertLink/>
					</IconButton>
				</Tooltip>
				<Tooltip arrow title='Inserir imagens' placement='top'>
					<IconButton variant="outlined" color="neutral" onClick={handleImageonClick}>
						<Image/>
					</IconButton>
				</Tooltip>
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
			props.onEditPost(value)
		}
    }

	const countCharacters = (rawText: string) => {
		let rawCount = rawText.length;
		let adjustedCount = rawCount;
		let match;

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
			const url = !linkUrl.startsWith('https://') && !linkUrl.includes('://') ?
				`https://${linkUrl}` : linkUrl;
			const newVal = `${[
				prev.slice(0, start),
				'[',prev.slice(start, end),']',
				'(',url,')',
				prev.slice(end, prev.length),
			].join('')}`
			onEditPost(newVal);
			return newVal;
		})

		setShowInsertLinkBox(false);
	}

	const handleUploadImage = (files: File[]) => {
		onAttachImages(files.map(file => ({ file, alt: ''})));
		setShowInsertImageBox(false);
	}

	const handleClearEditor = () => {
		if (clearEditor)
			handleChange({target: { value: ''}})
	}
	useEffect(handleClearEditor, [clearEditor]);

  	return (
		<>
			<Textarea
				className='text-editor'
				placeholder='Cria sua postagem aqui!'
				value={editorContent}
				onChange={handleChange}
				onSelect={handleSelect}
				minRows={rows}
				maxRows={rows}
				startDecorator={renderToolbox()}
				endDecorator={<CharCounter count={counter}/>}
			/>

			<CustomModal show={showInsertLinkBox} onClose={() => setShowInsertLinkBox(false)}>
				<Box className='create-link-box'>
					<TextField fullWidth label="URL do link" size="small" onChange={(e) => setLinkUrl(e.target.value)}/>
					<Button className='ok-btn' variant='contained' color='success' onClick={handleCreateLink}>OK</Button>
				</Box>
			</CustomModal>

			<CustomModal show={showInsertImageBox} onClose={() => setShowInsertImageBox(false)}>
				<UploadMedia onUpload={handleUploadImage} onClose={() => setShowInsertImageBox(false)}/>
			</CustomModal>
		</>
	);
}

export default PostEditor;