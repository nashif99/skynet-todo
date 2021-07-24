const generateWebPage = (name, userID, filePath) => {
    return new File(
      'index.html',
      {
        type: 'text/html',
      }
    );
  };
  export default generateWebPage;