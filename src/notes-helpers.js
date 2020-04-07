export const findFolder = (folders = [], folderId) =>
  folders.find((folder) => folder.id === folderId);

export const findNote = (notes, noteId) => {
  console.log(`notes in findNote is `);
  console.log(`note id is ${noteId}`);
  console.log("find note result is", notes.find((note) => noteId === note.id));
};

/*
export const findNote = (notes=[], noteId) =>
  notes.find(note => note.id === noteId)
*/

export const getNotesForFolder = (notes = [], folderId) =>
  !folderId ? notes : notes.filter((note) => note.folder === folderId);

export const countNotesForFolder = (notes = [], folderId) =>
  notes.filter((note) => note.folderId === folderId).length;
