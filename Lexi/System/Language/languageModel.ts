import { ChatGPTAPIBrowser } from 'chatgpt'

interface Response {
	status: number,
	message: string | ''
}

export const initialize = ({
	lexi,
	email,
	password,
	onSuccess,
	onFailure
} : {
	lexi: ChatGPTAPIBrowser,
	email: string,
	password: string,
	onSuccess: (res: Response) => void
	onFailure: (res: Response) => void
}) => {
	(async() => {
		try {
			const { ChatGPTAPIBrowser } = await import('chatgpt')

			lexi = new ChatGPTAPIBrowser({
				email,
				password
			})
			await lexi.init()
			const response = await lexi.sendMessage('Is your language model operational?')
			onSuccess({ status: 200, message: response })
		}
		catch(e) {
			const error = e as any
			const status = error.statusCode || error.code || 500
			const message = error.message || 'internal error'
			onFailure({ status, message })
		}
	})()
}