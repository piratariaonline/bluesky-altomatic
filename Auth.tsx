import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { AtpAgent, AtpSessionData, CredentialSession } from '@atproto/api';
import { jwtDecode } from 'jwt-decode';
import DataEncrypter from '../tools/DataEncrypter';

interface Props {
	onLogin: (agent: AtpAgent) => void
}

const Auth: React.FC<Props> = (props) => {

	const {onLogin} = props;
	const securitySvc = new DataEncrypter();
	const isProduction = process.env.NODE_ENV === 'production';

	const atProtoInstance = new URL(process.env.ATPROTO_INSTANCE!); // Bluesky

	const [handle, setHandle] = useState(isProduction ? '' : process.env.BSKY_TEST_ACCOUNT!);
	const [appKey, setAppKey] = useState(isProduction ? '' : process.env.BSKY_TEST_APPKEY!);// 'acn2-bl6g-qrds-46uv'

	const [error, setError] = useState('');

	const creds = new CredentialSession(atProtoInstance);
	const agent = new AtpAgent(creds);

	useEffect(() => {
		if (!agent.hasSession) {
			const sessionKey = `altomatic-${atProtoInstance.origin}`;
			const sessionString = localStorage.getItem(sessionKey);

			if (sessionString) {
				const sessionValue = JSON.parse(securitySvc.decryptData(sessionString)) as AtpSessionData;
				const decodedJwt = jwtDecode(sessionValue.accessJwt);
				const accessJwtExpiration = decodedJwt.exp ? decodedJwt.exp * 1000 : Date.now() + 60 * 60 * 1000;
				if (new Date(accessJwtExpiration) > new Date()) {
					agent.resumeSession(sessionValue);
					agent.sessionManager.refreshSession()
						.then(() => {
							const refreshedSessionValue = securitySvc.encryptData(JSON.stringify(agent.session));
							localStorage.setItem(sessionKey, refreshedSessionValue);
						});
				}
				else
					setError(`Falha no login: sessão expirada.`);

				onLogin(agent);
			}
		}
	}, [])

	const handleLogin = async () => {
		const sessionKey = `altomatic-${atProtoInstance.origin}`;
		
		try {
			await agent.login({ identifier: handle, password: appKey });
			if (agent.session) {
				const sessionValue = securitySvc.encryptData(JSON.stringify(agent.session));
				localStorage.setItem(sessionKey, sessionValue);
			}

			onLogin(agent);
		} catch (err) {
			setError(`Falha no login: ${err}`);
		}
	};

	return (
		<Container maxWidth="sm">
			<Box sx={{ mt: 5, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: "white" }}>
				<Typography variant="h4" gutterBottom>BSky ALTomatic</Typography>
				{error && <Alert severity="error">{error}</Alert>}
				<TextField
					label="Usuário"
					fullWidth
					margin="normal"
					value={handle}
					onChange={(e) => setHandle(e.target.value)}
				/>
				<TextField
					label="Chave do App"
					type="password"
					fullWidth
					margin="normal"
					value={appKey}
					onChange={(e) => setAppKey(e.target.value)}
				/>
				<Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>Login</Button>
			</Box>
		</Container>
	);
};

export default Auth;
