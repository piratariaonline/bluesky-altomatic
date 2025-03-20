import React, { useEffect, useState } from "react";
import { Container, Button, Typography, Box, Grid2, Avatar} from "@mui/material";
import { AtpAgent, RichText } from "@atproto/api";
import TextEditor from "../components/TextEditor";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import markdownit from 'markdown-it';
import { Interweave } from "interweave";
import processFacetsFromMarkdown from "../tools/FacetsProcessor";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import './PostScreen.css';
import { DeleteForever, Logout, Send } from "@mui/icons-material";
import Loading from "../components/Loading";
import CustomModal from "../components/CustomModal";
import { Textarea } from "@mui/joy";
import AltTextEditor from "../components/AltTextEditor";

const PostScreen: React.FC<{ agent: AtpAgent, onLogout: () => void }> = ({ agent, onLogout }) => {

    const [post, setPost] = useState<string>('');
	const [isPosting, setIsPosting] = useState<boolean>(false);
	const [profile, setProfile] = useState<ProfileViewDetailed>();
	const [clearPost, setClearPost] = useState<boolean>(false);
	const [postBody, setPostBody] = useState<any>();
    const [preview, setPreview] = useState<string>('');
	const [files, setFiles] = useState<any[]>([]);
	const [images, setImages] = useState<any[]>([]);
	const [timerToken, setTimerToken] = useState<any>();
	const [holdPostButton, setHoldPostButton] = useState<boolean>();
	const [showAltEditor, setShowAltEditor] = useState<boolean>(false);
	const [imgSelected, setImgSelected] = useState<number>();
	const [altEditorFocused, setAltEditorFocused] = useState<boolean>(false);

	const md = markdownit('commonmark');

	useEffect(() => {
		const getProfile = async () => {
			const profile = await agent.getProfile({actor: agent.did!});
			setProfile(profile.data);
		}
		getProfile();
	}, [])

    const handlePost = async () => {
        try {
			setHoldPostButton(true);
			setIsPosting(true);
            if (postBody) {
				await agent.post(postBody);
			}
			setClearPost(true);
			setPostBody(undefined);
			setPreview('');
			setHoldPostButton(false);
			setIsPosting(false);
        } catch (err) {
            console.error(`Erro ao postar: ${err}`);
        }
    };

	const processImages = async () => {
		try {
			for (const file of files) {
				const buffer = await file.arrayBuffer();
				const byteArray = new Uint8Array(buffer);
				const encoding = file.type;
				const { data } = await agent.uploadBlob(byteArray, { encoding });

				setImages([
					...images,
					{
					imageBlob: {
						alt: '',
						image: data.blob,
						// aspectRatio: {
						// 	width: 1000,
						// 	height: 500
						// }
					},
					imageFile: file
				}])
			}
		} catch (err) {
			console.log(err);
		}
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
						createdAt: new Date().toISOString(),
					}

					setPostBody(postToSend);
					setHoldPostButton(false);
				});
		}, 500)

		setTimerToken(timer);
	}

	const processPreviewContent = () => {
		// TODO: Ajustar os thumbs, adicionar botões de função
		const lineBrokenPost = post.replace(/\r?\n|\r/g, '<br/>');
		const markdown = md.render(lineBrokenPost);
		setPreview(markdown);
	}

	const procesPreviewImages = () => {
		// TODO: Ajustar os processamentos de img para o post

	}

	const handleLogout = async () => {
		await agent.logout();
		localStorage.removeItem(`altomatic-${agent.serviceUrl.origin}`);
		onLogout();
	}

	useEffect(() => {
		setClearPost(false);
		processPostContent();
		processPreviewContent();
	}, [post]);


	// TODO: componentizar essa bagunça enorme aqui
	return (
		<>
			<Container maxWidth="lg">
				<Grid2 container spacing={{ xs: 0, md: 3}} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr 1.5fr' } }}>
					<Grid2>
						<Box sx={{ mt: {xs: 1, md: 3}, p: {xs: 2, md: 3}, borderRadius: 2, boxShadow: 3, bgcolor: "white" }}>
							<Loading isLoading={!profile}>
								<Box
									sx={{
									display: 'flex',
									flexDirection: { xs: 'row', md: 'column' }, // Row for mobile, column for desktop
									alignItems: { xs: 'center', md: 'flex-start' }, // Center align for mobile, left align for desktop
									gap: { xs: 2, md: 0 }, // Add gap between items for mobile
									}}
								>
									{
										profile && profile.avatar && (
											<Avatar
												alt={profile.displayName}
												src={profile.avatar}
												sx={{
												width: { xs: 50, md: 100 }, // Smaller avatar for mobile
												height: { xs: 50, md: 100 },
												mb: { xs: 0, md: 2 }, // No margin bottom for mobile
												}}
											/>
										)
									}

									<Box sx={{ flexGrow: 1 }}>
										<Typography variant="h5" sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
											{profile ? profile.displayName : '---'}
										</Typography>
										<Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
											<strong>@{profile ? profile.handle : '---'}</strong>
										</Typography>
									</Box>

									<Button
										variant="contained"
										color="error"
										sx={{
											minWidth: { xs: 'auto', md: '100%' }, // Auto width for mobile, full width for desktop
											p: { xs: 1, md: 2 }, // Smaller padding for mobile
											mt: { xs: 0, md: 2 }, // No margin top for mobile
										}}
										onClick={handleLogout}
									>
										<Logout />
										<Box sx={{ display: { xs: 'none', md: 'block' }, ml: 1 }}>
											Sair
										</Box>
									</Button>
								</Box>
							</Loading>
						</Box>
					</Grid2>
					<Grid2>
						<Box sx={{ mt: {xs: 1, md: 3}, p: {xs: 2, md: 3}, borderRadius: 2, boxShadow: 3, bgcolor: "white" }}>
							<TextEditor outputPost={setPost} outputImage={setFiles} clearEditor={clearPost} rows={8} />
							<Button
								variant="contained"
								color="primary"
								endIcon={isPosting ? undefined : <Send />}
								fullWidth
								sx={{ mt: 2 }}
								onClick={handlePost}
								disabled={holdPostButton}
							>
								<Loading isLoading={isPosting}>Postar</Loading>
							</Button>
						</Box>
					</Grid2>
					<Grid2>
						<Box sx={{ mt: {xs: 1, md: 3}, p: {xs: 2, md: 3}, borderRadius: 2, boxShadow: 3, bgcolor: "white" }}>
							<Card variant="outlined">
								<CardContent>
									<Loading isLoading={!profile}>
										<Box sx={{ display: 'flex' }}>
											{
												profile && profile.avatar && (
													<Avatar
														alt={profile.displayName}
														src={profile.avatar}
														sx={{ width: 40, height: 40, mb: 2, border: 'solid 1px grey' }}
													/>
												)
											}
											<Box sx={{ display: 'block', marginLeft: '10px' }}>
												<Typography variant="body1" sx={{ fontSize: '14px' }}>
													<strong>{profile ? profile.displayName : '---'}</strong>
												</Typography>
												<Typography variant="body1" sx={{ fontSize: '12px' }}>
													@{profile ? profile.handle : '---'}
												</Typography>
											</Box>
										</Box>
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
									</Loading>
								</CardContent>
							</Card>
						</Box>
					</Grid2>
				</Grid2>
			</Container>

			<CustomModal show={showAltEditor} onClose={() => setShowAltEditor(false)}>
			{
				files && imgSelected !== undefined && files[imgSelected] ? (
					<AltTextEditor 
						file={files[imgSelected]}
						fileIndex={imgSelected}
						outputAltText={(altText) => {
							// TODO: passar o alt text para a imagem no array do postBody
						}}
					/>
				) : (<></>)
			}
			</CustomModal>
		</>
	);
};

export default PostScreen;
 