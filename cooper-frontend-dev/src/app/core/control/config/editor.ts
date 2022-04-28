import "quill-mention";

const atValues = [
  { id: 1, value: "Fredrik Sundqvist" },
  { id: 2, value: "Patrik Sjölin" }
];
export const quillConfiguration = {

    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"]
    ],
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@", "#"],
      source: function(searchTerm:any, renderItem:any, mentionChar:any) {
        let values:any;
        if (mentionChar === "@" || mentionChar === "#") {
          values = atValues;
        }
        if (searchTerm.length === 0) {
          renderItem(values, searchTerm);
        } else {
          const matches = [];
          for (let i = 0; i < values.length; i++)
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);
          renderItem(matches, searchTerm);
        }
      }
    
  },

  // toolbar: [
  //   ['bold', 'italic', 'underline', 'strike'],
  //   ['blockquote', 'code-block'],
  //   [{ list: 'ordered' }, { list: 'bullet' }],
  //   [{ header: [1, 2, 3, 4, 5, 6, false] }],
  //   [{ color: [] }, { background: [] }],
  //   ['link'],
  //   ['clean']
  // ],
  
};
