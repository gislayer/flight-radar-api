const checkAndSetToken = () => {
    debugger;
    const bearerToken = 'Bearer asd';
    if (window.ui) {
      window.ui.preauthorizeApiKey('Authorization', bearerToken);
    } else {
      setTimeout(checkAndSetToken, 100);
    }
  };
  
  setTimeout(()=>{
    checkAndSetToken();
  },1000)