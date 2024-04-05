import { persistor } from "@/redux/app/store";

export const clearReduxPersistedState = async () => {
  // now we need to clear persisted state to avoid data inconsistency if a different user logs in
  persistor.pause();
  await persistor.flush().then(() => {
    return persistor.purge();
  });
};

export const renderImage = (imageUrl) => {
  return `${import.meta.env.VITE_APP_SERVER_BASE_URL}/${imageUrl}`;
};
