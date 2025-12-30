export const usePlaylistActions = () => {
  const openPlaylistDetails = (playlist: any) => {
    console.log('Open playlist:', playlist.title);
  };

  return {
    openPlaylistDetails,
  };
};
