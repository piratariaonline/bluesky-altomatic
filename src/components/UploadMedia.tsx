import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import AtpAgent from "@atproto/api";

const UploadMedia: React.FC<{ agent: AtpAgent, onUpload: (images: any[]) => void }> = ({ agent, onUpload }) => {
	const [files, setFiles] = useState<File[]>([]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 1) {
			const extractedFiles: File[] = [];
			for (let i = 0; i < 4; i++)
				extractedFiles.push(event.target.files[i]);
			
			setFiles(extractedFiles);
		}
	};

	const handleUpload = async () => {
		if (files.length === 0) return;

		const images = [];

		try {
			for (const file of files) {
				const buffer = await file.arrayBuffer();
				const byteArray = new Uint8Array(buffer);
				const encoding = file.type;
				const { data } = await agent.uploadBlob(byteArray, { encoding });

				images.push({
					alt: '',
					image: data.blob,
					// aspectRatio: {
					// 	width: 1000,
					// 	height: 500
					// }
				})
			}
			onUpload(images);
		} catch (error) {
			console.error("Upload failed", error);
		}
	};

	return (
		<div>
			<input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} />
			<Button onClick={handleUpload}>Enviar</Button>
		</div>
	);
};

export default UploadMedia;
