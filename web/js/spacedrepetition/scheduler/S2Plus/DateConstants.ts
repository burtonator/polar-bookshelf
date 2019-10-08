export const today = new Date();

export const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

export const oneDayAgo = new Date(today);
oneDayAgo.setDate(oneDayAgo.getDate() - 1);

export const oneWeekAgo = new Date(today);
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

export const twoDaysInFuture = new Date(today);
twoDaysInFuture.setDate(twoDaysInFuture.getDate() + 2);

export const twoWeeksInFuture = new Date(today);
twoWeeksInFuture.setDate(twoWeeksInFuture.getDate() + 2 * 7);
