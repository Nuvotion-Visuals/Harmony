export type Guid = string

export interface Message {
	guid: string,
	query?: string,
	queryTime?: string,
	response?: string,
	responseTime?: string,
	loading?: boolean,
	error?: string,
	scriptName?: string
}

export interface MessagesByGuid {
  [guid: Guid]: Message
}

export interface ConversationsByGuid {
	[guid: Guid]: {
		messageGuids: Guid[],
		conversationName: string
	}
}