
  
  // overwrite the `plugins` property to use a custom getter
  Object.defineProperty(navigator, 'plugins', {
    get: function() {
      // this just needs to have `length > 0`, but we could mock the plugins too
      return [{
        filename:'internal-pdf-viewer',
        name:'Chrome PDF Plugin',
        description:'Portable Document Format',

      },{
        filename:'internal-pdf-viewer',
        description:'Portable Document Format',
        name:'Chrome PDF Plugin'
      },{
        filename:'internal-pdf-viewer',
        description:'Portable Document Format',
        name:'Chrome PDF Plugin'
      }];
    },
  });
  Object.defineProperty(navigator, 'webdriver', { get: () => false, });

  Object.defineProperty(navigator, 'languages', {
    get: function() {
      return ["zh-CN", "zh", "en", "fr", "ja", "zh-TW", "es"];
    },
  });