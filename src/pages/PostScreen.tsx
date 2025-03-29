import React, { useEffect, useState } from "react";
import { Container, Button, Typography, Box, Grid2, Avatar} from "@mui/material";
import { AtpAgent, RichText } from "@atproto/api";
import PostEditor from "../components/PostEditor";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import markdownit from 'markdown-it';
import processFacetsFromMarkdown from "../services/FacetsProcessor";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import './PostScreen.css';
import { Send } from "@mui/icons-material";
import Loading from "../components/Loading";
import ProfileHeader from "../components/ProfileHeader";
import Preview from '../components/Preview';
import CustomModal from "../components/CustomModal";
import AltTextEditor from "../components/AltTextEditor";
import ViewportManager from '../services/ViewportManager';

export interface FileWithAlt {
	file: File;
	alt: string;
}

const PostScreen: React.FC<{ agent: AtpAgent, onLogout: () => void }> = ({ agent, onLogout }) => {

	const {SX, Spacing} = ViewportManager;

    const [post, setPost] = useState<string>('');
	const [isPosting, setIsPosting] = useState<boolean>(false);
	const [profile, setProfile] = useState<ProfileViewDetailed>();
	const [clearPost, setClearPost] = useState<boolean>(false);
	const [postBody, setPostBody] = useState<any>();
    const [preview, setPreview] = useState<string>('');
	const [files, setFiles] = useState<FileWithAlt[]>([]);
	const [timerToken, setTimerToken] = useState<any>();
	const [holdPostButton, setHoldPostButton] = useState<boolean>();
	const [showAltEditor, setShowAltEditor] = useState<boolean>(false);
	const [fileSelected, setFileSelected] = useState<number>();
	
	const md = markdownit('commonmark');

	const handleFetchProfileData = async () => {
		const profile = await agent.getProfile({actor: agent.did!});
		setProfile(profile.data);
	}
	useEffect(() => { handleFetchProfileData() }, []);

	const handlePostProcessing = () => {
		setClearPost(false);
		processPostContent();
		processPreviewContent();
	}
	useEffect(handlePostProcessing, [post]);

	const processPostImages = async () => {
		const images = [];
		if (files.length > 0) {
			try {
				for (const fileWithAlt of files) {
					const buffer = await fileWithAlt.file.arrayBuffer();
					const byteArray = new Uint8Array(buffer);
					const encoding = fileWithAlt.file.type;
					const { data } = await agent.uploadBlob(byteArray, { encoding });

					images.push({
							alt: fileWithAlt.alt,
							image: data.blob,
							// aspectRatio: {
							// 	width: 1000,
							// 	height: 500
							// }
					})
				}
			} catch (err) {
				console.log(err);
			}			
		}
		return images;
	}

	const processPostContent = () => {
		const message = new RichText({ text: post });
		const { cleanText, adjustedLinks, adjustedMentions } = processFacetsFromMarkdown(post);

		if (timerToken)
			clearTimeout(timerToken);

		setHoldPostButton(true);
		const timer = setTimeout(() => {
			message.detectFacets(agent)
				.then(() => {
					let linkIndex = 0;
					let mentionIndex = 0;
					for (const segment of message.segments()) {
						if (segment.isLink() && segment.link) {
							if (adjustedLinks && adjustedLinks[linkIndex]) {
								const { start, end } = adjustedLinks[linkIndex];
								if (segment.facet) {
									segment.facet.index.byteStart = start;
									segment.facet.index.byteEnd = end;
								}
								linkIndex++;
							}
						}
						if (segment.isMention() && segment.mention) {
							if (adjustedMentions && adjustedMentions[mentionIndex]) {
								const { start, end } = adjustedMentions[mentionIndex];
								if (segment.facet) {
									segment.facet.index.byteStart = start;
									segment.facet.index.byteEnd = end;
								}
								mentionIndex++;
							}
						}
					}

					const postToSend = {
						text: cleanText,
						facets: message.facets,
						embed: null,
						createdAt: new Date().toISOString(),
					}

					setPostBody(postToSend);
					setHoldPostButton(false);
				});
		}, 500)

		setTimerToken(timer);
	}

	const processPreviewContent = () => {
		const lineBrokenPost = post.replace(/\r?\n|\r/g, '<br/>');
		const markdown = md.render(lineBrokenPost);
		setPreview(markdown);
	}

	const handleLogout = async () => {
		await agent.logout();
		localStorage.removeItem(`altomatic-${agent.serviceUrl.origin}`);
		onLogout();
	}

	const handleClearEditor = () => {
		setClearPost(true);
		setFileSelected(undefined);
		setPostBody(undefined);
		setFiles([]);
		setPreview('');
	}

	const handleRemoveFile = (index: number) => {
		if (index !== undefined) {
			const toRemove = [...files];
			toRemove.splice(index, 1);
			setFiles(toRemove);
		}
	}

	const handlePost = async () => {
        try {
			setHoldPostButton(true);
			setIsPosting(true);
            if (postBody) {
				const post = {...postBody};
				const postImages = await processPostImages();
				post.embed = {
					$type: "app.bsky.embed.images",
					images: postImages,
				}
				await agent.post(post);
			}
        } catch (err) {
            console.error(`Erro ao postar: ${err}`);
        } finally {
			handleClearEditor();
			setHoldPostButton(false);
			setIsPosting(false);
		}
    };

	return (
		<>
			<Container maxWidth="lg">
				<Grid2 container spacing={Spacing.PostScreen.ContainerGrid} sx={SX.PostScreen.ContainerGrid}>
					{/* Editor */}
					<Grid2>
						<Box className='default-box editor-box' sx={SX.PostScreen.EditorBox}>
							<PostEditor onEditPost={setPost} onAttachImages={setFiles} clearEditor={clearPost} rows={8} />
							<Button variant="contained" color="primary"
								className='post-button'
								endIcon={!isPosting && <Send />}
								fullWidth
								onClick={handlePost}
								disabled={holdPostButton}
							>
								<Loading isLoading={isPosting}>Postar</Loading>
							</Button>
						</Box>
					</Grid2>
					{/* Pre visualizacao */}
					<Grid2>
						<Box className='default-box preview-box' sx={SX.PostScreen.PreviewBox}>
							<Card variant="outlined">
								<CardContent>
									<ProfileHeader profile={profile} onLogout={handleLogout} />
									<Preview preview={preview} files={files}
										onRemoveFile={handleRemoveFile}
										onAltEdit={(index) => {
											setFileSelected(index);
											setShowAltEditor(true);
										}}
									/>
								</CardContent>
							</Card>
						</Box>
					</Grid2>
				</Grid2>
			</Container>

			{/* Editor de Alt Text */}
			<CustomModal show={showAltEditor} onClose={() => setShowAltEditor(false)}>
			{
				files && fileSelected !== undefined && files[fileSelected] ? (
					<AltTextEditor
						files={files}
						fileIndex={fileSelected}
						onClose={() => setShowAltEditor(false)}
					/>
				) : (<></>)
			}
			</CustomModal>
		</>
	);
};

export default PostScreen;
 