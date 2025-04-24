import axios, { AxiosInstance } from 'axios';

const BASE_URL = process.env.REACT_APP_LLM_SERVICE_URL!;
const LLM_AUTH_USR = process.env.REACT_APP_LLM_SERVICE_USERNAME!;
const LLM_AUTH_PWD = process.env.REACT_APP_LLM_SERVICE_PASSWORD!;

export default class LLMService{

	api: AxiosInstance;
	tokenExp: Date | null = null;

	constructor() {
		const sessionToken = localStorage.getItem('altomatic-svc-token');
		if (sessionToken) {
			const sessionTtl = localStorage.getItem('altomatic-svc-ttl');
			if (sessionTtl) {
				const now = new Date();
				const ttl = new Date(sessionTtl);
				if (now.getTime() >= ttl.getTime()) {
					this.login();
					ttl.setMinutes(ttl.getMinutes() + 60);
					
				} else axios.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
				this.tokenExp = ttl;
			}
		} else this.login();
		this.api = axios.create({ baseURL: BASE_URL });
	}

	async login() {
		try {
			const ttl = new Date();
			ttl.setMinutes(ttl.getMinutes() + 60);
			const url = `${BASE_URL}/login`;
			const data = {
				username: LLM_AUTH_USR,
				password: LLM_AUTH_PWD,
			};

			const res = await axios.post(url, data);

			localStorage.setItem('altomatic-svc-token', res.data.access_token);
			axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
			localStorage.setItem('altomatic-svc-ttl', ttl.toISOString());
			this.tokenExp = ttl;
		} catch (err) {
			console.error(err);
		}
	}
  
	async sendImage(file: File) {
		const form = new FormData();
		form.append("file", file);
		const url = "/caption";
		const headers = {"Content-Type": "multipart/form-data"};
  
		try {
			const res = await this.api.post(url, form, {headers});
			return res;
		} catch (err) {
			console.error(err);
		}
	}
}