import React, { useEffect, useState } from "react";
import { Container, Button, Typography, Box, Grid2, Avatar} from "@mui/material";
import { AtpAgent, RichText } from "@atproto/api";
import TextEditor from "../components/TextEditor";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import markdownit from 'markdown-it';
import processFacetsFromMarkdown from "../services/FacetsProcessor";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import './PostScreen.css';
import { Send } from "@mui/icons-material";
import Loading from "../components/Loading";
import Profile from "../components/Profile";
import Preview from '../components/Preview';

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

	return (
		<>
			<Container maxWidth="lg">
				<Grid2 container spacing={{ xs: 0, md: 3}} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr 1.5fr' } }}>
					{/* Perfil */}
					<Grid2>
						<Box sx={{ mt: {xs: 1, md: 3}, p: {xs: 2, md: 3}, borderRadius: 2, boxShadow: 3, bgcolor: "white" }}>
							<Profile profile={profile} onLogout={handleLogout}/>
						</Box>
					</Grid2>
					{/* Editor */}
					<Grid2>
						<Box sx={{ mt: {xs: 1, md: 3}, p: {xs: 2, md: 3}, borderRadius: 2, boxShadow: 3, bgcolor: "white" }}>
							<TextEditor onEditPost={setPost} onAttachImages={setFiles} clearEditor={clearPost} rows={8} />
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
					{/* Pre visualizacao */}
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
									</Loading>
									<Preview preview={preview} files={files} />
								</CardContent>
							</Card>
						</Box>
					</Grid2>
				</Grid2>
			</Container>
		</>
	);
};

export default PostScreen;
 