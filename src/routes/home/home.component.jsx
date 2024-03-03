import React, { useContext } from 'react';
import CreatePostButton from '../../components/create-post-button/create-post-button.component'
import Columns from '../../components/columns/columns.component';
import ScrollTopButton from '../../components/scroll-top-button/scroll-top-button.component';
import Footer from '../../components/footer/footer.component';

import { UserContext } from '../../contexts/user.context';

const Home = () => {    
  const stockdioKey = process.env.REACT_APP_STOCKDIO_API_KEY;    
  const { currentUser, userData } = useContext(UserContext);
  
  return (
    <div> 
      {currentUser && userData && userData.role === 'admin' && (<CreatePostButton />  )}               
      <Columns stockdioKey={stockdioKey}/>
      <ScrollTopButton />
      <Footer />  
    </div>
  );
}

export default Home;





