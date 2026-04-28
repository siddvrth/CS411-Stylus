const feedbackStore = new Map();

export function saveFeedback(sessionId, feedback) {
	const record = {
		sessionId,
		feedback,
		savedAt: new Date().toISOString(),
	};

	feedbackStore.set(sessionId, record);
	return record;
}
