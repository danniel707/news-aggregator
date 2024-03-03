import PostsList from '../posts-list/posts-list.component'

import './columns.styles.css'

const Columns = ({ stockdioKey }) => {
 
  return (    
    <div className="columns-container">
      <div className="left-column-container">        
        <iframe
          title="News list" 
          id='st_3d6f2c74082c4fea90c7ae4e284d330a' 
          frameBorder='0' 
          scrolling='no' width='100%' 
          height='100%' 
          src={`https://api.stockdio.com/visualization/financial/charts/v1/EconomicNews?app-key=${stockdioKey}&country=US&includeDescription=false&includeImage=false&palette=Financial-Light&showBorderAndTitle=false&onload=st_3d6f2c74082c4fea90c7ae4e284d330a`}          
          >
        </iframe>
      </div>
      <div className="news-central-column">          
        <PostsList />      
      </div>
      <div className="right-column-container">
        <iframe
          title="Graphic Right"
          id='st_ee99fcf3c56e45928414921f3461cb91'
          frameBorder='0'
          scrolling='no'
          width='100%'
          height='100%'
          src={`https://api.stockdio.com/visualization/financial/charts/v1/MarketOverviewChart?app-key=${stockdioKey}&stockExchange=USA&dividends=true&splits=true&includeLogo=false&showHeader=true&palette=Financial-Light&title=Market%20Overview&onload=st_ee99fcf3c56e45928414921f3461cb91`}>
        </iframe>
      </div>
    </div>
  );
};

export default Columns;
