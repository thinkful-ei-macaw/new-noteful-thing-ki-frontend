export const findFolder = (folders = [], folderId) =>
  folders.find((folder) => folder.id === folderId);

export const findNote = (notes = [], noteId) => {
  return notes.find((note) => note.id === noteId);
};

export const getNotesForFolder = (notes = [], folderId) =>
  !folderId ? notes : notes.filter((note) => note.folder === folderId);

export const countNotesForFolder = (notes = [], folderId) =>
  notes.filter((note) => note.folderId === folderId).length;
